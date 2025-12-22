<template>
  <div class="thread-list-container container my-5">
    <header class="list-header mb-5">
      <div class="title-section">
        <!-- <span class="category-tag">COMMUNITY</span> -->
        <h2 class="main-title mt-2">
          {{ pillName ? `${pillName} 후기` : "영양제 후기 목록" }}
        </h2>
        <p class="text-muted">
          실제 복용자들이 남긴 <strong>{{ totalCount }}</strong
          >개의 생생한 리뷰를 확인하세요.
        </p>
      </div>
      <RouterLink
        :to="{ name: 'thread_create', params: { pill_pk: pillPk } }"
        class="btn-write"
      >
        <i class="bi bi-pencil-fill"></i> 후기 작성하기
      </RouterLink>
    </header>

    <div v-if="isLoading" class="loading-wrap">
      <div class="spinner-border text-primary" role="status"></div>
      <p>후기를 불러오는 중입니다...</p>
    </div>

    <div v-else-if="threads.length" class="thread-grid">
      <div v-for="thread in threads" :key="thread.id" class="thread-card">
        <RouterLink
          :to="{
            name: 'thread_detail',
            params: { pill_pk: pillPk, thread_pk: thread.id },
          }"
          class="card-anchor"
        >
          <div class="card-image" v-if="thread.cover_img">
            <img :src="thread.cover_img" alt="cover" />
          </div>
          <div class="card-content">
            <h4 class="card-title">{{ thread.title }}</h4>
            <p class="card-text">{{ truncateText(thread.content, 70) }}</p>
            <div class="card-footer-info">
              <span class="author">
                <span class="avatar-sm">{{
                  (thread.user?.first_name || "익")[0]
                }}</span>
                {{ thread.user?.first_name || thread.user?.username || "익명" }}
              </span>
              <span class="date">{{ formatDateTime(thread.created_at) }}</span>
            </div>
          </div>
        </RouterLink>
      </div>
    </div>

    <div v-else class="empty-state">
      <div class="empty-icon">🍃</div>
      <p>
        아직 등록된 후기가 없습니다.<br />첫 번째 후기의 주인공이 되어보세요!
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, RouterLink } from "vue-router";
import axios from "axios";

const API_URL = "http://localhost:8000/pills";
const route = useRoute();
const pillPk = route.params.pill_pk;
const threads = ref([]);
const pillName = ref("");
const totalCount = ref(0);
const isLoading = ref(true);

const fetchThreads = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get(`${API_URL}/${pillPk}/threads/`);
    threads.value = response.data.results;
    totalCount.value = response.data.count;
  } catch (error) {
    console.error("목록 로드 실패:", error);
  } finally {
    isLoading.value = false;
  }
};

const fetchPillName = async () => {
  try {
    const response = await axios.get(`${API_URL}/${pillPk}/`);
    pillName.value = response.data.PRDLST_NM;
  } catch (error) {}
};

const formatDateTime = (dt) => {
  if (!dt) return "";
  return new Date(dt).toLocaleDateString("ko-KR");
};

const truncateText = (text, len) => {
  return text.length > len ? text.substring(0, len) + "..." : text;
};

onMounted(() => {
  fetchPillName();
  fetchThreads();
});
</script>

<style scoped>
.thread-list-container {
  max-width: 1000px;
}
.list-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  border-bottom: 2px solid #f8f9fa;
  padding-bottom: 20px;
}
.category-tag {
  background: #eef2ff;
  color: #4f46e5;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 50px;
}
.main-title {
  font-weight: 800;
  color: #1f2937;
}

.btn-write {
  background: #4f46e5;
  color: white;
  padding: 12px 24px;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  transition: 0.2s;
}
.btn-write:hover {
  background: #4338ca;
  transform: translateY(-2px);
}

.thread-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
}
.thread-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: 0.3s;
  overflow: hidden;
}
.thread-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.card-anchor {
  text-decoration: none;
  color: inherit;
}
.card-image {
  height: 180px;
  overflow: hidden;
}
.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.card-content {
  padding: 15px;
}
.card-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 10px;
}
.card-text {
  color: #6b7280;
  font-size: 0.95rem;
  line-height: 1.6;
  height: 3rem;
  overflow: hidden;
}

.card-footer-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  font-size: 0.85rem;
  color: #9ca3af;
}
.avatar-sm {
  width: 24px;
  height: 24px;
  background: #f3f4f6;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 5px;
  font-weight: bold;
}
</style>
