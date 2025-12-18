<template>
  <div class="thread-list-container container my-4">
    <h2 class="mb-4">
      {{ pillName ? `${pillName} 후기 목록` : '후기 목록' }}
    </h2>

    <div class="d-flex justify-content-between align-items-center mb-3">
      <RouterLink 
        :to="{ name: 'thread_create', params: { pill_pk: pillPk } }" 
        class="btn btn-success"
      >
        새 후기 작성
      </RouterLink>
      <small class="text-muted">총 {{ totalCount }}개의 후기</small>
    </div>

    <div v-if="isLoading" class="text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p>후기를 불러오는 중입니다...</p>
    </div>

    <div v-else-if="threads.length">
      <ul class="list-group">
        <li v-for="thread in threads" :key="thread.id" class="list-group-item d-flex justify-content-between align-items-center">
          <div class="thread-info">
            <RouterLink 
              :to="{ name: 'thread_detail', params: { pill_pk: pillPk, thread_pk: thread.id } }" 
              class="thread-title fs-5"
            >
              {{ thread.title }}
            </RouterLink>
            <p class="mb-0 text-muted small">
              작성자: {{ thread.user?.username || '익명' }} | 
              작성일: {{ formatDateTime(thread.created_at) }}
            </p>
          </div>
          
        </li>
      </ul>
      
      </div>
    
    <div v-else class="alert alert-info text-center">
      아직 작성된 후기가 없습니다. 첫 번째 후기를 작성해 보세요!
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import axios from 'axios'

// Django API 기본 URL 설정
const API_URL = 'http://localhost:8000/pills'

const route = useRoute()
const pillPk = route.params.pill_pk 
const threads = ref([])
const pillName = ref('')
const totalCount = ref(0)
const isLoading = ref(true)

// 3. API 호출 함수
const fetchThreads = async () => {
  isLoading.value = true
  try {
    const response = await axios.get(`${API_URL}/${pillPk}/threads/`)
    
    threads.value = response.data.results 
    totalCount.value = response.data.count
    
  } catch (error) {
    console.error(`[${pillPk}번] 후기 목록을 가져오는 중 오류 발생:`, error)
  } finally {
    isLoading.value = false
  }
}

// 4. 영양제 이름 가져오기
const fetchPillName = async () => {
    try {
        const response = await axios.get(`${API_URL}/${pillPk}/`)
        pillName.value = response.data.PRDLST_NM
    } catch (error) {
        console.error('영양제 이름을 가져오는 중 오류 발생:', error)
        pillName.value = '[영양제 정보를 불러올 수 없습니다]'
    }
}

// 5. 날짜 포맷팅 함수 (created_at이 있을 경우 사용)
const formatDateTime = (dateTime) => {
    if (!dateTime) return ''
    return new Date(dateTime).toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    })
}


onMounted(() => {
  fetchPillName()
  fetchThreads()
})
</script>

<style scoped>
.thread-list-container {
  max-width: 900px;
  margin: 0 auto;
}
.thread-title {
  color: #212529;
  text-decoration: none;
}
.thread-title:hover {
  text-decoration: underline;
}
.thread-meta span {
  font-size: 0.85rem;
}
</style>