<script setup lang="ts">
import { useRecommend } from './ts/hook'

const {
  form,
  errors,
  loading,
  result,
  guessList,
  validateField,
  handleSubmit,
  resetForm,
  goToDetail,
} = useRecommend()
</script>

<template>
  <div class="recommend-page">
    <header class="page-header">
      <h1>智能旅游推荐</h1>
      <p>输入您的需求，AI为您定制专属行程</p>
    </header>

    <div v-if="!result" class="form-section">
      <div class="card">
        <div class="form-group">
          <label class="form-label">目的地城市</label>
          <input
            v-model="form.city"
            class="form-input"
            placeholder="请输入目的地城市，如：北京"
            @blur="validateField('city')"
          />
        </div>

        <div class="form-group">
          <label class="form-label">预算（元）</label>
          <input
            v-model.number="form.budget"
            type="number"
            class="form-input"
            placeholder="请输入预算金额，最低100元"
            min="100"
            @blur="validateField('budget')"
          />
        </div>

        <div class="form-group">
          <label class="form-label">旅行天数</label>
          <input
            v-model.number="form.days"
            type="number"
            class="form-input"
            placeholder="请输入旅行天数（1-30天）"
            min="1"
            max="30"
            @blur="validateField('days')"
          />
        </div>

        <button class="btn-primary" :disabled="loading" @click="handleSubmit">
          <span v-if="loading" class="loading-spinner" style="margin-right: 8px; vertical-align: middle;"></span>
          {{ loading ? 'AI规划中...' : '开始推荐' }}
        </button>
      </div>

      <div class="guess-section">
        <h2 class="guess-title">⭐ 猜你想去</h2>
        <div class="guess-grid">
          <div
            v-for="(item, index) in guessList"
            :key="index"
            class="guess-card"
            @click="goToDetail(item)"
          >
            <div class="guess-image">
              <img :src="item.image" :alt="item.title" loading="lazy" />
            </div>
            <div class="guess-info">
              <h4 class="guess-name">{{ item.title }}</h4>
              <p class="guess-price">{{ item.price }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="result-section">
      <div class="result-header">
        <button class="back-btn" @click="resetForm">← 重新规划</button>
        <h2>{{ result.city }} · {{ result.days }}天行程</h2>
        <p class="budget-total">总预算：{{ result.totalBudget }}</p>
      </div>

      <div v-if="result.error" class="card error-card">
        <p>{{ result.error }}</p>
      </div>

      <template v-else>
        <div class="itinerary-list">
          <div v-for="day in result.dailyItinerary" :key="day.day" class="day-card card">
            <div class="day-header">
              <span class="day-badge">Day {{ day.day }}</span>
              <span class="day-date">{{ day.date }}</span>
            </div>

            <div class="period-list">
              <div class="period-item">
                <div class="period-tag period-morning">上午</div>
                <div class="period-content">
                  <h4>{{ day.morning.spot }}</h4>
                  <p class="period-meta">
                    <span>⏱ {{ day.morning.duration }}</span>
                    <span>🎫 {{ day.morning.ticket }}</span>
                    <span>🚌 {{ day.morning.transportation }}</span>
                  </p>
                  <p class="period-desc">{{ day.morning.description }}</p>
                </div>
              </div>

              <div class="period-item">
                <div class="period-tag period-afternoon">下午</div>
                <div class="period-content">
                  <h4>{{ day.afternoon.spot }}</h4>
                  <p class="period-meta">
                    <span>⏱ {{ day.afternoon.duration }}</span>
                    <span>🎫 {{ day.afternoon.ticket }}</span>
                    <span>🚌 {{ day.afternoon.transportation }}</span>
                  </p>
                  <p class="period-desc">{{ day.afternoon.description }}</p>
                </div>
              </div>

              <div class="period-item">
                <div class="period-tag period-evening">晚上</div>
                <div class="period-content">
                  <h4>{{ day.evening.spot }}</h4>
                  <p class="period-meta">
                    <span>⏱ {{ day.evening.duration }}</span>
                    <span>🎫 {{ day.evening.ticket }}</span>
                    <span>🚌 {{ day.evening.transportation }}</span>
                  </p>
                  <p class="period-desc">{{ day.evening.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="result.budgetBreakdown" class="card budget-card">
          <h3>💰 预算分配</h3>
          <div class="budget-list">
            <div class="budget-row">
              <span>住宿</span><span>{{ result.budgetBreakdown.accommodation }}</span>
            </div>
            <div class="budget-row">
              <span>餐饮</span><span>{{ result.budgetBreakdown.food }}</span>
            </div>
            <div class="budget-row">
              <span>交通</span><span>{{ result.budgetBreakdown.transportation }}</span>
            </div>
            <div class="budget-row">
              <span>门票</span><span>{{ result.budgetBreakdown.tickets }}</span>
            </div>
            <div class="budget-row">
              <span>其他</span><span>{{ result.budgetBreakdown.other }}</span>
            </div>
          </div>
        </div>

        <div v-if="result.tips?.length" class="card tips-card">
          <h3>💡 旅行贴士</h3>
          <ul>
            <li v-for="(tip, i) in result.tips" :key="i">{{ tip }}</li>
          </ul>
        </div>

        <div v-if="result.warnings?.length" class="card warnings-card">
          <h3>⚠️ 注意事项</h3>
          <ul>
            <li v-for="(w, i) in result.warnings" :key="i">{{ w }}</li>
          </ul>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.recommend-page {
  padding: 16px;
  padding-bottom: 24px;
}

.page-header {
  text-align: center;
  padding: 20px 0 16px;
}

.page-header h1 {
  font-size: 22px;
  font-weight: 700;
  color: var(--text);
}

.page-header p {
  font-size: 13px;
  color: var(--text-secondary);
  margin-top: 4px;
}

.result-header {
  padding: 12px 0;
}

.guess-section {
  margin-top: 24px;
}

.guess-title {
  text-align: center;
  font-size: 18px;
  color: #333333;
  font-weight: 600;
  padding-bottom: 12px;
  margin-bottom: 16px;
  border-bottom: 1px solid #e5e5e5;
}

.guess-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.guess-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid var(--border);
}

.guess-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.guess-card:active {
  transform: scale(0.98);
}

.guess-image {
  position: relative;
  width: 100%;
  padding-top: 56.25%;
  overflow: hidden;
  background: #f0f0f0;
}

.guess-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.guess-info {
  padding: 10px 12px 12px;
}

.guess-name {
  font-size: 14px;
  color: #333333;
  font-weight: 500;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 6px;
  min-height: 39px;
}

.guess-price {
  font-size: 14px;
  color: #FF5252;
  font-weight: 700;
}

@media (max-width: 767px) {
  .guess-grid {
    grid-template-columns: 1fr;
    margin: 0 16px;
  }

  .guess-section {
    margin-top: 20px;
  }
}

.back-btn {
  background: none;
  border: none;
  color: var(--primary);
  font-size: 14px;
  cursor: pointer;
  padding: 4px 0;
  margin-bottom: 8px;
}

.result-header h2 {
  font-size: 18px;
  font-weight: 700;
}

.budget-total {
  font-size: 14px;
  color: var(--primary);
  font-weight: 600;
  margin-top: 4px;
}

.error-card {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: var(--danger);
}

.day-card {
  margin-bottom: 12px;
}

.day-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.day-badge {
  background: var(--primary);
  color: #fff;
  padding: 2px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.day-date {
  font-size: 14px;
  color: var(--text-secondary);
}

.period-item {
  display: flex;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid var(--border);
}

.period-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.period-tag {
  flex-shrink: 0;
  width: 40px;
  height: 22px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2px;
}

.period-morning {
  background: #fef3c7;
  color: #d97706;
}

.period-afternoon {
  background: #dbeafe;
  color: #2563eb;
}

.period-evening {
  background: #ede9fe;
  color: #7c3aed;
}

.period-content h4 {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 4px;
}

.period-meta {
  display: flex;
  gap: 10px;
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 4px;
  flex-wrap: wrap;
}

.period-desc {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.5;
}

.budget-card {
  margin-bottom: 12px;
}

.budget-card h3 {
  font-size: 16px;
  margin-bottom: 12px;
}

.budget-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.budget-row {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  padding: 4px 0;
  border-bottom: 1px dashed var(--border);
}

.budget-row:last-child {
  border-bottom: none;
}

.tips-card,
.warnings-card {
  margin-bottom: 12px;
}

.tips-card h3,
.warnings-card h3 {
  font-size: 16px;
  margin-bottom: 8px;
}

.tips-card ul,
.warnings-card ul {
  padding-left: 18px;
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.8;
}

.warnings-card {
  background: #fffbeb;
  border: 1px solid #fde68a;
}
</style>
