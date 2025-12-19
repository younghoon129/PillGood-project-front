<template>
  <section class="info-section relative-container">
    <transition name="fade">
      <div v-if="isSuccess" class="success-overlay">
        <div class="success-content">
          <div class="checkmark-circle">
            <svg
              class="checkmark"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 52 52"
            >
              <circle
                class="checkmark__circle"
                cx="26"
                cy="26"
                r="25"
                fill="none"
              />
              <path
                class="checkmark__check"
                fill="none"
                d="M14.1 27.2l7.1 7.2 16.7-16.8"
              />
            </svg>
          </div>
          <p class="success-text">일정이 등록되었습니다!</p>
        </div>
      </div>
    </transition>

    <div class="calendar-header">
      <h3 class="section-title">📅 구글 캘린더 일정 등록</h3>
      <div v-if="hasGoogleToken" class="connection-status">
        <span class="dot"></span>
        <span class="txt">구글 연동 중</span>
        <button
          @click="disconnectGoogle"
          class="btn-unlink"
          :disabled="isSuccess"
        >
          연동 해제
        </button>
      </div>
    </div>

    <div v-if="!hasGoogleToken" class="google-auth-box">
      <p>구글 캘린더와 연동하여 복용 알림을 받아보세요.</p>
      <button @click="connectGoogle" class="btn-google">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_Color_Icon.svg"
          alt="G"
        />
        구글 계정 연동하기
      </button>
    </div>

    <div
      v-else
      class="calendar-form-body"
      :class="{ 'form-blurred': isSuccess }"
    >
      <div class="input-row full">
        <label>영양제 이름</label>
        <div class="custom-input">
          <span class="icon">💊</span>
          <input
            v-model="pillName"
            type="text"
            placeholder="어떤 영양제를 드시나요?"
            :disabled="isSuccess"
          />
        </div>
      </div>

      <div class="input-row-group">
        <div class="input-row">
          <label>복용 날짜</label>
          <div class="custom-input">
            <span class="icon">📆</span>
            <input
              v-model="selectedDate"
              type="date"
              :min="today"
              :disabled="isSuccess"
            />
          </div>
        </div>
        <div class="input-row">
          <label>알림 시간</label>
          <div class="custom-input">
            <span class="icon">⏰</span>
            <input v-model="intakeTime" type="time" :disabled="isSuccess" />
          </div>
        </div>
      </div>

      <div class="input-row full">
        <label>복용 메모 (선택)</label>
        <div class="custom-input">
          <span class="icon">📝</span>
          <textarea
            v-model="description"
            rows="2"
            placeholder="예: 식후 30분 뒤 복용"
            :disabled="isSuccess"
          ></textarea>
        </div>
      </div>

      <button
        @click="registerToGoogle"
        class="btn-calendar-submit"
        :disabled="isLoading || isSuccess"
      >
        <span v-if="isLoading">등록 중...</span>
        <span v-else>구글 캘린더에 일정 추가</span>
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";

const pillName = ref("");
const selectedDate = ref("");
const intakeTime = ref("09:00");
const description = ref("");
const isLoading = ref(false);
const hasGoogleToken = ref(false);
const isSuccess = ref(false); // 🚩 성공 상태 관리용 변수 추가

const today = computed(() => new Date().toISOString().split("T")[0]);

onMounted(() => {
  hasGoogleToken.value = !!localStorage.getItem("google_access_token");
});

const connectGoogle = () => {
  const CLIENT_ID =
    "34177585488-sbk57388v5hfnjprm894sfl5ektmjpn9.apps.googleusercontent.com";
  const REDIRECT_URI = "http://localhost:5173/login/google";
  const scope = encodeURIComponent(
    "https://www.googleapis.com/auth/calendar.events openid email profile"
  );
  window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;
};

const disconnectGoogle = () => {
  if (confirm("연동을 해제하시겠습니까?")) {
    localStorage.removeItem("google_access_token");
    hasGoogleToken.value = false;
  }
};

