<script setup>
import { ref, onMounted } from 'vue'
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

// 2. 검색 함수
const searchPills = () => {
  const params = {
    search_type: searchType.value,
    keyword: keyword.value,
    shapes: selectedShapes.value.join(',') 
  }
  store.getPills(1, params)
}

// ▼▼▼ 3. 초기화 함수 추가 ▼▼▼
const resetSearch = () => {
  // 모든 입력값 초기화
  searchType.value = ''
  keyword.value = ''
  selectedShapes.value = []
  
  // 전체 목록 다시 불러오기 (파라미터 없이 호출)
  store.getPills(1)
}

onMounted(() => {
  store.getPills()
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

/* ▼▼▼ 초기화 버튼 스타일 추가 ▼▼▼ */
.reset-btn {
  padding: 0 20px;
  background-color: #f1f3f5; /* 연한 회색 */
  color: #495057;            /* 진한 회색 글씨 */
  border: 1px solid #dee2e6;
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap; /* 글자 줄바꿈 방지 */
}

.reset-btn:hover {
  background-color: #e9ecef;
  border-color: #ced4da;
}
/* ▲▲▲ 초기화 버튼 스타일 끝 ▲▲▲ */


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
</style>