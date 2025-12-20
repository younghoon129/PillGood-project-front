<template>
  <div class="form-container container my-5">
    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="mt-2">기존 내용을 불러오는 중입니다...</p>
    </div>

    <div v-else class="form-card shadow-sm">
      <h2 class="form-title text-center">후기 수정하기</h2>
      <p class="text-center text-muted mb-5">
        수정할 내용을 입력하신 후 저장하기를 눌러주세요.
      </p>

      <form @submit.prevent="updateThread" class="review-form">
        <div class="form-group">
          <label class="form-label"><i class="bi bi-fonts"></i> 제목</label>
          <div class="input-wrapper">
            <input
              v-model="title"
              type="text"
              placeholder="제목을 입력하세요"
              required
            />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label"
            ><i class="bi bi-textarea-resize"></i> 내용</label
          >
          <div class="input-wrapper">
            <textarea
              v-model="content"
              rows="12"
              placeholder="내용을 수정하세요"
              required
            ></textarea>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label"
            ><i class="bi bi-image"></i> 이미지 변경 (선택)</label
          >
          <input
            type="file"
            @change="handleFileUpload"
            accept="image/*"
            class="form-control"
          />
          <p class="small text-muted mt-1">
            기존 이미지를 유지하려면 파일을 선택하지 마세요.
          </p>
        </div>

        <div class="btn-group-flex">
          <button type="button" @click="$router.back()" class="btn-cancel">
            취소
          </button>
          <button type="submit" class="btn-submit" :disabled="isSubmitting">
            {{ isSubmitting ? "저장 중..." : "수정 완료" }}
          </button>
        </div>
      </form>
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

// 🚩 경고를 해결하기 위한 핵심 변수들 선언
const pillPk = route.params.pill_pk;
const threadPk = route.params.thread_pk;

const title = ref(""); // 제목
const content = ref(""); // 내용
const coverImgFile = ref(null); // 새 이미지 파일
const isLoading = ref(true); // 로딩 상태 (경고 해결!)
const isSubmitting = ref(false); // 제출 상태 (경고 해결!)

// 1. 기존 데이터 불러오기 (수정 전 미리 채워넣기)
const fetchOriginalThread = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/${pillPk}/thread/${threadPk}/`,
      {
        headers: {
          Authorization: authStore.token ? `Token ${authStore.token}` : "",
        },
      }
    );
    // 가져온 데이터를 폼에 입력
    title.value = response.data.title;
    content.value = response.data.content;
  } catch (error) {
    alert("기존 내용을 불러올 수 없습니다.");
    router.back();
  } finally {
    isLoading.value = false; // 로딩 끝
  }
};

const handleFileUpload = (e) => {
  coverImgFile.value = e.target.files[0];
};

// 2. 데이터 수정 요청 (저장하기)
const updateThread = async () => {
  if (isSubmitting.value) return;
  isSubmitting.value = true;

  const fd = new FormData();
  fd.append("title", title.value);
  fd.append("content", content.value);
  // 이미지를 새로 선택한 경우에만 FormData에 추가
  if (coverImgFile.value) {
    fd.append("cover_img", coverImgFile.value);
  }

  try {
    await axios.post(`${API_URL}/${pillPk}/thread/${threadPk}/update/`, fd, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Token ${authStore.token}`,
      },
    });
    alert("수정되었습니다.");
    // 상세 페이지로 이동
    router.push({
      name: "thread_detail",
      params: { pill_pk: pillPk, thread_pk: threadPk },
    });
  } catch (error) {
    alert("수정에 실패했습니다.");
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(() => {
  fetchOriginalThread();
});
</script>

<style scoped>
/* ThreadCreateView와 동일한 스타일 적용 (일관성 유지) */
.form-card {
  max-width: 700px;
  margin: 0 auto;
  background: white;
  padding: 50px;
  border-radius: 25px;
}
.form-title {
  font-weight: 800;
  color: #111827;
}
.form-group {
  margin-bottom: 25px;
}
.form-label {
  display: block;
  font-weight: 700;
  color: #374151;
  margin-bottom: 8px;
}
input[type="text"],
textarea {
  width: 100%;
  padding: 15px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #f9fafb;
  outline: none;
  transition: 0.2s;
}
input:focus,
textarea:focus {
  border-color: #4f46e5;
  background: white;
  box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1);
}

.btn-group-flex {
  display: flex;
  gap: 15px;
  margin-top: 40px;
}
.btn-cancel {
  flex: 1;
  padding: 15px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: white;
  font-weight: 600;
  cursor: pointer;
}
.btn-submit {
  flex: 2;
  padding: 15px;
  border-radius: 12px;
  border: none;
  background: #4f46e5;
  color: white;
  font-weight: 700;
  cursor: pointer;
}
.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
