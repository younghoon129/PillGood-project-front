<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { usePillStore } from '@/stores/pills'
import PillCard from '@/components/pills/PillCard.vue'

const store = usePillStore()
const router = useRouter()
const route = useRoute()


// 1. 상태 변수
const searchType = ref(route.query.search_type || '') 
const keyword = ref(route.query.keyword || '')
const currentPage = ref(Number(route.query.page) || 1) // URL의 page는 문자열이므로 숫자로 변환

// shapeOptions는 고정값이므로 그대로 둠
const shapeOptions = [
  '정(알약)', '캡슐', '액상', '분말(가루)', '과립', '환', '젤리', '바', '기타'
]

// shapes는 URL에서 콤마로 구분된 문자열로 오므로 배열로 변환
const initialShapes = route.query.shapes ? route.query.shapes.split(',') : []
const selectedShapes = ref(initialShapes)


const fetchPills = (page) => {
  currentPage.value = page 
  
  // 검색 조건 객체 생성
  const queryParams = {
    page: page,
    search_type: searchType.value,
    keyword: keyword.value,
    shapes: selectedShapes.value.length > 0 ? selectedShapes.value.join(',') : undefined // 비어있으면 URL에서 제거
  }

  // API 요청 파라미터 (store용)
  const apiParams = {
    search_type: searchType.value,
    keyword: keyword.value,
    shapes: selectedShapes.value.join(',') 
  }

  // [핵심] 상태가 변경될 때마다 URL을 업데이트 (history에 쌓임)
  // router.push를 사용하면 뒤로가기 시 이전 상태(URL)로 돌아갈 수 있음
  router.push({ query: queryParams })

  // 데이터 가져오기
  store.getPills(page, apiParams)
  
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const searchPills = () => fetchPills(1)
const resetSearch = () => {
  searchType.value = ''
  keyword.value = ''
  selectedShapes.value = []
  fetchPills(1)
}

const totalPages = computed(() => store.count ? Math.ceil(store.count / 20) : 0)
const currentGroup = computed(() => Math.ceil(currentPage.value / 9) - 1)
const pageNumbers = computed(() => {
  const start = currentGroup.value * 9 + 1
  const end = Math.min(start + 8, totalPages.value)
  const pages = []
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
})

const hasPrevGroup = computed(() => currentGroup.value > 0)
const hasNextGroup = computed(() => (currentGroup.value + 1) * 9 < totalPages.value)

const moveToNextGroup = () => {
  const nextGroupStartPage = (currentGroup.value + 1) * 9 + 1
  if (nextGroupStartPage <= totalPages.value) fetchPills(nextGroupStartPage)
}

const moveToPrevGroup = () => {
  const prevGroupStartPage = (currentGroup.value - 1) * 9 + 1
  if (prevGroupStartPage >= 1) fetchPills(prevGroupStartPage)
}

onMounted(() => {
  fetchPills(currentPage.value)
})
</script>

<template>
  <div class="container">
    <h1 class="page-title">영양제 목록</h1>

    <div class="search-section">
      <div class="search-bar">
        <select v-model="searchType" class="search-select">
          <option value="">통합 검색</option>
          <option value="name">제품명</option>
          <option value="company">제조사</option>
          <option value="ingredient">성분</option>
        </select>

        <input 
          v-model="keyword" 
          @keyup.enter="searchPills"
          type="text" 
          class="search-input" 
          placeholder="검색어를 입력하세요"
        >

        <button @click="searchPills" class="search-btn">검색</button>
        <button @click="resetSearch" class="reset-btn">초기화</button>
      </div>

      <div class="filter-box">
        <div class="filter-label-area">
          <span class="label-icon">💊</span>
          <span class="filter-label">제형 선택</span>
        </div>
        <div class="chips-group">
          <label v-for="shape in shapeOptions" :key="shape" class="chip-item">
            <input type="checkbox" :value="shape" v-model="selectedShapes" class="chip-input">
            <span class="chip-label">{{ shape }}</span>
          </label>
        </div>
      </div>
    </div>

    <div class="pill-list">
      <PillCard v-for="pill in store.pills" :key="pill.id" :pill="pill" />
    </div>
    
    <div v-if="store.pills.length === 0" class="no-result">
      <p>조건에 맞는 영양제가 없습니다.</p>
    </div>

    <div v-if="totalPages > 0" class="pagination">
      <button @click="moveToPrevGroup" :disabled="!hasPrevGroup" class="page-control-btn">&lt;</button>
      <button v-for="page in pageNumbers" :key="page" @click="fetchPills(page)" :class="['page-btn', { active: currentPage === page }]">{{ page }}</button>
      <button @click="moveToNextGroup" :disabled="!hasNextGroup" class="page-control-btn">&gt;</button>
    </div>
  </div>
</template>

<style scoped>
/* 전역 설정 */
* { box-sizing: border-box; }

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 20px;
}

