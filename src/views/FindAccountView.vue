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
                <template v-if="checkIfSocial(user.username)">
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
              <div
                v-if="checkIfSocial(user.username)"
                class="social-login-guide"
              >
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
              placeholder="가입한 이메일을 입력하세요"
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

        <div v-else-if="pwStep === 2">
          <p class="info-msg">메일로 발송된 인증번호 6자리를 입력하세요.</p>
          <div class="input-group">
            <label>인증번호</label>
            <input
              v-model="authCode"
              type="text"
              placeholder="6자리 숫자"
              maxlength="6"
              @keyup.enter="handleVerifyCode"
            />
          </div>
          <button
            @click="handleVerifyCode"
            class="submit-btn"
            :disabled="isLoading"
          >
            인증 확인
          </button>
          <button @click="pwStep = 1" class="back-btn">이메일 다시 입력</button>
        </div>

        <div v-else-if="pwStep === 3" class="result-box">
          <p class="result-msg">비밀번호를 재설정할 계정을 선택해 주세요.</p>
          <div class="user-list">
            <div
              v-for="acc in pwAccountList"
              :key="acc.username"
              class="user-item selectable"
              :class="{
                selected: selectedUsername === acc.username,
                disabled: checkIfSocial(acc.username),
              }"
              @click="
                !checkIfSocial(acc.username) &&
                  (selectedUsername = acc.username)
              "
            >
              <div class="user-main">
                <span class="user-id">{{ acc.username }}</span>
                <span
                  v-if="checkIfSocial(acc.username)"
                  :class="['badge', getSocialClass(acc.username)]"
                >
                  {{ getSocialProvider(acc.username) }} (변경 불가)
                </span>
                <span v-else class="badge local">일반 계정</span>
              </div>
              <p v-if="checkIfSocial(acc.username)" class="social-guide-small">
                소셜 계정 비밀번호는 해당 플랫폼에서 변경 가능합니다.
              </p>
            </div>
          </div>
          <button
            @click="pwStep = 4"
            class="submit-btn"
            :disabled="!selectedUsername"
          >
            선택한 계정으로 계속하기
          </button>
        </div>

        <div v-else-if="pwStep === 4">
          <p class="info-msg">
            <strong>[{{ selectedUsername }}]</strong> 계정의 새 비밀번호를
            입력하세요.
          </p>
          <div class="input-group">
            <label>새 비밀번호</label>
            <input
              v-model="newPassword"
              type="password"
              placeholder="8자 이상 입력"
              @keyup.enter="handleResetPassword"
            />
          </div>
          <button
            @click="handleResetPassword"
            class="submit-btn"
            :disabled="isLoading"
          >
            비밀번호 변경 완료
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

// 공통 상태
const currentTab = ref("id");
const isLoading = ref(false);

// 아이디 찾기 상태
const emailForId = ref("");
const foundUsers = ref([]);

// 비밀번호 찾기 상태
const pwStep = ref(1);
const emailForPw = ref("");
const authCode = ref("");
const pwAccountList = ref([]);
const selectedUsername = ref("");
const newPassword = ref("");

const changeTab = (tab) => {
  currentTab.value = tab;
  foundUsers.value = [];
  pwStep.value = 1;
  emailForId.value = "";
  emailForPw.value = "";
  authCode.value = "";
  pwAccountList.value = [];
  selectedUsername.value = "";
  newPassword.value = "";
};

const checkIfSocial = (username) => {
  return (
    username.startsWith("naver_") ||
    username.startsWith("kakao_") ||
    username.startsWith("google_")
  );
};

const getSocialProvider = (username) => {
  if (username.startsWith("naver_")) return "네이버";
  if (username.startsWith("kakao_")) return "카카오";
  if (username.startsWith("google_")) return "구글";
  return "소셜";
};

const getSocialClass = (username) => {
  if (username.startsWith("naver_")) return "naver-bg";
  if (username.startsWith("kakao_")) return "kakao-bg";
  if (username.startsWith("google_")) return "google-bg";
  return "local";
};

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

