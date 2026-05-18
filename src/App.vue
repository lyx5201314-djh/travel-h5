<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const showTabBar = computed(() => {
  const noTabBarRoutes = ['/detail']
  return !noTabBarRoutes.includes(route.path)
})
</script>

<template>
  <div class="app">
    <main class="main-content" :class="{ 'no-tab-bar': !showTabBar }">
      <router-view />
    </main>
    <nav v-if="showTabBar" class="tab-bar">
      <router-link to="/" class="tab-item" active-class="tab-active">
        <span class="tab-icon">🏠</span>
        <span class="tab-label">首页</span>
      </router-link>
      <router-link to="/recommend" class="tab-item" active-class="tab-active">
        <span class="tab-icon">📍</span>
        <span class="tab-label">智能推荐</span>
      </router-link>
      <router-link to="/chat" class="tab-item" active-class="tab-active">
        <span class="tab-icon">💬</span>
        <span class="tab-label">AI对话</span>
      </router-link>
    </nav>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 60px;
}

.main-content.no-tab-bar {
  padding-bottom: 0;
}

.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 60px;
  background: #fff;
  border-top: 1px solid #eee;
  z-index: 100;
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: #999;
  text-decoration: none;
  font-size: 12px;
}

.tab-icon {
  font-size: 20px;
}

.tab-active {
  color: #4a90e2;
}
</style>