.page-title { text-align: center; margin-bottom: 40px; font-weight: 800; color: #212529; font-size: 2rem; }

.search-section { max-width: 900px; margin: 0 auto 50px auto; display: flex; flex-direction: column; gap: 20px; }

/* PC 버전 search-bar */
.search-bar { display: flex; justify-content: center; gap: 12px; height: 50px; }

.search-select, .search-input, .search-btn, .reset-btn {
  height: 100%;
  border-radius: 50px;
  border: 1px solid #dee2e6;
  font-size: 1rem;
  outline: none;
  box-sizing: border-box;
}

.search-select { padding: 0 20px; background-color: white; color: #495057; cursor: pointer; }

.search-input { flex: 1; max-width: 500px; padding: 0 25px; }

.search-btn { padding: 0 30px; background-color: #1c7ed6; color: white; border: none; font-weight: 700; cursor: pointer; }

.reset-btn { padding: 0 20px; background-color: #f1f3f5; color: #495057; font-weight: 600; cursor: pointer; }

/* 필터 영역 */
.filter-box { background-color: #f8f9fa; border: 1px solid #f1f3f5; border-radius: 16px; padding: 20px 30px; display: flex; align-items: center; gap: 30px; }
.filter-label-area { display: flex; align-items: center; gap: 6px; min-width: 100px; }
.filter-label { font-weight: 700; color: #343a40; }
.chips-group { display: flex; flex-wrap: wrap; gap: 10px; flex: 1; }
.chip-input { display: none; }
.chip-label { display: inline-block; padding: 8px 16px; background-color: white; border: 1px solid #dee2e6; border-radius: 50px; font-size: 0.95rem; transition: all 0.2s; cursor: pointer; }
.chip-input:checked + .chip-label { background-color: #1c7ed6; border-color: #1c7ed6; color: white; }

.pill-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 30px; }
.no-result { text-align: center; margin-top: 60px; color: #adb5bd; font-size: 1.2rem; }

/* [수정] 모바일 버전 대응 */
@media (max-width: 768px) {
  .search-section { margin-bottom: 30px; }
  
  .search-bar {
    flex-direction: column;
    height: auto !important;
    gap: 10px;
  }

  .search-select, 
  .search-input, 
  .search-btn, 
  .reset-btn {
    width: 100% !important;
    max-width: none !important; 
    height: 50px !important;    
    flex: none !important;      
    padding: 0 20px !important; 
    border-radius: 12px !important; 
  }

  .filter-box {
    flex-direction: column;
    align-items: flex-start;
    padding: 15px;
    gap: 15px;
  }

  .pill-list {
    grid-template-columns: repeat(2, 1fr); /* 무조건 2열로 고정 */
    gap: 12px;
    align-items: start;
  }

  .pill-list > * {
    margin-bottom: 0; 
  }

  .container {
    padding: 15px 10px;
  }

  
}

/* 페이지네이션 */
.pagination { display: flex; justify-content: center; align-items: center; gap: 8px; margin-top: 60px; margin-bottom: 40px; }
.page-btn { width: 36px; height: 36px; border: 1px solid #e9ecef; background-color: white; border-radius: 8px; cursor: pointer; font-weight: 600; }
.page-btn.active { background-color: #1c7ed6; color: white; border-color: #1c7ed6; }
.page-control-btn { width: 36px; height: 36px; border: none; background-color: transparent; color: #868e96; font-weight: bold; cursor: pointer; }
.page-control-btn:disabled { color: #dee2e6; cursor: not-allowed; }
</style>