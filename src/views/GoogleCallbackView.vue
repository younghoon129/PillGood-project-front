<template>
  <div class="callback-container">
    <div class="loader"></div>
    <p>구글 계정 인증 및 연동 중입니다...</p>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import axios from "@/api/http";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

onMounted(async () => {
  const code = route.query.code;
  if (code) {
    try {
      const currentToken = localStorage.getItem("token"); // 자체 회원 토큰

      const response = await axios.post(
        "/accounts/google/callback/",
        { code: code },
        {
          headers: currentToken
            ? { Authorization: `Token ${currentToken}` }
            : {},
        }
      );

      // 1. 구글 캘린더 전용 토큰 저장 (필수!)
      localStorage.setItem(
        "google_access_token",
        response.data.google_access_token
      );

      // 2. 서비스 인증 정보 업데이트
      // 백엔드에서 기존 username을 보내주므로 덮어써도 안전합니다.
      authStore.saveToken(response.data);

      if (response.data.is_new_user) {
        // 🚩 신규 유저라면 마이페이지로 이동
        router.push({ name: "MyPage" });
      } else {
        if (response.data.status === "linked") {
          alert("✨ 기존 계정에 구글 캘린더가 연결되었습니다!");
        }
        router.push({ name: "MyPage" });
      }
    } catch (err) {
      console.error("인증 실패:", err);
      router.push({ name: "Login" });
    }
  }
});
</script>

<style scoped>
.callback-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80vh;
}
.loader {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #4285f4;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
