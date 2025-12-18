<script setup>
import { RouterLink } from "vue-router";
import { useAuthStore } from "@/stores/auth";
const authStore = useAuthStore();
</script>

<template>
  <nav class="navbar">
    <div class="logo">
      <RouterLink :to="{ name: 'Home' }">💊 MyPill</RouterLink>
    </div>

    <div class="menu">
      <RouterLink :to="{ name: 'pills_index' }" class="nav-link"
        >영양제 목록</RouterLink
      >

      <span class="divider">|</span>

      <template v-if="!authStore.isLoggedIn">
        <RouterLink :to="{ name: 'Login' }" class="nav-link">로그인</RouterLink>
        <RouterLink :to="{ name: 'Signup' }" class="signup-btn"
          >회원가입</RouterLink
        >
      </template>

      <template v-else>
        <span class="nav-link"
          ><strong>{{ authStore.nickname }}</strong
          >님</span
        >
        <a href="#" @click.prevent="authStore.logout" class="nav-link"
          >로그아웃</a
        >
      </template>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center; /* 세로 중앙 정렬 */
  padding: 1rem 2rem;
  background-color: white;
  border-bottom: 1px solid #eee;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.03);
}

.logo a {
  font-weight: 800;
  font-size: 1.4rem;
  text-decoration: none;
  color: #212529;
  letter-spacing: -0.5px;
}

.menu {
  display: flex;
  align-items: center;
  gap: 15px; /* 메뉴 사이 간격 */
}

/* 기본 링크 스타일 */
.nav-link {
  text-decoration: none;
  color: #495057;
  font-weight: 500;
  font-size: 0.95rem;
  transition: color 0.2s;
}

.nav-link:hover {
  color: #1c7ed6; /* 호버 시 파란색 */
}

/* 구분선 스타일 */
.divider {
  color: #dee2e6;
  font-size: 0.8rem;
}

/* 회원가입 버튼 스타일 (강조) */
.signup-btn {
  background-color: #1c7ed6;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.signup-btn:hover {
  background-color: #1864ab;
}
</style>
