<script setup>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import ChatBotView from "./ChatBotView.vue";

const router = useRouter();

const showChatModal = ref(false);
const showAboutModal = ref(false);

// 스크롤 잠금
watch(showChatModal, (newValue) => {
  document.body.style.overflow = newValue ? "hidden" : "";
});
watch(showAboutModal, (newValue) => {
  document.body.style.overflow = newValue ? "hidden" : "";
});

watch(showChatModal, (newValue) => {
  if (newValue) {
    document.body.style.overflow = "hidden"; // 스크롤 잠금
  } else {
    document.body.style.overflow = ""; // 스크롤 해제
  }
});

// '영양제 리스트' 페이지로 이동
const goPillList = () => {
  router.push({ name: "pills_index" });
};

// '맞춤 추천' 페이지로 이동
const goRecommendation = () => {
  // router/index.js에 등록한 name: 'recommendation'으로 이동
  router.push({ name: "recommendation" });
};

const goChatBot = () => {
  showChatModal.value = true;
};

const openAbout = () => (showAboutModal.value = true);
const closeAboutModal = () => (showAboutModal.value = false);

// 준비 중 알림 함수
const alertNotReady = () => {
  alert("준비 중인 기능입니다! 조금만 기다려주세요 🛠️");
};
</script>

<template>
  <div class="home-wrapper">
    <div
      class="main-container"
      :class="{ 'is-blurred': showChatModal, 'is-blurred': showAboutModal }"
    >
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
          <button @click="openAbout" class="cta-button">
            PillGood을 소개합니다 →
          </button>
        </div>

        <div class="visual">
          <div class="circle-deco">💊</div>
        </div>
      </section>

      <section class="features">
        <div class="feature-item" @click="goPillList">
          <h3>🔍 영양제 찾아보기</h3>
          <p>다양한 영양제<br />쉽게 확인해보세요</p>
        </div>

        <div class="feature-item" @click="goChatBot">
          <h3>🤖 AI 추천 서비스</h3>
          <p>나의 상황에 필요한 <br />영양제를 알려드려요</p>
        </div>

        <div class="feature-item" @click="goRecommendation">
          <h3>📋 맞춤 추천</h3>
          <p>증상과 목적에 맞는<br />영양제를 찾으세요</p>
        </div>
      </section>
    </div>

    <Transition name="modal-fade">
      <div
        v-if="showChatModal"
        class="modal-overlay"
        @click.self="showChatModal = false"
      >
        <div class="modal-window">
          <ChatBotView @close="showChatModal = false" />
        </div>
      </div>
    </Transition>
    <Transition name="modal-fade">
      <div
        v-if="showAboutModal"
        class="modal-overlay"
        @click.self="closeAboutModal"
      >
        <div class="modal-window about-window">
          <button class="close-btn" @click="closeAboutModal">×</button>

          <div class="about-content">
            <div class="about-header">
              <h2>PillGood을 소개합니다</h2>
              <p>내 몸에 꼭 맞는 스마트한 영양 관리</p>
            </div>

            <div class="about-body">
              <p class="vision-text">
                <span class="highlight-brand">PillGood</span>은
                <strong>'기분 좋다(Feel Good)'</strong>라는 의미처럼, 영양제
                선택의 스트레스를 덜고 소비자의 건강한 삶을 응원합니다.
                <br class="pc-br" />
                우리는 <strong>식품의약품안전처</strong> 기반의 데이터를 통해
                복잡한 성분표를 투명하게 분석하며, 누구나 쉽고 안전하게 자신에게
                맞는 영양제를 찾을 수 있는 행복한 헬스케어 경험을 만들어
                가겠습니다.
              </p>
              <ul class="feature-list">
                <li>✨ 4,000여 종의 영양제 데이터베이스 구축</li>
                <li>🔍 개인별 맞춤 영양 성분 분석</li>
                <li>🚫 알레르기 유발 성분 자동 필터링</li>
                <li>📅 구글 캘린더에 섭취 일정 등록 & 알림 기능</li>
                <li>💬 100% 내돈내산 사용자 후기 공유</li>
                <li>🤖 개인별 최적화된 AI 맞춤 케어</li>
              </ul>
              <div class="usage-guide">
                <h3 class="guide-title">💡 PillGood 100% 활용 꿀팁</h3>
                <ul class="guide-list">
                  <li>
                    <span class="icon">📅</span>
                    <div class="text">
                      <strong>스마트한 일정 관리</strong>
                      <p>
                        마이페이지에서 <span>구글 계정</span>을 연동하면 섭취
                        일정을 캘린더에 자동으로 등록해 드려요.
                      </p>
                    </div>
                  </li>
                  <li>
                    <span class="icon">🛡️</span>
                    <div class="text">
                      <strong>안심 알레르기 체크</strong>
                      <p>
                        나의 알레르기 성분을 미리 설정해 보세요! 해당 성분이
                        포함된 영양제를 볼 때 <span>경고 알림</span>을
                        띄워줍니다.
                      </p>
                    </div>
                  </li>
                  <li>
                    <span class="icon">💊</span>
                    <div class="text">
                      <strong>중복 섭취 방지</strong>
                      <p>
                        영양제함에 영양제를 보관해 보세요! 다른 영양제를 볼 때
                        성분이 겹쳐 <span>과다 섭취</span> 위험이 있을 경우 즉시
                        알려드려요.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
              <p class="highlight-text">
                우리는 데이터로 더 정직한 건강 세상을 만듭니다.
              </p>
              <div class="source-info">
                <p>📢 데이터 출처 안내</p>
                <div class="source-details">
                  <span>영양제 정보 : <strong>식품의약품안전처</strong></span>
                  <span class="divider">|</span>
                  <span>이미지 · 구매 정보 : <strong>네이버</strong></span>
                </div>
              </div>
            </div>

            <button @click="closeAboutModal" class="confirm-btn">확인</button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.source-info {
  margin-top: 24px;
  margin-bottom: 10px;
  padding-top: 15px;
  border-top: 1px solid #e9ecef;

  /* 1. 다시 가운데 정렬로 복귀 */
  text-align: center;

  /* 2. 🔥 핵심: 전체 위치를 강제로 왼쪽으로 조금 밀기 */
  position: relative;
  left: -10px; /* 마이너스(-) 값을 주면 왼쪽으로 이동합니다. 숫자를 조절해보세요! */
}

