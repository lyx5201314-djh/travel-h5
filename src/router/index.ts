import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("../views/home/index.vue"),
  },
  {
    path: "/recommend",
    name: "Recommend",
    component: () => import("../views/recommend/index.vue"),
  },
  {
    path: "/chat",
    name: "Chat",
    component: () => import("../views/chat/indev.vue"),
  },
  {
    path: "/detail",
    name: "Detail",
    component: () => import("../views/recommend/components/detial.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
