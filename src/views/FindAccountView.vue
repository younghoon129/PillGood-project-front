<template>
  <div class="find-account-wrapper">
    <div class="find-box">
      <div class="find-header">
        <h2>계정 정보 찾기 🔍</h2>
        <p>가입 시 등록한 이메일 주소를 입력해 주세요.</p>
      </div>

      <div class="tab-menu">
        <button
          :class="{ active: currentTab === 'id' }"
          @click="changeTab('id')"
        >
          아이디 찾기
        </button>
        <button
          :class="{ active: currentTab === 'pw' }"
          @click="changeTab('pw')"
        >
          비밀번호 찾기
        </button>
      </div>

      <div v-if="currentTab === 'id'" class="tab-content">
        <div v-if="foundUsers.length === 0">
          <div class="input-group">
            <label>이메일 주소</label>
            <input
              v-model="emailForId"
              type="email"
              placeholder="example@email.com"
              @keyup.enter="handleFindId"
            />
          </div>
          <button
            @click="handleFindId"
            class="submit-btn"
            :disabled="isLoading"
          >
            {{ isLoading ? "찾는 중..." : "아이디 확인" }}
          </button>
        </div>

        <div v-else class="result-box">
          <p class="result-msg">해당 이메일로 가입된 계정 목록입니다.</p>
          <div class="user-list">
            <div
              v-for="user in foundUsers"
              :key="user.username"
              class="user-item"
            >
              <div class="user-main">
                <template v-if="checkIfSocial(user)">
                  <span class="social-instruction">
                    <strong>{{ getSocialProvider(user.username) }}</strong>
                    계정입니다.
                  </span>
                  <span :class="['badge', getSocialClass(user.username)]">
                    {{ getSocialProvider(user.username) }} 로그인
                  </span>
                </template>

                <template v-else>
                  <span class="user-id">{{ user.username }}</span>
                  <span class="badge local">일반 계정</span>
                </template>
              </div>

              <div v-if="checkIfSocial(user)" class="social-login-guide">
                "{{ getSocialProvider(user.username) }}로 로그인하기"를 이용해
                주세요.
              </div>

              <div class="user-date">가입일: {{ user.date_joined }}</div>
            </div>
          </div>
          <button
            @click="$router.push({ name: 'Login' })"
            class="login-link-btn primary"
          >
            로그인하러 가기
          </button>
          <button @click="foundUsers = []" class="retry-btn">다시 찾기</button>
        </div>
      </div>

      <div v-else class="tab-content">
        <div v-if="pwStep === 1">
          <div class="input-group">
            <label>이메일 주소</label>
            <input
              v-model="emailForPw"
              type="email"
              placeholder="example@email.com"
              @keyup.enter="handleSendCode"
            />
          </div>
          <button
            @click="handleSendCode"
            class="submit-btn"
            :disabled="isLoading"
          >
            {{ isLoading ? "발송 중..." : "인증번호 받기" }}
          </button>
        </div>

        <div v-else class="pw-reset-step">
          <p class="info-msg">인증번호와 새 비밀번호를 입력하세요.</p>
          <div class="input-group">
            <label>인증번호</label>
            <input
              v-model="authCode"
              type="text"
              placeholder="6자리 숫자"
              maxlength="6"
            />
          </div>
          <div class="input-group">
            <label>새 비밀번호</label>
            <input
              v-model="newPassword"
              type="password"
              placeholder="8자 이상 입력"
            />
          </div>
          <button
            @click="handleResetPassword"
            class="submit-btn"
            :disabled="isLoading"
          >
            {{ isLoading ? "처리 중..." : "비밀번호 변경 완료" }}
          </button>
          <button @click="pwStep = 1" class="back-btn">
            이메일 다시 입력하기
          </button>
        </div>
      </div>

      <div class="footer-links">
        <button @click="$router.push({ name: 'Login' })">
          로그인 페이지로 돌아가기
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "@/api/http";
import { useRouter } from "vue-router";

const router = useRouter();

// 1. 공통 상태 관리
const currentTab = ref("id");
const isLoading = ref(false);

// 2. 아이디 찾기 관련 상태
const emailForId = ref("");
const foundUsers = ref([]);

// 3. 비밀번호 찾기 관련 상태
const pwStep = ref(1);
const emailForPw = ref("");
const authCode = ref("");
const newPassword = ref("");

// [기능] 탭 전환 시 모든 입력값 초기화
const changeTab = (tab) => {
  currentTab.value = tab;
  foundUsers.value = [];
  pwStep.value = 1;
  emailForId.value = "";
  emailForPw.value = "";
  authCode.value = "";
  newPassword.value = "";
};

// 🚩 [기능] 소셜 계정 여부 판별 (이중 체크)
const checkIfSocial = (user) => {
  return (
    user.is_social ||
    user.username.startsWith("naver_") ||
    user.username.startsWith("kakao_") ||
    user.username.startsWith("google_")
  );
};

// 🚩 [기능] 플랫폼 이름 반환
const getSocialProvider = (username) => {
  if (username.startsWith("naver_")) return "네이버";
  if (username.startsWith("kakao_")) return "카카오";
  if (username.startsWith("google_")) return "구글";
  return "소셜";
};

// 🚩 [기능] 플랫폼별 디자인 클래스 반환
const getSocialClass = (username) => {
  if (username.startsWith("naver_")) return "naver-bg";
  if (username.startsWith("kakao_")) return "kakao-bg";
  if (username.startsWith("google_")) return "google-bg";
  return "local";
};

