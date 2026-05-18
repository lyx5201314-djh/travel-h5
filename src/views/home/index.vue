<script setup lang="ts">
import { useHome } from './ts/hook'

const {
  banners,
  currentBanner,
  categories,
  destinations,
  nextBanner,
  prevBanner,
  handleTouchStart,
  handleTouchEnd,
} = useHome()
</script>

<template>
  <div class="home-page">
    <!-- 轮播图 Banner -->
    <section class="banner-section">
      <div class="banner-slider" @touchstart="handleTouchStart" @touchend="handleTouchEnd">
        <div
          class="banner-track"
          :style="{ transform: `translateX(-${currentBanner * 100}%)` }"
        >
          <div v-for="(item, index) in banners" :key="index" class="banner-item">
            <div class="banner-image-placeholder">
              <img v-if="item.image" :src="item.image" :alt="item.title" />
              <div v-else class="placeholder-bg">
                <span>{{ item.title }}</span>
              </div>
            </div>
            <div class="banner-overlay"></div>
            <div class="banner-content">
              <h2 class="banner-title">{{ item.title }}</h2>
              <p class="banner-subtitle">{{ item.subtitle }}</p>
            </div>
          </div>
        </div>

        <!-- 左右箭头 -->
        <button class="banner-arrow banner-arrow-left" @click="prevBanner">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <button class="banner-arrow banner-arrow-right" @click="nextBanner">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>

        <!-- 指示器 -->
        <div class="banner-indicators">
          <span
            v-for="(_, index) in banners"
            :key="index"
            :class="['indicator', index === currentBanner ? 'indicator-active' : '']"
          ></span>
        </div>
      </div>
    </section>

    <!-- 分类导航 -->
    <section class="category-section">
      <div class="category-list">
        <div v-for="(cat, index) in categories" :key="index" class="category-item">
          <div class="category-icon" :style="{ backgroundColor: cat.color }">
            <van-icon :name="cat.icon" size="24" color="#fff" />
          </div>
          <span class="category-name">{{ cat.name }}</span>
        </div>
      </div>
    </section>

    <!-- 热门目的地 -->
    <section class="destinations-section">
      <div class="section-header">
        <h3 class="section-title">热门目的地</h3>
        <a class="view-all-link">查看全部</a>
      </div>

      <div class="destination-list">
        <div v-for="(dest, index) in destinations" :key="index" class="destination-card">
          <div class="destination-image">
            <img v-if="dest.image" :src="dest.image" :alt="dest.name" />
            <div v-else class="image-placeholder" :style="{ backgroundColor: dest.placeholderColor }">
              <span>{{ dest.name }}</span>
            </div>
          </div>
          <div class="destination-info">
            <h4 class="destination-name">{{ dest.name }}</h4>
            <div class="destination-location">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="location-icon">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span>{{ dest.location }}</span>
            </div>
            <div class="destination-rating">
              <svg viewBox="0 0 24 24" fill="currentColor" class="star-icon">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
              <span>{{ dest.rating }}</span>
            </div>
            <p class="destination-desc">{{ dest.description }}</p>
            <div class="destination-footer">
              <span class="destination-price">{{ dest.price }}</span>
              <button class="book-btn">立即预订</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-page {
  min-height: 100%;
  background-color: #F5F5F5;
  padding-bottom: 20px;
}

/* ===== 轮播图 Banner ===== */
.banner-section {
  /* padding: 16px; */
  padding-bottom: 8px;
}

.banner-slider {
  position: relative;
  /* border-radius: 16px; */
  overflow: hidden;
  aspect-ratio: 16 / 10;
  touch-action: pan-y;
}

.banner-track {
  display: flex;
  transition: transform 0.4s ease;
  height: 100%;
}

.banner-item {
  flex: 0 0 100%;
  position: relative;
  height: 100%;
}

.banner-image-placeholder {
  width: 100%;
  height: 100%;
}

.banner-image-placeholder img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder-bg {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  font-size: 24px;
  font-weight: 700;
}

.banner-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60%;
  background: linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%);
}

.banner-content {
  position: absolute;
  bottom: 32px;
  left: 20px;
  color: #fff;
  z-index: 2;
}

.banner-title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 6px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.banner-subtitle {
  font-size: 14px;
  opacity: 0.9;
  text-shadow: 0 1px 2px rgba(0,0,0,0.3);
}

/* 左右箭头 */
.banner-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255,255,255,0.25);
  backdrop-filter: blur(4px);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 3;
  color: #fff;
  transition: background 0.2s;
}

.banner-arrow:hover {
  background: rgba(255,255,255,0.4);
}

.banner-arrow svg {
  width: 20px;
  height: 20px;
}

.banner-arrow-left {
  left: 12px;
}

.banner-arrow-right {
  right: 12px;
}

/* 指示器 */
.banner-indicators {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 6px;
  z-index: 3;
}

.indicator {
  width: 6px;
  height: 6px;
  border-radius: 3px;
  background: rgba(255,255,255,0.5);
  transition: all 0.3s;
}

.indicator-active {
  width: 20px;
  background: #fff;
}

/* ===== 分类导航 ===== */
.category-section {
  /* margin: 16px; */
  padding: 16px;
  background: #fff;
  margin-bottom: 12px;
  border-radius: 16px;
}

.category-list {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.category-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.category-icon svg {
  width: 24px;
  height: 24px;
}

.category-name {
  font-size: 12px;
  color: #333;
  font-weight: 500;
}

/* ===== 热门目的地 ===== */
.destinations-section {
  padding: 16px;
  margin-top: -20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-title {
  font-size: 20px;
  font-weight: 700;
  color: #333;
}

.view-all-link {
  font-size: 14px;
  color: #FF6B6B;
  font-weight: 500;
  cursor: pointer;
}

.destination-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.destination-card {
  display: flex;
  gap: 14px;
  background: #fff;
  border-radius: 16px;
  padding: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.destination-image {
  flex-shrink: 0;
  width: 100px;
  height: 100px;
  border-radius: 12px;
  overflow: hidden;
}

.destination-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
}

.destination-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 0;
}

.destination-name {
  font-size: 16px;
  font-weight: 700;
  color: #333;
  margin-bottom: 4px;
}

.destination-location {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #666;
  margin-bottom: 4px;
}

.location-icon {
  width: 14px;
  height: 14px;
  color: #999;
}

.destination-rating {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 4px;
}

.star-icon {
  width: 14px;
  height: 14px;
  color: #FFD93D;
}

.destination-rating span {
  font-size: 13px;
  font-weight: 600;
  color: #333;
}

.destination-desc {
  font-size: 13px;
  color: #999;
  line-height: 1.4;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.destination-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.destination-price {
  font-size: 18px;
  font-weight: 700;
  color: #FF6B6B;
}

.book-btn {
  padding: 8px 18px;
  background: #FF6B6B;
  color: #fff;
  border: none;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.book-btn:active {
  background: #E55A5A;
}
</style>
