<script setup>
import { useRouter } from 'vue-router'
import defaultImg from '@/assets/pill.jpg'

const router = useRouter()



// 부모(PillsIndexView)로부터 받은 데이터 정의
const props = defineProps({
  pill: Object
})

const handleImageError = (e) => {
  e.target.src = defaultImg
}

// 클릭 시 상세 페이지로 이동 (ID 기반)
const goDetail = () => {
  router.push({ 
    name: 'pill_detail', 
    params: { pill_pk: props.pill.id } 
  })
}
</script>

<template>
  <div class="card" @click="goDetail">
    <div class="image-wrapper">
      <img :src="pill.cover || defaultImg" @error="handleImageError" :alt="pill.PRDLST_NM" class="card-img">
    </div>
    <div class="card-body">
      <p class="company-name">{{ pill.BSSH_NM }}</p>
      
      <h3 class="product-name">{{ pill.PRDLST_NM }}</h3>
      
      <p class="product-func">{{ pill.PRIMARY_FNCLTY }}</p>
    </div>
  </div>
</template>

<style scoped>
.card {
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  overflow: hidden; /* 이미지가 둥근 모서리 밖으로 나가는 것 방지 */
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  display: flex;
  flex-direction: column;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px rgba(0,0,0,0.1);
}

.image-wrapper {
  width: 100%;
  height: 200px; /* 이미지 높이 고정 */
  background-color: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-img {
  width: 100%;
  height: 100%;
  /* object-fit: cover; , contain;(비율 유지, 여백생김)  */
  /* 이미지 비율 유지하며 안에 맞춤 (cover로 하면 꽉 채움) */
}

.card-body {
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.company-name {
  font-size: 0.85rem;
  color: #666;
  margin: 0;
}

.product-name {
  font-size: 1.1rem;
  font-weight: bold;
  color: #333;
  margin: 0;
  /* 긴 제목 처리 */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-func {
  font-size: 0.9rem;
  color: #888;
  margin-top: auto; /* 내용이 적어도 아래쪽에 배치 */
  /* 긴 내용 처리 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}


@media (max-width: 768px) {
  /* 1. 기능(효능) 섹션 숨기기 */
  .product-func {
    display: none !important;
  }

  /* 2. 카드 내부 전체적인 압축 (추가 권장) */
  .card-container { /* 실제 컨테이너 클래스명으로 확인 필요 */
    padding: 10px;
  }

  /* 3. 이미지 높이 조절 (세로를 더 줄이고 싶다면) */
  .pill-image {
    height: 100px; 
    object-fit: contain;
  }

  /* 4. 제품명 줄바꿈 제한 (높이 일정하게 유지) */
  .product-name {
    font-size: 0.9rem;
    margin-bottom: 4px;
    display: -webkit-box;
    -webkit-line-clamp: 2; /* 2줄까지만 보여줌 */
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .image-wrapper{
    height: 150px;
  }
}

</style>