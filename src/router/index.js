import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";

import PillIndexView from "@/views/pills/PillsIndexView.vue";
import PillDetailView from "@/views/pills/PillDetailView.vue";
import ThreadListView from "@/views/pills/ThreadListView.vue";
import ThreadCreateView from "@/views/pills/ThreadCreateView.vue";
import ThreadDetailView from "@/views/pills/ThreadDetailView.vue";
import LoginView from "@/views/LoginView.vue";
import SignupView from "@/views/SignupView.vue";
import KakaoCallbackView from "@/views/KakaoCallbackView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: "Login",
      component: LoginView,
    },
    {
      path: "/login/kakao",
      name: "KakaoCallback",
      component: KakaoCallbackView,
    },
    {
      path: "/signup",
      name: "Signup",
      component: SignupView,
    },
    // {
    //   path: '/profile/:username',
    //   name: 'profile',
    //   component: ProfileView,
    //   props: true, // 컴포넌트에서 props로 username을 받을 수 있음
    // },
    {
      path: "/",
      name: "Home",
      component: HomeView,
    },
    {
      path: "/pills",
      name: "pills_index",
      component: PillIndexView,
    },
    {
      path: "/pills/:pill_pk",
      name: "pill_detail",
      component: PillDetailView,
      children: [
        {
          path: "threads",
          name: "thread_list",
          component: ThreadListView,
        },
        {
          path: "thread/create",
          name: "thread_create",
          component: ThreadCreateView,
        },
        {
          path: "thread/:thread_pk",
          name: "thread_detail",
          component: ThreadDetailView,
        },
      ],
    },
  ],
});

export default router;
