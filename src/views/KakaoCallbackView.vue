<script setup>
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import axios from "axios";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

onMounted(async () => {
  // 1. URL 쿼리 스트링에서 'code' 추출
  const code = route.query.code;

  if (code) {
    try {
      // 2. 백엔드(Django)의 kakao_login 뷰로 코드 전송
      const response = await axios.post(
        "http://localhost:8000/accounts/kakao/login/",
        {
          code: code,
        }
      );

      // 3. 백엔드에서 받은 우리 서비스 전용 토큰 저장
      authStore.saveToken(response.data);
      router.push({ name: "Home" });
    } catch (err) {
      console.error("카카오 로그인 에러:", err);
      alert("로그인 처리 중 오류가 발생했습니다.");
      router.push({ name: "Login" });
    }
  } else {
    alert("인가 코드가 없습니다.");
    router.push({ name: "Login" });
  }
});
</script>

<template>
  <div class="callback-container">
    <div class="loader"></div>
    <p>카카오 로그인 처리 중...</p>
  </div>
</template>

<style scoped>
.callback-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 80vh;
}
.loader {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #fee500;
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
