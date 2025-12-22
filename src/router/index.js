import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import HomeView from "@/views/HomeView.vue";

import PillIndexView from "@/views/pills/PillsIndexView.vue";
import PillDetailView from "@/views/pills/PillDetailView.vue";
import ThreadListView from "@/views/pills/ThreadListView.vue";
import ThreadCreateView from "@/views/pills/ThreadCreateView.vue";
import ThreadDetailView from "@/views/pills/ThreadDetailView.vue";
import LoginView from "@/views/LoginView.vue";
import SignupView from "@/views/SignupView.vue";
import KakaoCallbackView from "@/views/KakaoCallbackView.vue";
import NaverCallbackView from "@/views/NaverCallbackView.vue";
import RecommendationView from "@/views/pills/RecommendationView.vue";
import IngredientListView from "@/views/pills/IngredientListView.vue";
import IngredientDetailView from "@/views/pills/IngredientDetailView.vue";
import SubstancePillsView from "@/views/pills/SubstancePillsView.vue";
import MyPageView from "@/views/MyPageView.vue";
import GoogleCallbackView from "@/views/GoogleCallbackView.vue";
import ThreadUpdateView from "@/views/pills/ThreadUpdateView.vue";
import UserDeleteView from "@/views/UserDeleteView.vue";
import ChatBotView from "@/views/ChatBotView.vue";

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
      path: "/login/naver",
      name: "NaverCallback",
      component: NaverCallbackView,
    },
    {
      path: "/login/google",
      name: "GoogleCallback",
      component: GoogleCallbackView,
    },
    {
      path: "/signup",
      name: "Signup",
      component: SignupView,
    },
    {
      path: "/profile",
      name: "MyPage",
      component: MyPageView,
      meta: { requiresAuth: true },
    },
    {
      path: '/chatbot',
      name: 'chatbot',
      component : ChatBotView,
      meta: {requiresAuth:true}
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
        {
          path: "thread/:thread_pk/update",
          name: "thread_update",
          component: ThreadUpdateView,
        },
      ],
    },
    {
      path: "/user-delete",
      name: "user_delete",
      component: UserDeleteView,
      beforeEnter: (to, from, next) => {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("로그인이 필요한 페이지입니다.");
          next({ name: "login" });
        } else {
          next();
        }
      },
    },
    {
      path: "/recommendation",
      name: "recommendation",
      component: RecommendationView,
    },
    {
      path: "/recommendation/:categoryId",
      name: "ingredient-list",
      component: IngredientListView,
    },
    {
      path: "/ingredient/:substanceId",
      name: "ingredient-detail",
      component: IngredientDetailView,
    },
    {
      path: "/ingredient/:substanceId/pills",
      name: "substance-pills",
      component: SubstancePillsView,
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    // 🚩 만약 상세 페이지에서 그 안의 하위 후기 페이지로 가는 경우라면
    // 스크롤을 맨 위로 올리지 않고 현재 위치를 유지하거나 watch에서 제어하게 합니다.
    if (
      to.params.pill_pk &&
      from.params.pill_pk &&
      to.params.pill_pk === from.params.pill_pk
    ) {
      return false; // 스크롤 위치를 변경하지 않음
    }

    if (savedPosition) {
      return savedPosition;
    }
    return { top: 0 };
  },
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    alert("권한이 없습니다. 로그인이 필요한 서비스입니다!");

    next({ name: "Login", query: { redirect: to.fullPath } });
  } else {
    next();
  }
});

export default router;
