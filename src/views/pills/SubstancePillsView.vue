<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router'
import axios from 'axios'
import PillCard from '@/components/pills/PillCard.vue'

const route = useRoute()
const router = useRouter()
const subId = route.params.substanceId

// 상태 변수
const pills = ref([])
const totalCount = ref(0)
const currentPage = ref(Number(route.query.page) || 1)
const substanceName = ref('')

// 필터 상태
const selectedCategory = ref(route.query.category ? route.query.category.split(',') : [])
const selectedShapes = ref(route.query.shapes ? route.query.shapes.split(',') : [])
const categoryOptions = ref([]) 
const shapeOptions = ['정', '캡슐', '액상', '분말', '과립', '환', '젤리', '바', '기타']

// 데이터 가져오기
const fetchPills = (page = 1, saveHistory = true) => {
  currentPage.value = page
  
  // 4-1. URL 변경 로직 추가 (버튼 클릭 시에만 기록 저장)
  if (saveHistory) {
    router.push({
      query: {
        page: page,
        category: selectedCategory.value.length > 0 ? selectedCategory.value.join(',') : undefined, 
        shapes: selectedShapes.value.length > 0 ? selectedShapes.value.join(',') : undefined
      }
    })
  }

  // 4-2. 데이터 요청 (기존 로직 동일)
  axios.get(`http://127.0.0.1:8000/pills/substances/${subId}/pills/`, {
    params: {
      page: page,
      category: selectedCategory.value.join(','), 
      shapes: selectedShapes.value.join(',')
    }
  })
  .then(res => {
    pills.value = res.data.results
    totalCount.value = res.data.count
    
    // 4-3. 스크롤 로직: 클릭이면 부드럽게, 뒤로가기면 즉시 이동
    // const scrollBehavior = saveHistory ? 'smooth' : 'auto'
    // window.scrollTo({ top: 0, behavior: scrollBehavior })
  })
}

// 초기 데이터 로드
onMounted(async () => {
  // 브라우저 스크롤 자동 복원 방지 (뒤로가기 시 맨 위로 가기 위해)
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual'

  const subRes = await axios.get(`http://127.0.0.1:8000/pills/substances/${subId}/`)
  substanceName.value = subRes.data.name
  
  const catRes = await axios.get('http://127.0.0.1:8000/pills/categories/')
  categoryOptions.value = catRes.data
  
  // [수정] 5. 초기 로딩 시에는 히스토리를 쌓지 않음 (false)
  fetchPills(currentPage.value, false)
})

onBeforeRouteUpdate((to, from) => {
  // 뒤로가기 누르면 URL이 먼저 바뀌고 이 함수가 실행됨
  // 바뀐 URL의 정보를 변수에 넣고 fetchPills 호출
  currentPage.value = Number(to.query.page) || 1
  selectedCategory.value = to.query.category ? to.query.category.split(',') : []
  selectedShapes.value = to.query.shapes ? to.query.shapes.split(',') : []

  // 이미 URL이 바뀐 상태이므로 히스토리 저장은 안 함(false)
  fetchPills(currentPage.value, false)
})

// 페이지네이션 로직
const totalPages = computed(() => Math.ceil(totalCount.value / 20))
const currentGroup = computed(() => Math.ceil(currentPage.value / 9) - 1)
const pageNumbers = computed(() => {
  const start = currentGroup.value * 9 + 1
  const end = Math.min(start + 8, totalPages.value)
  const pages = []
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
})
</script>

<template>
  <div class="container">
    <div class="header-section">
      <h1 class="page-title">
        <span class="highlight">{{ substanceName }}</span> 성분의 연관 제품
      </h1>
      <p class="subtitle">원하는 조건으로 필터링하여 찾아보세요</p>
    </div>

    <div class="filter-container">
      
      <div class="filter-row">
        <div class="label-area">
          <span class="label-icon">🏷️</span>
          <span class="label-text">카테고리</span>
        </div>
        <div class="chips-group">
          <label 
            v-for="cat in categoryOptions" 
            :key="cat.id" 
            class="chip-item"
          >
            <input 
              type="checkbox" 
              :value="cat.name" 
              v-model="selectedCategory" 
              @change="fetchPills(1)"
              class="chip-input"
            >
            <span class="chip-label">{{ cat.name }}</span>
          </label>
        </div>
      </div>

      <hr class="divider">

      <div class="filter-row">
        <div class="label-area">
          <span class="label-icon">💊</span>
          <span class="label-text">제형</span>
        </div>
        <div class="chips-group">
          <label v-for="shape in shapeOptions" :key="shape" class="chip-item">
            <input 
              type="checkbox" 
              :value="shape" 
              v-model="selectedShapes" 
              @change="fetchPills(1)"
              class="chip-input"
            >
            <span class="chip-label">{{ shape }}</span>
          </label>
        </div>
      </div>
    </div>

    <div class="result-header">
      <div class="count-box">
        총 <span class="num">{{ totalCount }}</span>개의 제품이 검색되었습니다.
      </div>
    </div>

    <div class="pill-list">
      <PillCard v-for="pill in pills" :key="pill.id" :pill="pill" />
    </div>

    <div v-if="pills.length === 0" class="no-result">
      <p>조건에 맞는 제품이 없습니다.</p>
    </div>

    <div class="pagination" v-if="totalPages > 0">
      <button 
        v-for="p in pageNumbers" 
        :key="p" 
        @click="fetchPills(p)" 
        :class="['page-btn', { active: currentPage === p }]"
      >
        {{ p }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 20px;
}

