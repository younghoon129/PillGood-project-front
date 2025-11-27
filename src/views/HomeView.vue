<script setup></script>

<template>
  <div
    class="bg-gradient-to-r from-indigo-50 to-white py-20 text-center rounded-xl shadow-lg mt-8 mb-16"
  >
    <h1 class="text-5xl font-extrabold text-gray-900 mb-4">
      나만을 위한 영양제 추천! , PillGood 💊
    </h1>
    <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
      복용 기록부터 성분 분석, 맞춤형 기록 및 알림까지. 놓치기 쉬운 건강을 스마트하게 관리하세요.
    </p>

    <router-link
      to="/analyze"
      class="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 transform hover:scale-105"
    >
      지금 바로 PillGood 시작하기
    </router-link>
  </div>

  <section class="mb-20">
    <h2 class="text-3xl font-bold text-center text-gray-800 mb-10">
      PillGood이 제공하는 3가지 핵심 기능
    </h2>

    <div class="flex flex-col lg:flex-row lg:space-x-8 space-y-4 lg:space-y-0">
      <div
        class="flex-1 p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-1 border border-gray-100"
      >
        <div class="text-indigo-500 text-4xl mb-4">📸</div>
        <h3 class="text-xl font-semibold mb-2">알약 이미지 분석</h3>
        <p class="text-gray-600">
          찍어서 바로 검색! AI가 사용자에게 필요한 영양제의 정확한 정보를 즉시 제공합니다.
        </p>
      </div>

      <div
        class="flex-1 p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-1 border border-gray-100"
      >
        <div class="text-indigo-500 text-4xl mb-4">📅</div>
        <h3 class="text-xl font-semibold mb-2">개인 복용 기록 및 알림</h3>
        <p class="text-gray-600">
          복용 시간을 기록하고, 놓치지 않도록 사용자의 캘린더에 추가하여 꾸준한 건강 관리를
          돕습니다.
        </p>
      </div>

      <div
        class="flex-1 p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-1 border border-gray-100"
      >
        <div class="text-indigo-500 text-4xl mb-4">⚠️</div>
        <h3 class="text-xl font-semibold mb-2">성분 충돌 위험 분석</h3>
        <p class="text-gray-600">
          현재 복용 중인 영양제들의 성분을 분석하여, 위험한 상호작용 가능성을 미리 경고합니다.
        </p>
      </div>
    </div>
  </section>
</template>
