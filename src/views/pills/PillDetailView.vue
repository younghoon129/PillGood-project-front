<script setup>
import { onMounted } from 'vue'
import { useRoute,RouterView } from 'vue-router'
import { usePillStore } from '@/stores/pills'
import defaultImg from '@/assets/pill.jpg' // 기본 이미지 import

const route = useRoute()
const store = usePillStore()

onMounted(() => {
  // 1. URL에서 pill_pk 추출 (예: /pills/3 -> 3)
  const pillId = route.params.pill_pk
  
  // 2. 스토어에 데이터 요청
  store.getPillDetail(pillId)
})
</script>

<template>
  <div class="container">
    <div v-if="!store.pill" class="loading">
      <p>데이터를 불러오는 중입니다...</p>
    </div>

    <div v-else class="detail-wrap">
      
      <section class="header-section">
        <div class="img-box">
          <img :src="store.pill.cover || defaultImg" :alt="store.pill.PRDLST_NM" />
        </div>
        
        <div class="info-box">
          <span class="company">{{ store.pill.BSSH_NM }}</span>
          <h1 class="title">{{ store.pill.PRDLST_NM }}</h1>
          
          <div class="badges">
            <span class="badge category">{{ store.pill.category_name || '기타' }}</span>
          </div>
          
          <p class="summary">{{ store.pill.PRIMARY_FNCLTY }}</p>
        </div>
      </section>

      <hr class="divider" />

      <section class="content-section">
        
        <div class="info-item">
          <h3>💊 섭취 방법</h3>
          <p>{{ store.pill.NTK_MTHD || '정보 없음' }}</p>
        </div>

        <div class="info-item">
          <h3>⚠️ 섭취 시 주의사항</h3>
          <p class="multi-line">{{ store.pill.IFTKN_ATNT_MATR_CN || '정보 없음' }}</p>
        </div>

        <div class="info-item">
          <h3>📦 보관 방법</h3>
          <p>{{ store.pill.CSTDY_MTHD || '상온 보관' }}</p>
        </div>

        <div class="info-item">
          <h3>🧪 유통기한(소비기한)</h3>
          <p>{{ store.pill.POG_DAYCNT || '정보 없음' }}</p>
        </div>

        <div class="info-item">
          <h3>📊 영양 기능 정보</h3>
          
          <div v-if="store.pill.nutrient_details && store.pill.nutrient_details.length > 0" class="nutrient-table-wrap">
            <table class="nutrient-table">
              <thead>
                <tr>
                  <th>성분명</th>
                  <th>함량</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(nut, index) in store.pill.nutrient_details" :key="index">
                  <td>{{ nut.substance_name }}</td>
                  <td>{{ nut.value }} {{ nut.unit }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-else class="empty-text">
            해당 정보 없음
          </div>
        </div>

        <div class="info-item">
          <h3>⚠️ 알레르기 유발 물질</h3>
          
          <div v-if="store.pill.allergens_info && store.pill.allergens_info.length > 0" class="allergy-list">
            <span 
              v-for="(allergy, index) in store.pill.allergens_info" 
              :key="index" 
              class="badge allergy-badge"
            >
              {{ allergy.name }}
            </span>
          </div>
          
          <div v-else class="empty-text">
            해당 정보 없음
          </div>
        </div>

        <div class="info-item">
          <h3>🌟 사용자 후기</h3>
          <div class="thread-nav-area">
            <RouterLink 
              :to="{ name: 'thread_list', params: { pill_pk: store.pill.id } }"
              class="btn-thread-list"
            >
              후기 전체 보기 및 작성
            </RouterLink>
          </div>
        </div>
        
      </section>

      <hr class="divider" />
      <RouterView :key="route.fullPath" />
      
      <div class="btn-area">
        <button @click="$router.go(-1)" class="back-btn">목록으로 돌아가기</button>
      </div>

    </div>
  </div>
</template>

<style scoped>

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
}

.loading {
  text-align: center;
  margin-top: 100px;
  font-size: 1.2rem;
  color: #888;
}

/* 상단 섹션 (이미지 + 제목) */
.header-section {
  display: flex;
  gap: 30px;
  margin-bottom: 40px;
}

.img-box {
  width: 300px;
  height: 300px;
  background-color: #f8f9fa;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0; /* 이미지 영역 줄어들지 않게 고정 */
  border: 1px solid #eee;
}

.img-box img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.info-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.company {
  color: #666;
  font-size: 0.95rem;
  margin-bottom: 8px;
}

.title {
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  margin: 0 0 15px 0;
  line-height: 1.2;
}

.badges {
  margin-bottom: 20px;
}

.badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.badge.category {
  background-color: #e3f2fd;
  color: #1976d2;
}

.summary {
  font-size: 1rem;
  color: #555;
  line-height: 1.6;
}

.divider {
  border: none;
  border-top: 1px solid #eee;
  margin: 0 0 40px 0;
}

/* 하단 섹션 (상세 정보) */
.content-section {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.info-item h3 {
  font-size: 1.2rem;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 10px;
  border-left: 4px solid #42b983; /* Vue 초록색 포인트 */
  padding-left: 10px;
}

.info-item p {
  color: #444;
  line-height: 1.7;
  font-size: 1rem;
  background-color: #fcfcfc;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
}

.multi-line {
  white-space: pre-wrap; /* 줄바꿈 있는 데이터 그대로 보여주기 */
  word-break: keep-all;
}

/* 반응형 (모바일) */
@media (max-width: 768px) {
  .header-section {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .img-box {
    width: 100%;
    max-width: 300px;
    height: 300px;
  }

  .info-item h3 {
    font-size: 1.1rem;
  }
}

.btn-area {
  margin-top: 50px;
  text-align: center;
}

.back-btn {
  padding: 12px 30px;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}

.back-btn:hover {
  background-color: #5a6268;
}

/* 아래는 영양 기능 정보만 적용*/
.nutrient-table-wrap {
  margin-top: 15px;
  border: 1px solid #e9ecef; /* 연한 회색 테두리 */
  border-radius: 8px;        /* 모서리 둥글게 */
  overflow: hidden;          /* 둥근 모서리 밖으로 내용 넘침 방지 */
}

/* 2. 테이블 기본 설정 */
.nutrient-table {
  width: 100%;
  border-collapse: collapse; /* 셀 사이 간격 없애기 */
  font-size: 0.95rem;        /* 글자 크기 적당하게 */
}

/* 3. 제목(th)과 내용(td) 공통 여백 (★여백 핵심★) */
.nutrient-table th, 
.nutrient-table td {
  padding: 12px 20px;        /* 상하 12px, 좌우 20px (충분한 여백) */
  text-align: left;          /* 왼쪽 정렬 */
  border-bottom: 1px solid #f1f3f5; /* 가로 줄 긋기 */
}

/* 4. 제목줄(th) 배경색 */
.nutrient-table th {
  background-color: #f8f9fa; /* 아주 연한 회색 배경 */
  color: #495057;            /* 진한 회색 글씨 */
  font-weight: 600;
  width: 60%;                /* 성분명 칸을 좀 더 넓게(60%) 잡음 */
}

/* 5. 내용줄(td) 글씨색 */
.nutrient-table td {
  color: #212529;            /* 검정색에 가까운 글씨 */
  width: 40%;                /* 함량 칸은 40% */
}

/* 6. 마지막 줄은 밑줄 없애기 (깔끔함) */
.nutrient-table tr:last-child td {
  border-bottom: none;
}

</style>