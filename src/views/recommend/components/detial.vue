<script setup lang="ts">
import { reactive, onMounted, ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
// @ts-ignore
import { post } from '../../../utils/request'

const router = useRouter()
const route = useRoute()

const loading = ref(false)

const formData = reactive({
  city: '',
  budget: '',
  days: '',
})

const goBack = () => {
  router.back()
}

const activeDays = ref<number[]>([1])

const toggleDay = (day: number) => {
  const index = activeDays.value.indexOf(day)
  if (index > -1) {
    activeDays.value.splice(index, 1)
  } else {
    activeDays.value.push(day)
  }
}

const goToChat = () => {
  router.push('/chat')
}

const PERIOD_CONFIG = [
  { key: 'morning', time: '上午', timeColor: '#FF9500', bgColor: '#FFF5E6' },
  { key: 'afternoon', time: '下午', timeColor: '#007AFF', bgColor: '#E6F2FF' },
  { key: 'evening', time: '晚上', timeColor: '#34C759', bgColor: '#E6F9EE' },
]

const tripDetail = ref<any>({})
const errorMsg = ref('')

const itineraryData = computed(() => {
  const dailyItinerary = tripDetail.value?.dailyItinerary
  if (!dailyItinerary || !Array.isArray(dailyItinerary) || dailyItinerary.length === 0) {
    return []
  }

  return dailyItinerary.map((dayItem: any) => ({
    day: dayItem.day,
    date: dayItem.date || `第${dayItem.day}天`,
    periods: PERIOD_CONFIG.map((config) => {
      const periodData = dayItem[config.key] || {}
      return {
        time: config.time,
        timeColor: config.timeColor,
        bgColor: config.bgColor,
        spot: periodData.spot || '',
        duration: periodData.duration || '',
        ticket: periodData.ticket || '',
        transport: periodData.transportation || '',
        description: periodData.description || '',
      }
    }).filter((p) => p.spot),
  }))
})

const initTravelPlanDetail = async () => {
  loading.value = true
  try {
    const res = await post('/recommend', {
      city: formData.city,
      budget: formData.budget,
      days: formData.days,
    })
    // @ts-ignore
    if (res && res.success) {
      tripDetail.value = res
      activeDays.value = [1]
    } else {
      // @ts-ignore
      errorMsg.value = res.error || '获取行程详情失败'
    }
  } catch (error) {
    console.error('获取行程详情失败:', error)
    errorMsg.value = '网络请求失败，请重试'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  formData.city = (route.query.city as string) || '北京'
  formData.budget = (route.query.budget as string) || '5000'
  formData.days = (route.query.days as string) || '2'
  if (formData.city && formData.budget && formData.days) {
    initTravelPlanDetail()
  }
})
</script>

<template>
  <div class="detail-page">
    <!-- 顶部导航 -->
    <van-nav-bar
      left-text="返回"
      left-arrow
      :title="formData.city + '行程规划'"
      @click-left="goBack"
      fixed
      placeholder
    />
    <!-- 全屏加载状态 -->
    <div v-if="loading" class="loading-overlay">
      <van-loading vertical>
        <template #icon>
          <van-icon name="star-o" size="30" />
        </template>
        加载中...
      </van-loading>
    </div>
    <template v-else-if="errorMsg === ''">
      <!-- 行程概览卡片 -->
      <div class="overview-card">
        <div class="overview-content">
          <h2 class="overview-title">{{ formData.city }} · {{ formData.days }}天行程</h2>
          <span class="overview-budget">预算：¥{{ formData.budget }}</span>
        </div>
      </div>
      <!-- 每日行程 -->
      <div class="itinerary-list">
        <div
          v-for="dayItem in itineraryData"
          :key="dayItem.day"
          class="day-section"
        >
          <!-- 日期标题 -->
          <div class="day-header" @click="toggleDay(dayItem.day)">
            <span class="day-title">{{ dayItem.date }} · 第{{ dayItem.day }}天</span>
            <van-icon
              :name="activeDays.includes(dayItem.day) ? 'arrow-up' : 'arrow-down'"
              class="day-arrow"
            />
          </div>

          <!-- 行程内容 -->
          <div v-show="activeDays.includes(dayItem.day)" class="day-content">
            <div
              v-for="(period, index) in dayItem.periods"
              :key="index"
              class="period-card"
            >
              <!-- 时间段标签 -->
              <div class="period-tag" :style="{ color: period.timeColor, backgroundColor: period.bgColor }">
                {{ period.time }}
              </div>

              <!-- 景点信息 -->
              <div class="spot-info">
                <h3 class="spot-name">{{ period.spot }}</h3>
                <div class="spot-meta">
                  <span class="meta-item">
                    <van-icon name="clock-o" />
                    {{ period.duration }}
                  </span>
                  <span class="meta-item">
                    <van-icon name="ticket-o" />
                    {{ period.ticket }}
                  </span>
                </div>
                <div class="spot-transport">
                  <van-icon name="location-o" />
                  <span>{{ period.transport }}</span>
                </div>
                <p class="spot-desc">{{ period.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 预算明细 -->
      <div v-if="tripDetail.budgetBreakdown" class="budget-card">
        <h3 class="section-title">预算明细</h3>
        <div class="budget-list">
          <div class="budget-item">
            <span class="budget-label">住宿</span>
            <span class="budget-value">¥&nbsp;&nbsp;&nbsp;&nbsp;{{ tripDetail.budgetBreakdown.accommodation || 0 }}</span>
          </div>
          <div class="budget-item">
            <span class="budget-label">餐饮</span>
            <span class="budget-value">¥&nbsp;&nbsp;&nbsp;{{ tripDetail.budgetBreakdown.food || 0 }}</span>
          </div>
          <div class="budget-item">
            <span class="budget-label">交通</span>
            <span class="budget-value">¥&nbsp;&nbsp;{{ tripDetail.budgetBreakdown.transportation || 0 }}</span>
          </div>
          <div class="budget-item">
            <span class="budget-label">门票</span>
            <span class="budget-value">¥&nbsp;{{ tripDetail.budgetBreakdown.tickets || 0 }}</span>
          </div>
          <div class="budget-item">
            <span class="budget-label">其他</span>
            <span class="budget-value">¥ {{ tripDetail.budgetBreakdown.other || 0 }}</span>
          </div>
        </div>
        <div class="budget-total">
          <span class="budget-total-label">总计</span>
          <span class="budget-total-value">¥ {{ formData.budget }}</span>
        </div>
      </div>

      <!-- 温馨提醒 -->
      <div v-if="tripDetail.tips && tripDetail.tips.length" class="tips-card">
        <h3 class="section-title">
          <van-icon name="bulb-o" class="section-icon" />
          温馨提醒
        </h3>
        <div class="tips-list">
          <div v-for="(tip, index) in tripDetail.tips" :key="index" class="tip-item">
            <span class="tip-dot">•</span>
            <span class="tip-text">{{ tip }}</span>
          </div>
        </div>
      </div>

      <!-- 注意事项 -->
      <div v-if="tripDetail.warnings && tripDetail.warnings.length" class="warning-card">
        <h3 class="section-title">
          <van-icon name="warning-o" class="section-icon warning-icon" />
          注意事项
        </h3>
        <div class="warning-list">
          <div v-for="(warning, index) in tripDetail.warnings" :key="index" class="warning-item">
            <span class="warning-dot">•</span>
            <span class="warning-text">{{ warning }}</span>
          </div>
        </div>
      </div>

      <!-- 底部按钮 -->
      <div class="bottom-action">
        <van-button
          type="primary"
          block
          round
          class="chat-btn"
          @click="goToChat"
        >
          咨询 AI 助手
        </van-button>
      </div>
    </template>
    <van-empty v-else :description="errorMsg" image="error">
      <van-button type="primary">请重新规划行程</van-button>
    </van-empty>
  </div>
</template>

<style scoped>
.detail-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 80px;
}

/* 全屏加载遮罩 */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

/* 行程概览卡片 */
.overview-card {
  margin: 12px;
  padding: 20px 16px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.overview-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.overview-title {
  font-size: 20px;
  font-weight: 700;
  color: #333;
  margin: 0;
}

.overview-budget {
  font-size: 16px;
  font-weight: 600;
  color: #ff4d4f;
}

/* 每日行程 */
.itinerary-list {
  padding: 0 12px;
}

.day-section {
  margin-bottom: 8px;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
}

.day-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  cursor: pointer;
  transition: background 0.2s;
}

.day-header:active {
  background: #f9f9f9;
}

.day-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.day-arrow {
  font-size: 16px;
  color: #999;
  transition: transform 0.3s;
}

.day-content {
  padding: 0 16px 16px;
}

/* 时间段卡片 */
.period-card {
  padding: 16px 0;
  border-bottom: 1px solid #f0f0f0;
}

.period-card:last-child {
  border-bottom: none;
}

.period-tag {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
}

.spot-info {
  padding-left: 4px;
}

.spot-name {
  font-size: 18px;
  font-weight: 700;
  color: #333;
  margin: 0 0 10px 0;
}

.spot-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 8px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #666;
}

.meta-item .van-icon {
  font-size: 14px;
  color: #999;
}

.spot-transport {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  margin-bottom: 10px;
  font-size: 13px;
  color: #666;
}

.spot-transport .van-icon {
  font-size: 14px;
  color: #999;
  margin-top: 1px;
}

.spot-desc {
  font-size: 14px;
  color: #666;
  line-height: 1.7;
  margin: 0;
}

/* 预算明细 */
.budget-card,
.tips-card,
.warning-card {
  margin: 12px;
  padding: 20px 16px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: #333;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-icon {
  font-size: 20px;
  color: #4a90e2;
}

.warning-icon {
  color: #ff9500;
}

.budget-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.budget-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 15px;
}