/* 헤더 섹션 */
.header-section {
  text-align: center;
  margin-bottom: 40px;
}

.page-title {
  font-size: 2.2rem;
  font-weight: 800;
  color: #212529;
  margin-bottom: 10px;
}

.highlight {
  color: #1c7ed6;
  position: relative;
  display: inline-block;
}

.highlight::after {
  content: '';
  position: absolute;
  bottom: 2px;
  left: 0;
  width: 100%;
  height: 12px;
  background-color: rgba(28, 126, 214, 0.1);
  z-index: -1;
}

.subtitle {
  color: #868e96;
  font-size: 1.1rem;
}

/* 필터 박스 디자인 */
.filter-container {
  background: white;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  border: 1px solid #f1f3f5;
  margin-bottom: 40px;
}

.filter-row {
  display: flex;
  gap: 30px;
  align-items: flex-start;
}

.label-area {
  width: 100px;
  flex-shrink: 0;
  padding-top: 8px; /* 칩 높이에 맞춰 중앙 정렬 느낌 */
  font-weight: 700;
  color: #343a40;
  display: flex;
  align-items: center;
  gap: 6px;
}

.label-icon { font-size: 1.2rem; }

.divider {
  border: none;
  border-top: 1px dashed #e9ecef;
  margin: 20px 0;
}

/* 칩(태그) 버튼 스타일 */
.chips-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  flex: 1;
}

.chip-item {
  cursor: pointer;
}

/* 실제 체크박스는 숨김 */
.chip-input {
  display: none;
}

/* 커스텀 라벨 디자인 */
.chip-label {
  display: inline-block;
  padding: 8px 16px;
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 50px; /* 둥근 알약 모양 */
  color: #495057;
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;
}

/* 마우스 올렸을 때 */
.chip-label:hover {
  background-color: #e7f5ff;
  border-color: #74c0fc;
  color: #1c7ed6;
  transform: translateY(-1px);
}

/* 체크되었을 때 (Active) */
.chip-input:checked + .chip-label {
  background-color: #1c7ed6;
  border-color: #1c7ed6;
  color: white;
  box-shadow: 0 4px 6px rgba(28, 126, 214, 0.2);
}

/* 결과 카운트 */
.result-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
  padding: 0 10px;
}

.count-box {
  font-size: 1rem;
  color: #495057;
  font-weight: 500;
}

.num {
  color: #1c7ed6;
  font-weight: 800;
  font-size: 1.2rem;
}

/* 리스트 그리드 */
.pill-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 30px;
}

.no-result {
  text-align: center;
  padding: 60px 0;
  color: #adb5bd;
  font-size: 1.2rem;
}

/* 페이지네이션 */
.pagination {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-top: 60px;
}

.page-btn {
  min-width: 40px;
  height: 40px;
  border: 1px solid #e9ecef;
  background: white;
  border-radius: 8px;
  font-weight: 600;
  color: #495057;
  cursor: pointer;
  transition: all 0.2s;
  padding: 0 10px;
}

.page-btn:hover {
  background-color: #f1f3f5;
  border-color: #dee2e6;
}

.page-btn.active {
  background-color: #1c7ed6;
  color: white;
  border-color: #1c7ed6;
  box-shadow: 0 4px 6px rgba(28, 126, 214, 0.2);
}

/* 모바일 대응 */
@media (max-width: 768px) {
  .filter-row {
    flex-direction: column;
    gap: 15px;
  }
  .label-area {
    width: 100%;
  }
  .page-title {
    font-size: 1.8rem;
  }
}
</style>