const handleSendCode = async () => {
  if (!emailForPw.value) return alert("이메일을 입력해 주세요.");
  isLoading.value = true;
  try {
    await axios.post("/accounts/password-reset-send/", {
      email: emailForPw.value,
    });
    alert("인증번호가 발송되었습니다!");
    pwStep.value = 2;
  } catch (err) {
    alert(err.response?.data?.error || "발송 실패");
  } finally {
    isLoading.value = false;
  }
};

const handleVerifyCode = async () => {
  if (!authCode.value) return alert("인증번호를 입력해 주세요.");
  isLoading.value = true;
  try {
    const res = await axios.post("/accounts/password-reset-verify/", {
      email: emailForPw.value,
      code: authCode.value,
    });
    pwAccountList.value = res.data.user_list;
    pwStep.value = 3;
  } catch (err) {
    alert(err.response?.data?.error || "인증번호가 틀렸거나 만료되었습니다.");
  } finally {
    isLoading.value = false;
  }
};

const handleResetPassword = async () => {
  if (!newPassword.value) return alert("새 비밀번호를 입력해 주세요.");
  isLoading.value = true;
  try {
    await axios.post("/accounts/password-reset-confirm/", {
      email: emailForPw.value,
      code: authCode.value,
      username: selectedUsername.value,
      new_password: newPassword.value,
    });
    alert("비밀번호가 안전하게 변경되었습니다. 다시 로그인해 주세요.");
    router.push({ name: "Login" });
  } catch (err) {
    alert(err.response?.data?.error || "변경 실패");
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* [1] 기본 레이아웃 */
.find-account-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 90vh;
  background-color: #f1f4f9;
  padding: 20px;
}

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

/* [2] 탭 메뉴 */
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

/* [3] 공통 입력창 및 버튼 */
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
}

.input-group input {
  padding: 14px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
}

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

.submit-btn:disabled {
  background-color: #cbd5e1;
  cursor: not-allowed;
}

/* [4] 결과 리스트 및 아이템 디자인 */
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

/* 계정 선택용 특수 스타일 */
.user-item.selectable {
  cursor: pointer;
  border: 2px solid transparent;
  transition: 0.2s;
}

.user-item.selectable:hover:not(.disabled) {
  border-color: #1c7ed6;
  background: #e7f5ff;
}

.user-item.selected {
  border-color: #1c7ed6;
  background: #e7f5ff;
}

.user-item.disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: #f1f5f9;
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

/* [5] 소셜 뱃지 및 안내 */
.social-instruction {
  font-size: 1rem;
  color: #334155;
}

.social-instruction strong {
  color: #1c7ed6;
}

.social-login-guide {
  font-size: 0.85rem;
  color: #475569;
  background: #ffffff;
  padding: 10px;
  border-radius: 8px;
  border: 1px dashed #cbd5e1;
  margin: 10px 0;
  text-align: center;
}

.social-guide-small {
  font-size: 0.75rem;
  color: #ef4444;
}

.badge {
  font-size: 0.75rem;
  padding: 4px 10px;
  border-radius: 6px;
  font-weight: 700;
}

.naver-bg {
  background: #03c75a;
  color: white;
}
.kakao-bg {
  background: #fee500;
  color: #3c1e1e;
}
.google-bg {
  background: #ffffff;
  color: #333;
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

/* [6] 유틸리티 버튼 */
.retry-btn,
.back-btn {
  background: none;
  border: none;
  color: #94a3b8;
  margin-top: 15px;
  cursor: pointer;
  text-decoration: underline;
  width: 100%;
}

.login-link-btn.primary {
  background: #1c7ed6;
  color: white;
  width: 100%;
  padding: 14px;
  border-radius: 12px;
  border: none;
  font-weight: 700;
  margin-top: 15px;
  cursor: pointer;
}

.info-msg {
  color: #1c7ed6;
  font-size: 0.9rem;
  margin-bottom: 20px;
  font-weight: 700;
  text-align: center;
}

.footer-links {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #f1f5f9;
  text-align: center;
}

.footer-links button {
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
}
</style>
