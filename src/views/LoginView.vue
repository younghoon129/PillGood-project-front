<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

// 카카오 로그인 설정
const KAKAO_REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY; // 카카오 콘솔 '플랫폼 키'에서 확인
const KAKAO_REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI; // 콘솔에 등록한 URI와 동일해야 함
const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_REST_API_KEY}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code&scope=profile_nickname,account_email,talk_calendar&prompt=consent`;

// 네이버 로그인 설정
const NAVER_CLIENT_ID = import.meta.env.VITE_NAVER_CLIENT_ID;
const NAVER_REDIRECT_URI = import.meta.env.VITE_NAVER_REDIRECT_URI;
const STATE = "random_string_123"; // 보안을 위한 임의의 문자열
const NAVER_AUTH_URL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&redirect_uri=${NAVER_REDIRECT_URI}&state=${STATE}`;

// 구글 캘린더 설정
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const GOOGLE_REDIRECT_URI = import.meta.env.VITE_GOOGLE_REDIRECT_URI;
// 캘린더 수정을 위한 권한(Scope) 추가
const GOOGLE_AUTH_URL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_REDIRECT_URI}&response_type=code&scope=https://www.googleapis.com/auth/calendar.events%20openid%20email%20profile&access_type=offline&prompt=consent`;

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

// 소셜 로그인 핸들러
const handleSocialLogin = (platform) => {
  if (platform === "kakao") {
    // 2. 카카오 인가 코드 요청 URL 생성
    window.location.href = KAKAO_AUTH_URL;
  } else if (platform === "naver") {
    window.location.href = NAVER_AUTH_URL;
  } else if (platform === "google") {
    window.location.href = GOOGLE_AUTH_URL;
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

        <button @click="handleSocialLogin('google')" class="social-btn google">
          <svg class="icon" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          <span>구글로 시작하기</span>
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

.google {
  background-color: #ffffff;
  color: #757575;
  border: 1px solid #ddd !important;
}
</style>
