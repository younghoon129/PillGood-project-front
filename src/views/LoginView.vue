<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

const KAKAO_REST_API_KEY = "8bfc2c0375eb0ec262342e4f996b7e4d"; // 카카오 콘솔 '플랫폼 키'에서 확인
const KAKAO_REDIRECT_URI = "http://localhost:5173/login/kakao"; // 콘솔에 등록한 URI와 동일해야 함

const username = ref("");
const password = ref("");

const handleLogin = async () => {
  try {
    await authStore.login({
      username: username.value,
      password: password.value,
    });
    router.push({ name: "Home" });
  } catch (err) {
    alert("아이디 또는 비밀번호를 확인해주세요.");
  }
};

// 소셜 로그인 핸들러 (현재는 알림창만 띄우도록 설정)
const handleSocialLogin = (platform) => {
  if (platform === "kakao") {
    // 2. 카카오 인가 코드 요청 URL 생성
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_REST_API_KEY}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`;

    // 3. 카카오 인증 페이지로 이동
    window.location.href = kakaoAuthUrl;
  }
};
</script>

<template>
  <div class="login-container">
    <div class="login-box">
      <h1 class="login-title">환영합니다! 💊</h1>
      <p class="login-subtitle">MyPill 서비스를 이용하려면 로그인하세요.</p>

      <form @submit.prevent="handleLogin" class="login-form">
        <input
          v-model="username"
          type="text"
          placeholder="아이디"
          class="login-input"
        />
        <input
          v-model="password"
          type="password"
          placeholder="비밀번호"
          class="login-input"
        />
        <button type="submit" class="login-submit-btn">로그인</button>
      </form>

      <div class="login-links">
        <span>계정이 없으신가요?</span>
        <RouterLink :to="{ name: 'Signup' }">회원가입 하기</RouterLink>
      </div>

      <div class="divider-container">
        <hr class="divider-line" />
        <span class="divider-text">소셜 로그인하기</span>
      </div>

      <div class="social-button-group">
        <button @click="handleSocialLogin('kakao')" class="social-btn kakao">
          <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M12 3C7.58 3 4 5.79 4 9.24C4 11.22 5.21 12.98 7.08 14.1C6.93 14.62 6.55 15.95 6.46 16.27C6.41 16.48 6.63 16.59 6.78 16.48C7.62 15.93 9.4 14.75 9.87 14.43C10.56 14.53 11.27 14.59 12 14.59C16.42 14.59 20 11.8 20 8.35C20 4.9 16.42 3 12 3Z"
            />
          </svg>
          <span>카카오 로그인</span>
        </button>

        <button @click="handleSocialLogin('naver')" class="social-btn naver">
          <svg class="icon" viewBox="0 0 24 24" fill="white">
            <path d="M16.5 19.5h-5l-7-10v10h-4v-15h5l7 10v-10h4v15z" />
          </svg>
          <span>네이버 로그인</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 85vh;
}

.login-box {
  background: white;
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.login-title {
  font-size: 1.8rem;
  margin-bottom: 10px;
  color: #333;
}
.login-subtitle {
  color: #666;
  margin-bottom: 30px;
  font-size: 0.9rem;
}
.login-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.login-input {
  padding: 12px 15px;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  font-size: 1rem;
}
.login-submit-btn {
  padding: 12px;
  background-color: #1c7ed6;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 10px;
}
.login-links {
  margin: 20px 0;
  font-size: 0.85rem;
  color: #888;
}
.login-links a {
  color: #1c7ed6;
  text-decoration: none;
  margin-left: 5px;
  font-weight: 600;
}

/* 추가된 구분선 스타일 */
.divider-container {
  position: relative;
  margin: 30px 0 20px;
  text-align: center;
}
.divider-line {
  border: 0;
  height: 1px;
  background-color: #eee;
}
.divider-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 0 15px;
  font-size: 0.8rem;
  color: #adb5bd;
}

/* 추가된 소셜 로그인 버튼 스타일 */
.social-button-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.social-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  height: 48px;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.2s;
}

.social-btn:hover {
  opacity: 0.9;
}

.icon {
  width: 20px;
  height: 20px;
}

.kakao {
  background-color: #fee500;
  color: #3c1e1e;
}
.naver {
  background-color: #03c75a;
  color: white;
}
</style>
