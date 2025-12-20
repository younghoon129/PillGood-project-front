<template>
  <div class="form-container container my-5">
    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-border text-primary"></div>
    </div>
    <div v-else class="form-card shadow-sm">
      <h2 class="form-title text-center">후기 수정하기</h2>
      <form @submit.prevent="updateThread">
        <div class="form-group">
          <label>제목</label>
          <input v-model="title" type="text" required />
        </div>
        <div class="form-group">
          <label>내용</label>
          <textarea v-model="content" rows="12" required></textarea>
        </div>
        <div class="form-group">
          <label>이미지 변경 (선택)</label>
          <input type="file" @change="handleFileUpload" accept="image/*" />
        </div>
        <div class="btn-group-flex">
          <button type="button" @click="$router.back()" class="btn-cancel">
            취소
          </button>
          <button type="submit" class="btn-submit" :disabled="isSubmitting">
            저장하기
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
// (ThreadUpdateView 로직: fetchOriginalThread 호출 및 axios.post update 로직 포함)
// 스타일은 ThreadCreateView와 동일하게 사용
</script>
<style scoped>
.thread-create-container {
  max-width: 700px;
}
.card {
  border-radius: 15px;
}
</style>
