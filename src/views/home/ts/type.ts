export interface BannerItem {
  title: string
  subtitle: string
  image: string
  placeholderColor: string
}

export interface CategoryItem {
  name: string
  color: string
  icon: string
}

export interface DestinationItem {
  name: string
  location: string
  rating: string
  description: string
  price: string
  image: string
  placeholderColor: string
}

export interface UseHomeOptions {
  autoPlayInterval?: number
}

export interface UseHomeReturn {
  banners: BannerItem[]
  currentBanner: number
  categories: CategoryItem[]
  destinations: DestinationItem[]
  nextBanner: () => void
  prevBanner: () => void
  handleTouchStart: (e: TouchEvent) => void
  handleTouchEnd: (e: TouchEvent) => void
}
