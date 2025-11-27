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
            class="w-full h-12 rounded-lg flex items-center justify-center space-x-2 transition duration-200 bg-[#FEE500] hover:bg-[#FDD835] text-[#3C1E1E]"
          >
            <svg
              class="w-5 h-5"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 3C7.58 3 4 5.79 4 9.24C4 11.22 5.21 12.98 7.08 14.1C6.93 14.62 6.55 15.95 6.46 16.27C6.41 16.48 6.63 16.59 6.78 16.48C7.62 15.93 9.4 14.75 9.87 14.43C10.56 14.53 11.27 14.59 12 14.59C16.42 14.59 20 11.8 20 8.35C20 4.9 16.42 3 12 3Z"
              />
            </svg>
            <span class="font-medium">카카오 로그인</span>
          </button>

          <button
            @click="handleSocialLogin('naver')"
            class="w-full h-12 rounded-lg flex items-center justify-center space-x-2 transition duration-200 bg-[#03C75A] hover:bg-[#02b351] text-white"
          >
            <svg
              class="w-4 h-4"
              viewBox="0 0 24 24"
              fill="white"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M16.5 19.5h-5l-7-10v10h-4v-15h5l7 10v-10h4v15z" />
            </svg>
            <!-- <span class="font-bold mr-1">N</span> -->
            <span class="font-medium">네이버 로그인</span>
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