const registerToGoogle = async () => {
  if (!pillName.value || !selectedDate.value)
    return alert("항목을 입력해주세요.");
  isLoading.value = true;
  try {
    const djangoToken = localStorage.getItem("token");
    const googleToken = localStorage.getItem("google_access_token");
    await axios.post(
      "http://localhost:8000/pills/google-calendar/",
      {
        pillName: pillName.value,
        date: selectedDate.value,
        time: intakeTime.value,
        description: description.value,
      },
      {
        headers: {
          Authorization: `Token ${djangoToken}`,
          "Google-Access-Token": googleToken,
        },
      }
    );

    // 🚩 성공 처리 로직 변경
    // alert("✅ 캘린더 등록 성공!"); // 기존 alert 제거
    pillName.value = "";
    description.value = "";

    isSuccess.value = true; // 성공 애니메이션 시작
    setTimeout(() => {
      isSuccess.value = false; // 2.5초 후 애니메이션 종료
    }, 2500);
  } catch (err) {
    alert("등록 실패: 연동 상태를 확인해주세요.");
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* 오버레이를 위한 상대 위치 설정 */
.relative-container {
  position: relative;
  overflow: hidden; /* 오버레이가 둥근 모서리를 넘치지 않게 */
}

/* ================= 애니메이션 관련 스타일 ================= */

/* 성공 오버레이 배경 */
.success-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(2px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  border-radius: inherit; /* 부모의 border-radius 상속 */
}

.success-content {
  text-align: center;
}

.success-text {
  margin-top: 15px;
  font-size: 1.1rem;
  font-weight: 700;
  color: #10b981;
}

/* 폼 블러 처리 (성공 시 뒷배경 흐리게) */
.calendar-form-body.form-blurred {
  filter: blur(3px);
  pointer-events: none; /* 애니메이션 중 클릭 방지 */
  transition: filter 0.3s ease;
}

/* Vue Transition: Fade 효과 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 체크마크 SVG 애니메이션 */
.checkmark-circle {
  width: 80px;
  height: 80px;
  margin: 0 auto;
}

.checkmark__circle {
  stroke-dasharray: 166;
  stroke-dashoffset: 166;
  stroke-width: 2;
  stroke-miterlimit: 10;
  stroke: #10b981;
  fill: none;
  animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
}

.checkmark {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: block;
  stroke-width: 3;
  stroke: #fff;
  stroke-miterlimit: 10;
  box-shadow: inset 0px 0px 0px #10b981;
  animation: fill 0.4s ease-in-out 0.4s forwards,
    scale 0.3s ease-in-out 0.9s both;
}

.checkmark__check {
  transform-origin: 50% 50%;
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
}

@keyframes stroke {
  100% {
    stroke-dashoffset: 0;
  }
}
@keyframes scale {
  0%,
  100% {
    transform: none;
  }
  50% {
    transform: scale3d(1.1, 1.1, 1);
  }
}
@keyframes fill {
  100% {
    box-shadow: inset 0px 0px 0px 50px #10b981;
  }
}

/* ================= 기존 스타일 유지 ================= */
.info-section {
  box-sizing: border-box;
}
.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.section-title {
  margin: 0;
}
.connection-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
}
.dot {
  width: 7px;
  height: 7px;
  background: #10b981;
  border-radius: 50%;
}
.txt {
  color: #10b981;
  font-weight: 600;
}
.btn-unlink {
  background: none;
  border: none;
  color: #a0aec0;
  cursor: pointer;
  text-decoration: underline;
  font-size: 0.8rem;
}
.calendar-form-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
  transition: filter 0.3s ease;
}
.input-row-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.input-row label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 6px;
}
.custom-input {
  position: relative;
  display: flex;
  align-items: center;
}
.icon {
  position: absolute;
  left: 12px;
  font-size: 1rem;
  z-index: 1;
}
input,
textarea {
  width: 100%;
  padding: 10px 10px 10px 38px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.9rem;
  background-color: #fcfcfc;
  transition: border-color 0.2s;
}
input:focus,
textarea:focus {
  outline: none;
  border-color: #4285f4;
  background-color: #fff;
}
.btn-calendar-submit {
  width: 100%;
  padding: 14px;
  margin-top: 10px;
  background: #4285f4;
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.2s;
}
.btn-calendar-submit:disabled {
  background-color: #a0aec0;
  cursor: not-allowed;
}
.google-auth-box {
  text-align: center;
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
}
.btn-google {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 15px auto 0;
  padding: 10px 20px;
  background: white;
  border: 1px solid #cbd5e0;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
}
@media (max-width: 600px) {
  .input-row-group {
    grid-template-columns: 1fr;
  }
}
</style>
