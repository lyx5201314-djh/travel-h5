import { ref, reactive } from "vue";
import { showToast } from "vant";
import type {
  FormState,
  FormErrors,
  GuessItem,
  CityItem,
  RecommendResult,
  UseRecommendOptions,
} from "./type";
import { useRouter } from "vue-router";

export const DEFAULT_GUESS_LIST: GuessItem[] = [
  {
    title: "杭州3日游",
    price: "¥2000/人",
    image: "https://picsum.photos/400/225?random=1",
    id: "1",
  },
  {
    title: "云南大理丽江6日游",
    price: "¥3500/人",
    image: "https://picsum.photos/400/225?random=2",
    id: "2",
  },
  {
    title: "成都美食4日游",
    price: "¥1800/人",
    image: "https://picsum.photos/400/225?random=3",
    id: "3",
  },
  {
    title: "西安古都5日游",
    price: "¥2200/人",
    image: "https://picsum.photos/400/225?random=4",
    id: "4",
  },
  {
    title: "厦门海岛3日游",
    price: "¥1600/人",
    image: "https://picsum.photos/400/225?random=5",
    id: "5",
  },
  {
    title: "桂林山水4日游",
    price: "¥1900/人",
    image: "https://picsum.photos/400/225?random=6",
    id: "6",
  },
];

export function useRecommend(options: UseRecommendOptions = {}) {
  const { onSuccess, onError } = options;

  const form = reactive<FormState>({
    city: "",
    budget: undefined,
    days: undefined,
  });

  const errors = reactive<FormErrors>({
    city: "",
    budget: "",
    days: "",
  });

  const loading = ref(false);
  const result = ref<RecommendResult | null>(null);
  const guessList = ref<GuessItem[]>(DEFAULT_GUESS_LIST);

  function validateField(field: keyof FormErrors) {
    errors[field] = "";
    if (field === "city" && !form.city.trim()) {
      errors.city = "请输入目的地城市";
      showToast({ message: errors.city, position: "top" });
    }
    if (field === "budget") {
      if (!form.budget) {
        errors.budget = "请输入预算金额";
        showToast({ message: errors.budget, position: "top" });
      } else if (form.budget < 100) {
        errors.budget = "预算不能低于100元";
        showToast({ message: errors.budget, position: "top" });
      }
    }
    if (field === "days") {
      if (!form.days) {
        errors.days = "请输入旅行天数";
        showToast({ message: errors.days, position: "top" });
      } else if (form.days < 1 || form.days > 30) {
        errors.days = "天数需在1-30天之间";
        showToast({ message: errors.days, position: "top" });
      }
    }
  }

  function validate(): boolean {
    validateField("city");
    validateField("budget");
    validateField("days");
    return !errors.city && !errors.budget && !errors.days;
  }

  const router = useRouter();

  async function handleSubmit() {
    if (!validate()) {
      const firstError = errors.city || errors.budget || errors.days;
      if (firstError) {
        showToast({ message: firstError, position: "top" });
      }
      return;
    }
    router.push({
      path: "/detail",
      query: {
        city: form.city.trim(),
        budget: form.budget!,
        days: form.days!,
      },
    });
  }

  function resetForm() {
    result.value = null;
  }

  function goToDetail(item: GuessItem) {
    showToast({ message: `即将跳转到：${item.title}`, position: "top" });
  }

  return {
    form,
    errors,
    loading,
    result,
    guessList,
    validateField,
    handleSubmit,
    resetForm,
    goToDetail,
  };
}

export type UseRecommendHookReturn = ReturnType<typeof useRecommend>;