/* "데이터 출처 안내" 타이틀 */
.source-info p {
  font-size: 0.75rem;
  color: #adb5bd;
  margin-bottom: 6px;
  font-weight: 500;

  /* 타이틀도 가운데 정렬 유지를 위해 flex + center 사용 */
  display: flex;
  justify-content: center; /* 가운데 정렬 */
  align-items: center;
  gap: 4px;
}

/* 실제 출처 텍스트들 */
.source-details {
  display: flex;
  justify-content: center; /* 내용물 가운데 정렬 */
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 0.7rem;
  color: #868e96;
}

/* (나머지 스타일 동일) */
.source-details strong {
  font-weight: 600;
  color: #495057;
}

.divider {
  color: #dee2e6;
  font-size: 0.6rem;
}

/* ... 기존 스타일 유지 ... */

.vision-text {
  font-size: 16px; /* 글자 크기 적당히 */
  line-height: 1.8; /* 줄 간격을 넓혀 읽기 편하게 */
  color: #4b5563; /* 촌스러운 검정 대신 진한 회색 */
  margin: 0; /* 기본 여백 제거 (필요시 조정) */
  word-break: keep-all; /* 단어 중간에 줄바꿈 방지 */
}

/* 1. PillGood 브랜드명 강조 (색상 + 굵기) */
.highlight-brand {
  color: #1c7ed6; /* 신뢰감을 주는 에메랄드 그린 */
  font-weight: 800; /* 가장 두껍게 */
  font-size: 1.1em; /* 살짝 키움 */
}

/* 2. 'Feel Good' 의미 강조 (배경 형광펜 효과) */
.highlight-meaning {
  background: linear-gradient(
    to top,
    #d1fae5 40%,
    transparent 40%
  ); /* 아래쪽만 연한 형광펜 칠한 느낌 */
  font-weight: 700;
}

/* 3. 식약처 강조 (밑줄 효과) */
.highlight-trust {
  font-weight: 700;
  text-decoration: underline;
  text-decoration-color: #10b981; /* 초록색 밑줄 */
  text-decoration-thickness: 2px; /* 밑줄 두께 */
  text-underline-offset: 4px; /* 글자와 밑줄 사이 간격 */
  color: #1f2937; /* 진한 검정 */
}

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
  content: "";
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
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0px);
  }
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
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f3f5;
  transition: transform 0.3s, box-shadow 0.3s;

  /* ▼▼▼ 클릭 가능한 느낌 추가 ▼▼▼ */
  cursor: pointer;
}

/* 호버 시 살짝 떠오르면서 그림자 진해짐 */
.feature-item:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.1);
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
  .title {
    font-size: 2.5rem;
  }
  .circle-deco {
    width: 200px;
    height: 200px;
    font-size: 5rem;
  }
  .features {
    flex-direction: column;
  }
}

/* 🚩 블러 효과: 모달이 켜졌을 때 배경 흐리게 */
.is-blurred {
  filter: blur(8px);
  transition: filter 0.3s ease;
  pointer-events: none; /* 배경 클릭 방지 */
}

/* 모달 전체 배경 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

/* 모달 창 크기 및 애니메이션 */
.modal-window {
  width: 100%;
  max-width: 600px;
  height: 80vh;
  background: white;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  display: flex;
}
.chat-window {
  width: 100%;
  max-width: 600px;
  height: 80vh;
}

/* [수정 6] 기업 소개 모달 스타일 추가 */
.about-window {
  width: 90%;
  max-width: 500px;

  height: 90%;
  display: flex;
  flex-direction: column;
  position: relative;

  padding: 0;
  padding-right: 14px;
  overflow-y: auto;
  scrollbar-width: thin; /* Firefox */
  scrollbar-color: rgba(150, 150, 150, 0.4) transparent;
}

.about-content {
  padding: 40px 30px;
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 20px;
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #868e96;
}

.about-header h2 {
  color: #1c7ed6;
  margin-bottom: 8px;
  font-size: 1.8rem;
}

.about-header p {
  color: #868e96;
  font-size: 0.95rem;
}

.about-body {
  margin: 30px 0;
  line-height: 1.7;
  color: #495057;
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 20px 0;
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 12px;
}

.feature-list li {
  margin-bottom: 10px;
  font-weight: 500;
}

.feature-list li:last-child {
  margin-bottom: 0;
}

.highlight-text {
  font-weight: bold;
  color: #1c7ed6;
  text-align: center;
  margin-top: 20px;
}

.confirm-btn {
  width: 100%;
  padding: 15px;
  background-color: #1c7ed6;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
}

.confirm-btn:hover {
  background-color: #1864ab;
}

/* 모달 애니메이션 */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.4s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
