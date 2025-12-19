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
  const state = route.query.state;

  if (code) {
    try {
      const response = await axios.post(
        "http://localhost:8000/accounts/naver/login/",
        {
          code,
          state,
        }
      );
      authStore.saveToken(response.data);
      router.push({ name: "Home" });
    } catch (err) {
      alert("네이버 로그인 실패");
      router.push({ name: "Login" });
    }
  }
});
</script>
<template><div>네이버 로그인 처리 중...</div></template>
