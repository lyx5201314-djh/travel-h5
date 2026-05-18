export interface RecommendParams {
  city: string;
  budget: number;
  days: number;
}

export interface SpotDetail {
  spot: string;
  duration: string;
  ticket: string;
  transportation: string;
  description: string;
}

export interface DayItinerary {
  day: number;
  date: string;
  morning: SpotDetail;
  afternoon: SpotDetail;
  evening: SpotDetail;
}

export interface BudgetBreakdown {
  accommodation: string;
  food: string;
  transportation: string;
  tickets: string;
  other: string;
}

export interface RecommendResult {
  success: boolean;
  city: string;
  days: string;
  totalBudget: string;
  dailyItinerary: DayItinerary[];
  budgetBreakdown: BudgetBreakdown;
  tips: string[];
  warnings: string[];
  error?: string;
  rawResponse?: string;
}

export interface FormState {
  city: string;
  budget: number | undefined;
  days: number | undefined;
}

export interface FormErrors {
  city: string;
  budget: string;
  days: string;
}

export interface GuessItem {
  title: string;
  price: string;
  image: string;
  id: string;
}

export interface CityItem {
  name: string;
  code: string;
}

export interface UseRecommendOptions {
  onSuccess?: (result: RecommendResult) => void;
  onError?: (error: Error) => void;
}

export interface UseRecommendReturn {
  form: FormState;
  errors: FormErrors;
  loading: boolean;
  result: RecommendResult | null;
  guessList: GuessItem[];
  showCityPicker: boolean;
  cityList: CityItem[];
  onCitySelect: (city: CityItem) => void;
  onCityPickerClose: () => void;
  openCityPicker: () => void;
  validateField: (field: keyof FormErrors) => void;
  handleSubmit: () => Promise<void>;
  resetForm: () => void;
  goToDetail: (item: GuessItem) => void;
}