.budget-label {
  color: #666;
}

.budget-value {
  color: #333;
  font-weight: 500;
}

.budget-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.budget-total-label {
  font-size: 16px;
  font-weight: 700;
  color: #333;
}

.budget-total-value {
  font-size: 18px;
  font-weight: 700;
  color: #ff4d4f;
}

/* 温馨提醒 */
.tips-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.tip-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}

.tip-dot {
  color: #4a90e2;
  font-weight: 700;
  flex-shrink: 0;
}

/* 注意事项 */
.warning-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.warning-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 14px;
  color: #ff9500;
  line-height: 1.6;
}

.warning-dot {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #ff9500;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
}

/* 空状态居中 */
:deep(.van-empty) {
  position: fixed;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 0;
}

/* 导航栏样式 */
:deep(.van-nav-bar__title) {
  font-size: 20px;
  font-weight: 600;
}

:deep(.van-nav-bar__text) {
  font-size: 16px;
}

:deep(.van-nav-bar .van-icon) {
  font-size: 20px;
}

/* 底部按钮 */
.bottom-action {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px 16px calc(12px + env(safe-area-inset-bottom));
  background: #fff;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
}

.chat-btn {
  --van-button-primary-background: #4a90e2;
  --van-button-primary-border-color: #4a90e2;
  height: 46px;
  font-size: 16px;
  font-weight: 600;
}
</style>
