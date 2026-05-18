import { ref, onMounted, onUnmounted } from "vue";
import type {
  BannerItem,
  CategoryItem,
  DestinationItem,
  UseHomeOptions,
} from "./type";

export const DEFAULT_BANNERS: BannerItem[] = [
  {
    title: "马尔代夫",
    subtitle: "探索天堂之境",
    image: "https://picsum.photos/420/280?1",
    placeholderColor: "#4A90A4",
  },
  {
    title: "瑞士阿尔卑斯",
    subtitle: "感受自然之美",
    image: "https://picsum.photos/420/280?2",
    placeholderColor: "#5A7D5A",
  },
  {
    title: "日本京都",
    subtitle: "体验传统文化",
    image: "https://picsum.photos/420/280?3",
    placeholderColor: "#B8860B",
  },
  {
    title: "希腊圣托里尼",
    subtitle: "浪漫海岛之旅",
    image: "https://picsum.photos/420/280?4",
    placeholderColor: "#4682B4",
  },
];

export const DEFAULT_CATEGORIES: CategoryItem[] = [
  { name: "热门推荐", color: "#FF6B6B", icon: "fire-o" },
  { name: "自然风光", color: "#4ECDC4", icon: "photo-o" },
  { name: "城市探索", color: "#45B7D1", icon: "hotel-o" },
  { name: "海滨度假", color: "#26C6DA", icon: "hotel-o" },
  { name: "户外探险", color: "#FFD93D", icon: "guide-o" },
];

export const DEFAULT_DESTINATIONS: DestinationItem[] = [
  {
    name: "热带天堂",
    location: "马尔代夫",
    rating: "4.9",
    description: "水晶般清澈的海水和白色沙滩...",
    price: "¥6,299",
    image: "https://picsum.photos/100?1",
    placeholderColor: "#87CEEB",
  },
  {
    name: "山峰之巅",
    location: "瑞士阿尔卑斯",
    rating: "4.8",
    description: "令人惊叹的高山美景和徒步小径",
    price: "¥9,199",
    image: "https://picsum.photos/100?2",
    placeholderColor: "#8FBC8F",
  },
];

export function useHome(options: UseHomeOptions = {}) {
  const { autoPlayInterval = 4000 } = options;

  const banners = ref<BannerItem[]>(DEFAULT_BANNERS);
  const currentBanner = ref(0);
  const categories = ref<CategoryItem[]>(DEFAULT_CATEGORIES);
  const destinations = ref<DestinationItem[]>(DEFAULT_DESTINATIONS);

  let autoPlayTimer: ReturnType<typeof setInterval> | null = null;
  let touchStartX = 0;

  function nextBanner() {
    currentBanner.value = (currentBanner.value + 1) % banners.value.length;
  }

  function prevBanner() {
    currentBanner.value =
      (currentBanner.value - 1 + banners.value.length) % banners.value.length;
  }

  function startAutoPlay() {
    autoPlayTimer = setInterval(nextBanner, autoPlayInterval);
  }

  function stopAutoPlay() {
    if (autoPlayTimer) {
      clearInterval(autoPlayTimer);
      autoPlayTimer = null;
    }
  }

  function handleTouchStart(e: TouchEvent) {
    touchStartX = e.touches[0].clientX;
    stopAutoPlay();
  }

  function handleTouchEnd(e: TouchEvent) {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextBanner();
      else prevBanner();
    }
    startAutoPlay();
  }

  onMounted(() => {
    startAutoPlay();
  });

  onUnmounted(() => {
    stopAutoPlay();
  });

  return {
    banners,
    currentBanner,
    categories,
    destinations,
    nextBanner,
    prevBanner,
    handleTouchStart,
    handleTouchEnd,
    startAutoPlay,
    stopAutoPlay,
  };
}

export type UseHomeHookReturn = ReturnType<typeof useHome>;
