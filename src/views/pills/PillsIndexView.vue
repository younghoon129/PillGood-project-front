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
  
  // 페이지 이동 시 스크롤을 맨 위로 올리고 싶다면 아래 주석 해제
  // 1번 방법: 다음 페이지 누르면 위로 바로 이동
  // window.scrollTo(0, 0)
  // 2번 방법: 부드럽게 스크롤 이동
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

// 전체 페이지 수 계산 (한 페이지당 20개 기준)
// store.count는 Store 수정 단계에서 추가된 전체 데이터 개수입니다.
const totalPages = computed(() => {
  if (!store.count) return 0
  return Math.ceil(store.count / 20)
})

// 현재 페이지 그룹 계산 (9개씩 묶음)
// 0그룹: 1~9페이지, 1그룹: 10~18페이지 ...
const currentGroup = computed(() => {
  return Math.ceil(currentPage.value / 9) - 1
})

// 화면에 보여줄 페이지 번호 리스트 (예: [1,2,3...9] 또는 [10,11...18])
const pageNumbers = computed(() => {
  const start = currentGroup.value * 9 + 1
  const end = Math.min(start + 8, totalPages.value)
  
  const pages = []
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

// 이전/다음 그룹 존재 여부
const hasPrevGroup = computed(() => currentGroup.value > 0)
const hasNextGroup = computed(() => (currentGroup.value + 1) * 9 < totalPages.value)

// 다음 그룹으로 이동 (예: 9페이지 -> > 버튼 -> 10페이지)
const moveToNextGroup = () => {
  const nextGroupStartPage = (currentGroup.value + 1) * 9 + 1
  if (nextGroupStartPage <= totalPages.value) {
    fetchPills(nextGroupStartPage)
  }
}

// 이전 그룹으로 이동 (예: 10페이지 -> < 버튼 -> 1페이지)
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
        <span class="filter-label">제형 선택</span>
        <div class="checkbox-group">
          <label 
            v-for="shape in shapeOptions" 
            :key="shape" 
            class="checkbox-item"
          >
            <input 
              type="checkbox" 
              :value="shape" 
              v-model="selectedShapes"
            >
            {{ shape }}
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

.filter-box {
  background-color: #f8f9fa;
  border: 1px solid #f1f3f5;
  border-radius: 16px;
  padding: 20px 30px;
  display: flex;
  align-items: flex-start;
  gap: 20px;
}

.filter-label {
  font-weight: 700;
  color: #343a40;
  white-space: nowrap;
  margin-top: 2px;
}

.checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 15px 20px;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 0.95rem;
  color: #495057;
  user-select: none;
  transition: color 0.2s;
}

.checkbox-item:hover {
  color: #1c7ed6;
}

.checkbox-item input[type="checkbox"] {
  width: 18px;
  height: 18px;
  accent-color: #1c7ed6;
  cursor: pointer;
}

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
    gap: 10px;
  }
}

/* ▼▼▼ 페이지네이션 스타일 추가 ▼▼▼ */
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
  
  /* 숫자가 중앙에 오도록 */
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