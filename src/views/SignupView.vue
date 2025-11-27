<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 입력 데이터를 관리할 상태 변수
const form = ref({
  username: '',
  email: '',
  nickname: '',
  password: '',
  confirmPassword: ''
})

const handleSignup = () => {
  // 1. 비밀번호 일치 여부 확인
  if (form.value.password !== form.value.confirmPassword) {
    alert('비밀번호가 일치하지 않습니다.')
    return
  }

  // 2. (추후 구현) API 호출 로직 위치
  console.log('회원가입 정보:', form.value)
  
  alert('회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.')
  router.push('/login')
}
</script>

<template>
  <div class="flex flex-col items-center justify-center">
    <div class="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl border border-indigo-300">
      
      <h1 class="text-3xl font-bold text-center text-gray-800 mb-2">회원가입</h1>
      <p class="text-center text-gray-500 text-sm mb-6">
        PillGood과 함께 건강한 습관을 만들어보세요.
      </p>

      <form @submit.prevent="handleSignup">
        <div class="mb-4">
          <label for="username" class="block text-sm font-medium text-gray-700 mb-1">아이디</label>
          <input
            v-model="form.username"
            id="username"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
            placeholder="사용할 아이디를 입력하세요"
          />
        </div>

        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">이메일</label>
          <input
            v-model="form.email"
            id="email"
            type="email"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
            placeholder="example@email.com"
          />
        </div>

        <div class="mb-4">
          <label for="nickname" class="block text-sm font-medium text-gray-700 mb-1">닉네임</label>
          <input
            v-model="form.nickname"
            id="nickname"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
            placeholder="활동명으로 사용할 닉네임"
          />
        </div>

        <div class="mb-4">
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
          <input
            v-model="form.password"
            id="password"
            type="password"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
            placeholder="비밀번호 입력"
          />
        </div>

        <div class="mb-8">
          <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">비밀번호 확인</label>
          <input
            v-model="form.confirmPassword"
            id="confirmPassword"
            type="password"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
            placeholder="비밀번호 재입력"
          />
          <p v-if="form.password && form.confirmPassword && form.password !== form.confirmPassword" class="text-red-500 text-xs mt-1">
            비밀번호가 서로 일치하지 않습니다.
          </p>
        </div>

        <button
          type="submit"
          class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-lg transition duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          가입하기
        </button>

        <div class="mt-6 text-center text-sm">
          <span class="text-gray-500">이미 계정이 있으신가요?</span>
          <router-link to="/login" class="ml-2 text-indigo-600 hover:text-indigo-800 font-medium">
            로그인하기
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>