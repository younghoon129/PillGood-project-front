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
import axios from "axios";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

onMounted(async () => {
  const code = route.query.code;
  if (code) {
    try {
      // 🚩 현재 로그인된 상태라면 기존 토큰을 헤더에 실어서 보냄
      const currentToken = localStorage.getItem("token");
      const headers = currentToken
        ? { Authorization: `Token ${currentToken}` }
        : {};

      const response = await axios.post(
        "http://localhost:8000/accounts/google/callback/",
        { code: code },
        { headers: headers }
      );

      // 1. 우리 서비스 인증 정보 저장 (토큰 유지)
      authStore.saveToken(response.data);

      // 2. 구글 캘린더용 토큰 별도 저장
      localStorage.setItem(
        "google_access_token",
        response.data.google_access_token
      );

      if (response.data.status === "linked") {
        alert("✨ 구글 캘린더 연동이 완료되었습니다!");
      } else {
        alert(`✨ ${response.data.nickname}님, 환영합니다!`);
      }

      router.push({ name: "Home" });
    } catch (err) {
      console.error("인증 실패:", err);
      alert("연동 과정에서 오류가 발생했습니다.");
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