// [API] 아이디 찾기 요청
const handleFindId = async () => {
  if (!emailForId.value) return alert("이메일을 입력해 주세요.");
  isLoading.value = true;
  try {
    const res = await axios.post("/accounts/find-id/", {
      email: emailForId.value,
    });
    foundUsers.value = res.data.users;
  } catch (err) {
    alert(err.response?.data?.error || "등록되지 않은 이메일입니다.");
  } finally {
    isLoading.value = false;
  }
};

// [API] 인증번호 발송 요청
const handleSendCode = async () => {
  if (!emailForPw.value) return alert("이메일을 입력해 주세요.");
  isLoading.value = true;
  try {
    await axios.post("/accounts/password-reset-send/", {
      email: emailForPw.value,
    });
    alert("인증번호가 발송되었습니다. 메일함을 확인해 주세요!");
    pwStep.value = 2;
  } catch (err) {
    alert(err.response?.data?.error || "인증번호 발송에 실패했습니다.");
  } finally {
    isLoading.value = false;
  }
};

// [API] 비밀번호 재설정 확정 요청
const handleResetPassword = async () => {
  if (!authCode.value || !newPassword.value)
    return alert("모든 항목을 입력해 주세요.");
  isLoading.value = true;
  try {
    await axios.post("/accounts/password-reset-confirm/", {
      email: emailForPw.value,
      code: authCode.value,
      new_password: newPassword.value,
    });
    alert("비밀번호가 안전하게 변경되었습니다. 다시 로그인해 주세요.");
    router.push({ name: "Login" });
  } catch (err) {
    alert(err.response?.data?.error || "인증 정보가 일치하지 않습니다.");
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* 전체 배경 */
.find-account-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 85vh;
  background-color: #f1f4f9;
  padding: 20px;
}

/* 찾기 박스 */
.find-box {
  width: 100%;
  max-width: 480px;
  background: white;
  padding: 40px;
  border-radius: 24px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.08);
}

.find-header {
  text-align: center;
  margin-bottom: 30px;
}
.find-header h2 {
  font-size: 1.6rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 8px;
}
.find-header p {
  color: #64748b;
  font-size: 0.95rem;
}

/* 탭 스타일 */
.tab-menu {
  display: flex;
  border-bottom: 2px solid #f1f5f9;
  margin-bottom: 30px;
}

.tab-menu button {
  flex: 1;
  padding: 15px;
  border: none;
  background: none;
  font-weight: 700;
  color: #94a3b8;
  cursor: pointer;
  transition: 0.3s;
}

.tab-menu button.active {
  color: #1c7ed6;
  border-bottom: 2px solid #1c7ed6;
}

/* 입력 그룹 */
.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
  text-align: left;
}
.input-group label {
  font-size: 0.9rem;
  font-weight: 700;
  color: #475569;
  padding-left: 4px;
}
.input-group input {
  padding: 14px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
}
.input-group input:focus {
  border-color: #1c7ed6;
  outline: none;
  box-shadow: 0 0 0 3px rgba(28, 126, 214, 0.1);
}

/* 버튼 스타일 */
.submit-btn {
  width: 100%;
  padding: 16px;
  background-color: #1c7ed6;
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s;
}
.submit-btn:hover:not(:disabled) {
  background-color: #1864ab;
  transform: translateY(-1px);
}
.submit-btn:disabled {
  background-color: #cbd5e1;
  cursor: not-allowed;
}

/* 결과 리스트 */
.result-box {
  text-align: center;
}
.result-msg {
  margin-bottom: 20px;
  color: #64748b;
  font-weight: 600;
}

.user-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 25px;
}
.user-item {
  background: #f8fafc;
  padding: 18px;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  text-align: left;
}

.user-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
.user-id {
  font-size: 1.1rem;
  font-weight: 800;
  color: #1c7ed6;
}

/* 🚩 소셜 안내 텍스트 스타일 */
.social-instruction {
  font-size: 1.05rem;
  color: #334155;
}
.social-instruction strong {
  color: #1c7ed6;
  font-weight: 800;
}

.social-login-guide {
  font-size: 0.85rem;
  color: #475569;
  background: #ffffff;
  padding: 12px;
  border-radius: 10px;
  border: 1px dashed #cbd5e1;
  margin: 10px 0;
  font-weight: 600;
  text-align: center;
}

/* 🚩 소셜 뱃지 컬러 */
.badge {
  font-size: 0.75rem;
  padding: 4px 10px;
  border-radius: 6px;
  font-weight: 700;
}
.naver-bg {
  background: #03c75a !important;
  color: white !important;
}
.kakao-bg {
  background: #fee500 !important;
  color: #3c1e1e !important;
}
.google-bg {
  background: #ffffff !important;
  color: #333 !important;
  border: 1px solid #ddd;
}
.local {
  background: #e7f5ff;
  color: #1c7ed6;
}

.user-date {
  font-size: 0.8rem;
  color: #94a3b8;
  margin-top: 5px;
}

/* 기타 버튼 */
.login-link-btn.primary {
  background: #1c7ed6;
  color: white;
  width: 100%;
  padding: 14px;
  border-radius: 12px;
  border: none;
  font-weight: 700;
  cursor: pointer;
  margin-top: 15px;
}
.retry-btn {
  background: none;
  border: none;
  color: #94a3b8;
  margin-top: 12px;
  cursor: pointer;
  text-decoration: underline;
  width: 100%;
}

.info-msg {
  color: #1c7ed6;
  font-size: 0.9rem;
  margin-bottom: 20px;
  font-weight: 700;
}
.back-btn {
  background: none;
  border: none;
  color: #94a3b8;
  margin-top: 15px;
  cursor: pointer;
  width: 100%;
}

.footer-links {
  margin-top: 30px;
  border-top: 1px solid #f1f5f9;
  padding-top: 20px;
  text-align: center;
}
.footer-links button {
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  font-size: 0.9rem;
}
</style>
