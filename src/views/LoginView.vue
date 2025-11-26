<template>
  <div class="flex flex-col items-center justify-center">
    <div class="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl border border-gray-100">
      <h1 class="text-3xl font-bold text-center text-gray-800 mb-6">로그인</h1>

      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label for="username" class="block text-sm font-medium text-gray-700 mb-1"
            >아이디/이메일</label
          >
          <input
            id="username"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        <div class="mb-6">
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1"
            >비밀번호</label
          >
          <input
            id="password"
            type="password"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        <button
          type="submit"
          class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-lg transition duration-200"
        >
          로그인
        </button>
        <div class="mt-6 text-center text-sm">
          <router-link to="/signup" class="text-indigo-600 hover:text-indigo-800 font-medium">
            회원가입
          </router-link>
          <span class="mx-2 text-gray-400">|</span>
          <router-link to="/forgot-password" class="text-gray-500 hover:text-gray-700">
            비밀번호 찾기
          </router-link>
        </div>
      </form>

      <div class="mt-6">
        <div class="relative flex items-center mb-4">
          <div class="flex-grow border-t border-gray-300"></div>
          <span class="flex-shrink mx-4 text-gray-500 text-sm">소셜 계정으로 로그인</span>
          <div class="flex-grow border-t border-gray-300"></div>
        </div>

        <div class="flex flex-col space-y-3">
          <button
            @click="handleSocialLogin('kakao')"
            class="w-full py-0 rounded-lg transition duration-200 overflow-hidden h-12 flex items-center justify-center"
          >
            <img :src="kakaoLoginImage" alt="카카오 로그인" class="w-full h-full object-contain" />
          </button>

          <button
            @click="handleSocialLogin('naver')"
            class="w-full py-0 rounded-lg transition duration-200 overflow-hidden h-12 flex items-center justify-center"
          >
            <img :src="naverLoginImage" alt="네이버 로그인" class="w-full h-full object-contain" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 실제 로그인 로직은 여기에 들어갑니다. (나중에 Pinia/Axios와 연결)
import kakaoLoginImage from '@/assets/images/kakao_login.png'
import naverLoginImage from '@/assets/images/naver_login.png'
const handleLogin = () => {
  // 현재는 임시 함수입니다.
  console.log('로그인 시도')
}

// 소셜 로그인 핸들러 함수 추가
const handleSocialLogin = (provider) => {
  console.log(`${provider} 소셜 로그인 시작`)
  // 실제 로직: Django 서버의 소셜 로그인 엔드포인트로 리다이렉트 (예정)
}
</script>
