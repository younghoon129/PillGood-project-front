<template>
  <div class="form-container container my-3 my-md-5">
    <div class="form-card">
      <header class="form-header text-center">
        <span class="header-icon">✏️</span>
        <h2 class="form-title">솔직한 후기를 들려주세요</h2>
        <p class="form-subtitle">
          여러분의 생생한 경험이 다른 분들에게 큰 도움이 됩니다.
        </p>
      </header>

      <form @submit.prevent="createThread" class="review-form">
        <div class="form-group">
          <label for="title" class="form-label"
            ><i class="bi bi-fonts"></i> 제목</label
          >
          <div class="input-wrapper">
            <input
              id="title"
              v-model="title"
              type="text"
              placeholder="한 줄로 요약해서 적어주세요"
              required
            />
          </div>
        </div>

        <div class="form-group">
          <label for="content" class="form-label"
            ><i class="bi bi-textarea-resize"></i> 내용</label
          >
          <div class="input-wrapper">
            <textarea
              id="content"
              v-model="content"
              rows="10"
              placeholder="내용을 입력해주세요"
              required
            ></textarea>
          </div>
        </div>

        <div class="form-group upload-group">
          <label class="form-label"
            ><i class="bi bi-camera"></i> 사진 첨부 (선택)</label
          >
          <div v-if="previewUrl" class="image-preview-container">
            <img :src="previewUrl" class="preview-img" />
            <button type="button" @click="clearImage" class="btn-clear-image">
              <i class="bi bi-x"></i>
            </button>
          </div>
          <label v-else for="cover_img" class="custom-upload-box">
            <input
              type="file"
              id="cover_img"
              @change="handleFileUpload"
              accept="image/*"
              hidden
            />
            <div class="upload-placeholder">
              <i class="bi bi-plus-lg"></i>
              <p>이미지 추가</p>
            </div>
          </label>
        </div>

        <div class="form-actions">
          <button type="button" @click="$router.back()" class="btn-cancel">
            취소
          </button>
          <button type="submit" class="btn-submit" :disabled="isSubmitting">
            <span
              v-if="isSubmitting"
              class="spinner-border spinner-border-sm me-2"
            ></span>
            등록 완료
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "@/api/http";
import { useAuthStore } from "@/stores/auth";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const API_URL = "/pills";

const pillPk = route.params.pill_pk;
const title = ref("");
const content = ref("");
const coverImgFile = ref(null);
const previewUrl = ref(null);
const isSubmitting = ref(false);

const handleFileUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  coverImgFile.value = file;
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value);
  previewUrl.value = URL.createObjectURL(file);
};

const clearImage = () => {
  coverImgFile.value = null;
  URL.revokeObjectURL(previewUrl.value);
  previewUrl.value = null;
};

const createThread = async () => {
  if (isSubmitting.value) return;
  isSubmitting.value = true;
  const fd = new FormData();
  fd.append("title", title.value);
  fd.append("content", content.value);
  if (coverImgFile.value) fd.append("cover_img", coverImgFile.value);

  try {
    await axios.post(`${API_URL}/${pillPk}/thread/create/`, fd, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Token ${authStore.token}`,
      },
    });
    router.push({ name: "thread_list", params: { pill_pk: pillPk } });
  } catch (e) {
    alert("등록 실패");
  } finally {
    isSubmitting.value = false;
  }
};

onUnmounted(() => {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value);
});
</script>

<style scoped>
/* 🚩 가로 넘침 방지를 위한 컨테이너 수정 */
.form-container {
  width: 100%;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 15px;
  padding-right: 15px;
  box-sizing: border-box; /* 패딩이 너비에 포함되도록 설정 */
}

.form-card {
  background: #ffffff;
  padding: 40px;
  border-radius: 24px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.05);
  width: 100%;
  box-sizing: border-box;
}

.form-header {
  margin-bottom: 30px;
}
.header-icon {
  font-size: 2.5rem;
  display: block;
  margin-bottom: 10px;
}
.form-title {
  font-weight: 800;
  color: #1a202c;
  font-size: 1.5rem;
}
.form-subtitle {
  color: #718096;
  font-size: 0.9rem;
}

.form-group {
  margin-bottom: 20px;
  text-align: left;
}
.form-label {
  font-weight: 700;
  color: #2d3748;
  display: block;
  margin-bottom: 8px;
  font-size: 0.95rem;
}

.input-wrapper input,
.input-wrapper textarea {
  width: 100%;
  padding: 14px;
  border: 1.5px solid #edf2f7;
  border-radius: 12px;
  background: #f8fafc;
  font-size: 1rem;
  box-sizing: border-box; /* 🚩 중요: 입력창 너비 고정 */
}

.custom-upload-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px;
  border: 2px dashed #cbd5e0;
  border-radius: 16px;
  background: #f7fafc;
  cursor: pointer;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 30px;
}
.btn-cancel,
.btn-submit {
  flex: 1;
  padding: 14px;
  border-radius: 12px;
  font-weight: 700;
  border: none;
  cursor: pointer;
}
.btn-cancel {
  background: #f1f5f9;
  color: #64748b;
}
.btn-submit {
  background: #4f46e5;
  color: white;
}

/* 🚩 모바일 대응 스타일 정밀 수정 */
@media (max-width: 576px) {
  .form-card {
    padding: 24px 20px; /* 패딩을 줄여서 공간 확보 */
    border-radius: 16px;
  }
  .form-title {
    font-size: 1.25rem;
  }
  .form-actions {
    flex-direction: column-reverse;
  } /* 취소 버튼을 아래로 */
  .btn-cancel,
  .btn-submit {
    width: 100%;
  }
}
</style>
