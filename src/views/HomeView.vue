<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

// '영양제 리스트' 페이지로 이동
const goPillList = () => {
  router.push({ name: 'pills_index' })
}

// 준비 중 알림 함수
const alertNotReady = () => {
  alert("준비 중인 기능입니다! 조금만 기다려주세요 🛠️")
}
</script>

<template>
  <div class="main-container">
    <section class="hero">
      <div class="content">
        <h1 class="title">
          내 몸에 딱 맞는<br />
          <span class="highlight">영양제</span>를 찾아보세요
        </h1>
        <p class="subtitle">
          수천 개의 영양제 성분과 알레르기 정보를 분석하여<br />
          당신에게 가장 안전하고 효과적인 선택을 도와드립니다.
        </p>
        <button @click="goPillList" class="cta-button">
          영양제 찾아보기 →
        </button>
      </div>
      
      <div class="visual">
        <div class="circle-deco">💊</div>
      </div>
    </section>

    <section class="features">
      
      <div class="feature-item" @click="alertNotReady">
        <h3>🔍 성분 분석</h3>
        <p>복잡한 성분표를<br>쉽게 확인하세요</p>
      </div>

      <div class="feature-item" @click="alertNotReady">
        <h3>⚠️ 알레르기 체크</h3>
        <p>나에게 위험한 성분을<br>미리 알려드려요</p>
      </div>

      <div class="feature-item" @click="alertNotReady">
        <h3>📋 맞춤 추천</h3>
        <p>증상과 목적에 맞는<br>영양제를 찾으세요</p>
      </div>

    </section>
  </div>
</template>

<style scoped>
/* ... 기존 스타일 유지 ... */

.main-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 80vh;
}

.hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 80px;
  gap: 40px;
}

.content {
  flex: 1;
}

.title {
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.2;
  color: #212529;
  margin-bottom: 24px;
  word-break: keep-all;
}

.highlight {
  color: #1c7ed6;
  position: relative;
  display: inline-block;
}

.highlight::after {
  content: '';
  position: absolute;
  bottom: 5px;
  left: 0;
  width: 100%;
  height: 15px;
  background-color: rgba(28, 126, 214, 0.15);
  z-index: -1;
}

.subtitle {
  font-size: 1.2rem;
  color: #868e96;
  line-height: 1.6;
  margin-bottom: 40px;
}

.cta-button {
  padding: 16px 32px;
  font-size: 1.1rem;
  font-weight: 700;
  color: white;
  background-color: #1c7ed6;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 10px 20px rgba(28, 126, 214, 0.2);
}

.cta-button:hover {
  background-color: #1864ab;
  transform: translateY(-3px);
  box-shadow: 0 15px 25px rgba(28, 126, 214, 0.3);
}

.visual {
  flex: 1;
  display: flex;
  justify-content: center;
}

.circle-deco {
  width: 350px;
  height: 350px;
  background: linear-gradient(135deg, #e7f5ff 0%, #d0ebff 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 8rem;
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
}

.features {
  display: flex;
  gap: 30px;
}

.feature-item {
  flex: 1;
  background-color: white;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  border: 1px solid #f1f3f5;
  transition: transform 0.3s, box-shadow 0.3s;
  
  /* ▼▼▼ 클릭 가능한 느낌 추가 ▼▼▼ */
  cursor: pointer; 
}

/* 호버 시 살짝 떠오르면서 그림자 진해짐 */
.feature-item:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 20px rgba(0,0,0,0.1);
  border-color: #1c7ed6; /* 테두리 파란색 포인트 */
}

.feature-item h3 {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 10px;
  color: #343a40;
}

.feature-item p {
  color: #868e96;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .hero {
    flex-direction: column-reverse;
    text-align: center;
    margin-bottom: 50px;
  }
  .title { font-size: 2.5rem; }
  .circle-deco { width: 200px; height: 200px; font-size: 5rem; }
  .features { flex-direction: column; }
}
</style>