<template>
  <div class="thread-create-container container my-5">
    <h2 class="mb-4 text-center">
      {{ pillName || '영양제' }} 후기 작성
    </h2>

    <div v-if="!isLoadingPill" class="card p-4 shadow-sm">
      <form @submit.prevent="createThread">
        
        <div class="mb-3">
          <label for="title" class="form-label fw-bold">제목</label>
          <input 
            type="text" 
            class="form-control" 
            id="title" 
            v-model.trim="title" 
            required
            placeholder="후기의 제목을 입력해 주세요."
          >
        </div>
        
        <div class="mb-3">
          <label for="content" class="form-label fw-bold">내용</label>
          <textarea 
            class="form-control" 
            id="content" 
            rows="10" 
            v-model.trim="content" 
            required
            placeholder="자세하고 솔직한 후기를 남겨주세요."
          ></textarea>
        </div>

        <div class="d-flex justify-content-end gap-2">
          <button 
            type="button" 
            class="btn btn-secondary" 
            @click="$router.back()"
          >
            취소
          </button>
          
          <button 
            type="submit" 
            class="btn btn-primary" 
            :disabled="isSubmitting"
          >
            {{ isSubmitting ? '작성 중...' : '작성 완료' }}
          </button>
        </div>
      </form>
    </div>

    <div v-else class="text-center mt-5">
      <p>영양제 정보를 불러오는 중입니다...</p>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
// Pinia Store가 필요하다면 import 합니다 (예: 인증 토큰, 알림 처리 등)

const route = useRoute()
const router = useRouter()
const API_URL = 'http://localhost:8000/pills'

// 1. 상태 정의
const pillPk = route.params.pill_pk 
const title = ref('')
const content = ref('')
const coverImgFile = ref(null) // 파일 객체를 저장할 변수
const pillName = ref('')
const isLoadingPill = ref(true)
const isSubmitting = ref(false)

// 2. 파일 핸들러
const handleFileUpload = (event) => {
  // 이벤트에서 선택된 파일 가져오기
  coverImgFile.value = event.target.files[0]
}

// 3. 폼 제출 함수
const createThread = async () => {
  if (isSubmitting.value) return
  isSubmitting.value = true

  // 폼 데이터를 담을 FormData 객체 생성 (파일 업로드 시 필수)
  const formData = new FormData()
  formData.append('title', title.value)
  formData.append('content', content.value)
  
  // 파일이 있다면 추가
  if (coverImgFile.value) {
    formData.append('cover_img', coverImgFile.value)
  }
  
  // Django View의 ThreadForm에 필요한 필드가 더 있다면 여기에 추가
  // 예를 들어, user는 뷰에서 request.user로 처리하므로 FormData에 추가할 필요 없음

  try {


    const response = await axios.post(
      `${API_URL}/${pillPk}/thread/create/`, 
      formData, 
      {
        headers: {
          'Content-Type': 'multipart/form-data', // 파일 업로드 시 필수
          // 'Authorization': `Token ${토큰}` // 인증 토큰 필요 시
        }
      }
    )
    
    // 성공 응답이 Thread 상세 정보(JSON)를 반환한다고 가정합니다.
    const newThreadPk = response.data.id

    // 성공 시 상세 페이지로 이동
    router.push({ 
      name: 'thread_detail', 
      params: { 
        pill_pk: pillPk, 
        thread_pk: newThreadPk 
      } 
    })

  } catch (error) {
    console.error('후기 작성 중 오류 발생:', error.response ? error.response.data : error)
    alert('후기 작성에 실패했습니다. 로그인 상태를 확인하거나 입력 값을 점검해주세요.')
  } finally {
    isSubmitting.value = false
  }
}

// 영양제 이름 가져오기 (UX 개선)
const fetchPillName = async () => {
    try {
        const response = await axios.get(`${API_URL}/${pillPk}/`)
        pillName.value = response.data.PRDLST_NM
    } catch (error) {
        console.error('영양제 이름을 가져오는 중 오류 발생:', error)
    } finally {
        isLoadingPill.value = false
    }
}

onMounted(() => {
  fetchPillName()
})
</script>

<style scoped>
.thread-create-container {
  max-width: 600px;
}
</style>