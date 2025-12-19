<script setup>
import { ref, onMounted, computed } from 'vue'
import { usePillStore } from '@/stores/pills'
import PillCard from '@/components/pills/PillCard.vue'

const store = usePillStore()

// 1. 상태 변수
const searchType = ref('') 
const keyword = ref('')
const shapeOptions = [
  '정(알약)', '캡슐', '액상', '분말(가루)', '과립', '환', '젤리', '바', '기타'
]
const selectedShapes = ref([]) 
const currentPage = ref(1) // 현재 페이지 번호 추가

// 2. 데이터 요청 함수 (페이지 번호를 받아서 처리)
const fetchPills = (page) => {
  currentPage.value = page // 현재 페이지 상태 업데이트
  
  const params = {
    search_type: searchType.value,
    keyword: keyword.value,
    shapes: selectedShapes.value.join(',') 
  }
  store.getPills(page, params)
  
  // 페이지 이동 시 부드럽게 스크롤 이동
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 3. 검색 버튼 클릭 (1페이지부터 검색)
const searchPills = () => {
  fetchPills(1)
}

// 4. 초기화 함수
const resetSearch = () => {
  searchType.value = ''
  keyword.value = ''
  selectedShapes.value = []
  fetchPills(1)
}

// ▼▼▼ 5. 페이지네이션 로직 (Computed) ▼▼▼

const totalPages = computed(() => {
  if (!store.count) return 0
  return Math.ceil(store.count / 20)
})

const currentGroup = computed(() => {
  return Math.ceil(currentPage.value / 9) - 1
})

const pageNumbers = computed(() => {
  const start = currentGroup.value * 9 + 1
  const end = Math.min(start + 8, totalPages.value)
  
  const pages = []
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

const hasPrevGroup = computed(() => currentGroup.value > 0)
const hasNextGroup = computed(() => (currentGroup.value + 1) * 9 < totalPages.value)

const moveToNextGroup = () => {
  const nextGroupStartPage = (currentGroup.value + 1) * 9 + 1
  if (nextGroupStartPage <= totalPages.value) {
    fetchPills(nextGroupStartPage)
  }
}

const moveToPrevGroup = () => {
  const prevGroupStartPage = (currentGroup.value - 1) * 9 + 1
  if (prevGroupStartPage >= 1) {
    fetchPills(prevGroupStartPage)
  }
}

onMounted(() => {
  fetchPills(1)
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
          placeholder="검색어를 입력하세요 (예: 비타민, 종근당)"
        >

        <button @click="searchPills" class="search-btn">
          검색
        </button>

        <button @click="resetSearch" class="reset-btn">
          초기화
        </button>
      </div>

      <div class="filter-box">
        <div class="filter-label-area">
          <span class="label-icon">💊</span>
          <span class="filter-label">제형 선택</span>
        </div>
        <div class="chips-group">
          <label 
            v-for="shape in shapeOptions" 
            :key="shape" 
            class="chip-item"
          >
            <input 
              type="checkbox" 
              :value="shape" 
              v-model="selectedShapes"
              class="chip-input" 
            >
            <span class="chip-label">{{ shape }}</span>
          </label>
        </div>
      </div>
      </div>

    <div class="pill-list">
      <PillCard 
        v-for="pill in store.pills" 
        :key="pill.id" 
        :pill="pill" 
      />
    </div>
    
    <div v-if="store.pills.length === 0" class="no-result">
      <p>조건에 맞는 영양제가 없습니다.</p>
    </div>

    <div v-if="totalPages > 0" class="pagination">
      <button 
        @click="moveToPrevGroup" 
        :disabled="!hasPrevGroup"
        class="page-control-btn"
      >
        &lt;
      </button>

      <button 
        v-for="page in pageNumbers" 
        :key="page"
        @click="fetchPills(page)"
        :class="['page-btn', { active: currentPage === page }]"
      >
        {{ page }}
      </button>

      <button 
        @click="moveToNextGroup" 
        :disabled="!hasNextGroup"
        class="page-control-btn"
      >
        &gt;
      </button>
    </div>
  </div>
</template>

<style scoped>
/* 기존 스타일 유지 */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.page-title {
  text-align: center;
  margin-bottom: 40px;
  font-weight: 800;
  color: #212529;
  font-size: 2rem;
}

.search-section {
  max-width: 900px;
  margin: 0 auto 50px auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.search-bar {
  display: flex;
  justify-content: center;
  gap: 12px;
  height: 50px;
}

.search-select {
  padding: 0 20px;
  border: 1px solid #dee2e6;
  border-radius: 50px;
  background-color: white;
  color: #495057;
  font-size: 1rem;
  outline: none;
  cursor: pointer;
  transition: border-color 0.2s;
}

.search-input {
  flex: 1;
  max-width: 500px;
  padding: 0 25px;
  border: 1px solid #dee2e6;
  border-radius: 50px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.search-input:focus,
.search-select:focus {
  border-color: #1c7ed6;
  box-shadow: 0 0 0 3px rgba(28, 126, 214, 0.1);
}

.search-btn {
  padding: 0 30px;
  background-color: #1c7ed6;
  color: white;
  border: none;
  border-radius: 50px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
}

.search-btn:hover {
  background-color: #1864ab;
}

.reset-btn {
  padding: 0 20px;
  background-color: #f1f3f5;
  color: #495057;
  border: 1px solid #dee2e6;
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.reset-btn:hover {
  background-color: #e9ecef;
  border-color: #ced4da;
}

/* ▼▼▼ [수정됨] 필터 박스 및 칩 스타일 ▼▼▼ */
.filter-box {
  background-color: #f8f9fa;
  border: 1px solid #f1f3f5;
  border-radius: 16px;
  padding: 20px 30px;
  display: flex;
  align-items: center; /* 세로 중앙 정렬 */
  gap: 30px; /* 라벨과 칩 사이 간격 */
}

.filter-label-area {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 100px; /* 라벨 영역 너비 고정 */
}

.label-icon {
  font-size: 1.2rem;
}

.filter-label {
  font-weight: 700;
  color: #343a40;
  white-space: nowrap;
}

/* 칩 그룹 컨테이너 */
.chips-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  flex: 1; /* 남은 공간 모두 차지 */
}

.chip-item {
  cursor: pointer;
}

/* 실제 체크박스 숨김 */
.chip-input {
  display: none;
}

/* 커스텀 칩 디자인 */
.chip-label {
  display: inline-block;
  padding: 8px 16px;
  background-color: white; /* 배경 흰색으로 변경 */
  border: 1px solid #dee2e6;
  border-radius: 50px;
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

/* 선택되었을 때 (Active) */
.chip-input:checked + .chip-label {
  background-color: #1c7ed6;
  border-color: #1c7ed6;
  color: white;
  box-shadow: 0 4px 6px rgba(28, 126, 214, 0.2);
}
/* ▲▲▲ 스타일 수정 끝 ▲▲▲ */

.pill-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 30px;
}

.no-result {
  text-align: center;
  margin-top: 80px;
  color: #adb5bd;
  font-size: 1.2rem;
}

@media (max-width: 768px) {
  .search-bar {
    flex-direction: column;
    height: auto;
  }
  .search-select, .search-input, .search-btn, .reset-btn {
    width: 100%;
    height: 45px;
    max-width: none;
  }
  .filter-box {
    flex-direction: column;
    align-items: flex-start; /* 모바일은 왼쪽 정렬 */
    gap: 15px;
  }
}

/* 페이지네이션 스타일 유지 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 60px;
  margin-bottom: 40px;
}

.page-btn {
  width: 36px;
  height: 36px;
  border: 1px solid #e9ecef;
  background-color: white;
  color: #495057;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
  
  display: flex;
  justify-content: center;
  align-items: center;
}

.page-btn:hover {
  background-color: #f1f3f5;
  border-color: #dee2e6;
}

.page-btn.active {
  background-color: #1c7ed6;
  color: white;
  border-color: #1c7ed6;
}

.page-control-btn {
  width: 36px;
  height: 36px;
  border: none;
  background-color: transparent;
  color: #868e96;
  font-weight: bold;
  font-size: 1.2rem;
  cursor: pointer;
  border-radius: 8px;
  transition: color 0.2s;
  
  display: flex;
  justify-content: center;
  align-items: center;
}

.page-control-btn:hover:not(:disabled) {
  background-color: #f1f3f5;
  color: #212529;
}

.page-control-btn:disabled {
  color: #dee2e6;
  cursor: not-allowed;
}
</style>