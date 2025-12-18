<template>
  <div class="thread-detail-container container my-5">
    
    <div v-if="isLoading" class="text-center">
      <div class="spinner-border text-info" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-2">후기 상세 정보를 불러오는 중입니다...</p>
    </div>

    <div v-else-if="thread" class="thread-content-wrap">
      
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2 class="thread-title">{{ thread.title }}</h2>
        
      </div>
      
      <div class="thread-meta mb-4 pb-3 border-bottom">
        <span class="text-muted me-3">작성자: {{ thread.user?.username || '익명' }} | </span>
        <span class="text-muted me-3">작성일: {{ formatDateTime(thread.created_at) }}</span>
      </div>

      <div v-if="thread.cover_img" class="thread-image-box mb-4 text-center">
        <img :src="thread.cover_img" :alt="thread.title" class="img-fluid rounded shadow-sm" />
      </div>

      <div class="thread-body p-4 border rounded bg-light mb-5">
        <p style="white-space: pre-wrap;">내용 : {{ thread.content }}</p>
      </div>

      </div>

    <div v-else class="alert alert-warning">
      후기 정보를 찾을 수 없거나 로드에 실패했습니다.
    </div>

    <div class="text-center mt-4">
      <RouterLink :to="{ name: 'thread_list', params: { pill_pk: pillPk } }" class="btn btn-info">
        목록으로 돌아가기
      </RouterLink>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const API_URL = 'http://localhost:8000/pills'

const pillPk = route.params.pill_pk 
const threadPk = route.params.thread_pk 
const thread = ref(null)
const isLoading = ref(true)


const fetchThreadDetail = async () => {
  isLoading.value = true
  try {
    // Django API 호출: GET /pills/:pill_pk/thread/:thread_pk/
    const response = await axios.get(`${API_URL}/${pillPk}/thread/${threadPk}/`)
    thread.value = response.data
  } catch (error) {
    console.error(`[${threadPk}번] 후기 상세 로딩 오류:`, error)
    alert('후기 상세 정보를 불러오는 데 실패했습니다.')
  } finally {
    isLoading.value = false
  }
}

const deleteThread = async () => {
  if (!confirm('정말로 이 후기를 삭제하시겠습니까?')) return

  try {
    await axios.post(`${API_URL}/${pillPk}/thread/${threadPk}/delete/`)

    alert('후기가 성공적으로 삭제되었습니다.')
    
    router.push({ name: 'thread_list', params: { pill_pk: pillPk } })

  } catch (error) {
    console.error('후기 삭제 오류:', error)
    alert('후기 삭제 권한이 없거나 오류가 발생했습니다.')
  }
}

const formatDateTime = (dateTime) => {
    if (!dateTime) return ''
    return new Date(dateTime).toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    })
}

onMounted(() => {
  fetchThreadDetail()
})
</script>

<style scoped>
.thread-detail-container {
  max-width: 800px;
  margin: 0 auto;
}
.thread-title {
  font-size: 2rem;
  font-weight: bold;
}
.thread-image-box img {
  max-height: 400px;
  width: auto;
  max-width: 100%;
  object-fit: contain;
}
</style>