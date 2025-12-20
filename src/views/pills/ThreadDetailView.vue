<template>
  <div class="thread-detail-container container my-5">
    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <article v-else-if="thread" class="post-card">
      <nav class="post-nav">
        <button @click="$router.back()" class="btn-back">
          <i class="bi bi-caret-left-fill"></i> 목록으로
        </button>

        <div v-if="thread.is_author" class="admin-actions">
          <RouterLink
            :to="{
              name: 'thread_update',
              params: { pill_pk: pillPk, thread_pk: threadPk },
            }"
            class="btn-edit"
          >
            수정
          </RouterLink>
          <button @click="deleteThread" class="btn-delete">삭제</button>
        </div>
      </nav>

      <header class="post-header text-center">
        <h1 class="post-title">{{ thread.title }}</h1>
        <div class="post-meta">
          <span class="author">
            작성자: <strong>{{ thread.user?.first_name || "익명" }}</strong>
          </span>
          <span class="divider"></span>
          <span class="date">{{ formatDateTime(thread.created_at) }}</span>
        </div>
      </header>

      <div v-if="thread.cover_img" class="post-hero">
        <img :src="thread.cover_img" class="img-fluid" alt="후기 이미지" />
      </div>

      <div class="post-content">
        <p>{{ thread.content }}</p>
      </div>

      <footer class="post-footer">
        <button
          @click="toggleLike"
          class="btn-like"
          :class="{ active: thread.is_liked }"
        >
          <i :class="thread.is_liked ? 'bi bi-heart-fill' : 'bi bi-heart'"></i>
          😁도움이 되었어요 <span>{{ thread.likes_count || 0 }}</span>
        </button>
      </footer>
    </article>

    <div v-else class="alert alert-warning text-center">
      후기 정보를 불러올 수 없습니다.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import { useAuthStore } from "@/stores/auth";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const API_URL = "http://localhost:8000/pills";

const pillPk = route.params.pill_pk;
const threadPk = route.params.thread_pk;
const thread = ref(null);
const isLoading = ref(true);

const fetchThreadDetail = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/${pillPk}/thread/${threadPk}/`,
      {
        headers: {
          Authorization: authStore.token ? `Token ${authStore.token}` : "",
        },
      }
    );
    thread.value = response.data;
  } catch (error) {
    console.error("데이터 로드 실패:", error);
  } finally {
    isLoading.value = false;
  }
};

const toggleLike = async () => {
  if (!authStore.isLoggedIn) {
    alert("로그인이 필요한 서비스입니다.");
    return;
  }
  try {
    const response = await axios.post(
      `${API_URL}/${pillPk}/thread/${threadPk}/likes/`,
      {},
      { headers: { Authorization: `Token ${authStore.token}` } }
    );
    thread.value.is_liked = response.data.is_liked;
    thread.value.likes_count = response.data.likes_count;
  } catch (error) {
    console.error("좋아요 처리 오류:", error);
  }
};

const deleteThread = async () => {
  if (!confirm("정말 이 후기를 삭제하시겠습니까?")) return;
  try {
    await axios.delete(`${API_URL}/${pillPk}/thread/${threadPk}/delete/`, {
      headers: { Authorization: `Token ${authStore.token}` },
    });
    alert("삭제되었습니다.");
    router.push({ name: "thread_list", params: { pill_pk: pillPk } });
  } catch (error) {
    alert("삭제 권한이 없거나 오류가 발생했습니다.");
  }
};

const formatDateTime = (dt) => (dt ? new Date(dt).toLocaleString() : "");
onMounted(fetchThreadDetail);
</script>

<style scoped>
.post-card {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  padding: 50px;
  border-radius: 30px;
  box-shadow: 0 10px 50px rgba(0, 0, 0, 0.04);
}

/* --- 상단 네비게이션 --- */
.post-nav {
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 2rem;
}

.btn-back {
  background: none;
  border: none;
  color: #6b7280;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  white-space: nowrap;
}

.admin-actions {
  display: flex;
  gap: 10px;
  margin-left: auto;
}

.btn-edit,
.btn-delete {
  padding: 8px 18px;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 700;
  border: none;
  cursor: pointer;
  text-decoration: none;
  transition: background 0.2s ease;
}

.btn-edit {
  background: #f3f4f6;
  color: #4b5563;
}
.btn-edit:hover {
  background: #e5e7eb;
}

.btn-delete {
  background: #fee2e2;
  color: #dc2626;
}
.btn-delete:hover {
  background: #fecaca;
}

/* --- 게시글 내용 --- */
.post-title {
  font-size: 2.2rem;
  font-weight: 800;
  color: #111827;
  margin: 20px 0;
  line-height: 1.2;
}

.post-meta {
  color: #9ca3af;
  font-size: 0.95rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
}

.divider {
  width: 4px;
  height: 4px;
  background: #d1d5db;
  border-radius: 50%;
}

.post-hero {
  margin: 40px -50px;
  background: #f9fafb;
}

.post-hero img {
  max-height: 500px;
  width: 100%;
  object-fit: cover;
}

.post-content {
  font-size: 1.15rem;
  line-height: 1.8;
  color: #374151;
  white-space: pre-wrap;
  margin: 40px 0;
}

/* --- 좋아요 버튼 --- */
.post-footer {
  border-top: 1px solid #f3f4f6;
  padding-top: 30px;
  text-align: center;
}

.btn-like {
  background: white;
  border: 1px solid #e5e7eb;
  padding: 12px 30px;
  border-radius: 50px;
  font-weight: 700;
  color: #4b5563;
  transition: all 0.2s;
  cursor: pointer;
}

.btn-like:hover,
.btn-like.active {
  border-color: #f87171;
  color: #ef4444;
  background: #fff5f5;
}

.btn-like.active i {
  transform: scale(1.2);
  display: inline-block;
}

/* 모바일 대응 */
@media (max-width: 768px) {
  .post-card {
    padding: 30px;
    border-radius: 0;
  }
  .post-hero {
    margin: 30px -30px;
  }
  .post-title {
    font-size: 1.8rem;
  }
}
</style>
