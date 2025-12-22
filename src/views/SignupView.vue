<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import { onMounted } from "vue";
import axios from "axios";
import { computed } from "vue";

const authStore = useAuthStore();
const router = useRouter();

const isGenreOpen = ref(false);
const isAllergyOpen = ref(false);

const signupData = ref({
  username: "",
  password: "",
  passwordConfirm: "",
  email: "",
  gender: "M",
  age: 20,
  interested_genres: [],
  allergies: [],
});

const isPasswordMatch = computed(() => {
  return signupData.value.password === signupData.value.passwordConfirm;
});

const categories = ref([]);
const allergiesOptions = ref([]);

const handleSignup = async () => {
  if (!isPasswordMatch.value) {
    alert("비밀번호가 일치하지 않습니다!");
    return;
  }

  try {
    const { passwordConfirm, ...payload } = signupData.value;
    await authStore.signup(payload);

    alert("회원가입 성공! 🎉");
    router.push({ name: "Home" });
  } catch (err) {
    // 🚩 서버에서 보낸 상세 에러 메시지가 있는지 확인
    if (err.response && err.response.data) {
      const errorData = err.response.data;

      // 1. 아이디 중복 에러가 있는 경우
      if (errorData.username) {
        alert(`아이디 오류: ${errorData.username[0]}`);
      }
      // 2. 이메일 중복 에러가 있는 경우
      else if (errorData.email) {
        alert(`이메일 오류: ${errorData.email[0]}`);
      }
      // 3. 기타 유효성 검사 에러
      else {
        alert("입력하신 정보를 다시 확인해주세요.");
      }
    } else {
      // 서버 연결 자체가 실패한 경우 등
      alert("서버와 통신 중 오류가 발생했습니다.");
    }
  }
};

// 카테고리 목록을 백엔드에서 가져옴
onMounted(async () => {
  try {
    const [catRes, allergyRes] = await Promise.all([
      axios.get("http://localhost:8000/pills/categories/"),
      axios.get("http://localhost:8000/accounts/allergies/"),
    ]);

    categories.value = catRes.data;
    allergiesOptions.value = allergyRes.data;
  } catch (err) {
    console.error("데이터를 불러오는데 실패했습니다.", err);
  }
});
</script>

<template>
  <div class="signup-page">
    <div class="signup-card">
      <h2 class="signup-title">회원가입</h2>
      <form @submit.prevent="handleSignup" class="signup-grid-form">
        <div class="field full">
          <label>아이디</label>
          <input
            v-model="signupData.username"
            type="text"
            placeholder="사용할 아이디 입력"
          />
        </div>
        <div class="field full">
          <label for="email">이메일</label>
          <input
            type="email"
            id="email"
            v-model="signupData.email"
            placeholder="example@pillgood.com"
            required
          />
        </div>

        <div class="field full">
          <label>비밀번호 *</label>
          <input
            v-model="signupData.password"
            type="password"
            placeholder="비밀번호를 입력하세요"
            required
          />
        </div>

        <div class="field full">
          <label>비밀번호 확인 *</label>
          <input
            v-model="signupData.passwordConfirm"
            type="password"
            placeholder="비밀번호를 한 번 더 입력하세요"
            required
          />

          <p
            v-if="signupData.passwordConfirm && !isPasswordMatch"
            class="error-msg"
            style="color: red"
          >
            비밀번호가 일치하지 않습니다.
          </p>
          <p
            v-if="signupData.passwordConfirm && isPasswordMatch"
            class="success-msg"
            style="color: blue"
          >
            비밀번호가 일치합니다.
          </p>
        </div>

        <div class="field">
          <label>성별</label>
          <div class="gender-btns">
            <button
              type="button"
              :class="{ 'active-male': signupData.gender === 'M' }"
              @click="signupData.gender = 'M'"
            >
              남성
            </button>
            <button
              type="button"
              :class="{ 'active-female': signupData.gender === 'F' }"
              @click="signupData.gender = 'F'"
            >
              여성
            </button>
          </div>
        </div>

        <div class="field">
          <label>나이</label>
          <input
            v-model.number="signupData.age"
            type="number"
            placeholder="만 나이"
          />
        </div>

        <div class="field full toggle-section">
          <div class="toggle-header" @click="isGenreOpen = !isGenreOpen">
            <label class="section-label">
              관심 있는 건강 분야
              <span class="sub-text">(복수 선택 가능)</span>
            </label>
            <span class="toggle-icon" :class="{ rotated: isGenreOpen }">▼</span>
          </div>

          <div class="toggle-content" :class="{ open: isGenreOpen }">
            <div class="category-grid">
              <label v-for="cat in categories" :key="cat.id" class="cat-item">
                <input
                  type="checkbox"
                  :value="cat.id"
                  v-model="signupData.interested_genres"
                  class="hidden-checkbox"
                />
                <div class="cat-chip">{{ cat.name }}</div>
              </label>
            </div>
          </div>
        </div>

        <div class="field full toggle-section mt-3">
          <div class="toggle-header" @click="isAllergyOpen = !isAllergyOpen">
            <label class="section-label allergy-label">
              보유 중인 알러지
              <span class="sub-text">(해당 성분 선택)</span>
            </label>
            <span class="toggle-icon" :class="{ rotated: isAllergyOpen }"
              >▼</span
            >
          </div>

          <div class="toggle-content" :class="{ open: isAllergyOpen }">
            <div class="category-grid">
              <label
                v-for="allergy in allergiesOptions"
                :key="allergy.id"
                class="cat-item"
              >
                <input
                  type="checkbox"
                  :value="allergy.id"
                  v-model="signupData.allergies"
                  class="hidden-checkbox"
                />
                <div class="cat-chip allergy-chip">{{ allergy.name }}</div>
              </label>
            </div>
          </div>
        </div>

        <button type="submit" class="signup-action-btn">가입 완료</button>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* 1. 전체 페이지 배경 및 레이아웃 */
.signup-page {
  background-color: #f8f9fa;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
}

/* 2. 회원가입 카드 박스 */
.signup-card {
  max-width: 600px;
  width: 100%;
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  border: 1px solid #eee;
}

.signup-title {
  font-size: 1.8rem;
  font-weight: 800;
  margin-bottom: 8px;
  text-align: center;
  color: #212529;
}

.signup-subtitle {
  font-size: 0.9rem;
  color: #868e96;
  text-align: center;
  margin-bottom: 30px;
}

/* 3. 폼 그리드 시스템 */
.signup-grid-form {
  display: grid;
  grid-template-columns: 1fr 1fr; /* 2열 배치 */
  gap: 20px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field.full {
  grid-column: span 2; /* 아이디, 비번 등은 한 줄을 꽉 채움 */
}

/* 4. 라벨 및 입력창 스타일 */
.field label {
  font-weight: 700;
  font-size: 0.9rem;
  color: #495057;
  margin-left: 2px;
}

.field input {
  padding: 12px 16px;
  border: 1px solid #dee2e6;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.2s;
  background-color: #fdfdfd;
}

.field input:focus {
  outline: none;
  border-color: #1c7ed6;
  box-shadow: 0 0 0 4px rgba(28, 126, 214, 0.1);
}

/* 5. 성별 선택 버튼 그룹 */
.gender-btns {
  display: flex;
  gap: 10px;
}

.gender-btns button {
  flex: 1;
  padding: 12px;
  border: 1px solid #dee2e6;
  border-radius: 10px;
  background-color: white;
  color: #495057;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.gender-btns button.active-male {
  background-color: #9275e7f1;
  color: white;
  border-color: #9275e7f1;
  box-shadow: 0 4px 12px rgba(112, 72, 232, 0.2);
}

.gender-btns button.active-female {
  background-color: #f06595;
  color: white;
  border-color: #f06595;
  box-shadow: 0 4px 12px rgba(240, 101, 149, 0.2);
}

/* 토글 섹션 스타일 */
.toggle-section {
  border: 1px solid #edf2f7;
  border-radius: 12px;
  background-color: #ffffff;
  overflow: hidden;
  transition: all 0.3s ease;
}

.toggle-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  cursor: pointer;
  background-color: #fdfdfd;
  user-select: none;
}

.toggle-header:hover {
  background-color: #f8f9fa;
}

.toggle-icon {
  font-size: 0.8rem;
  color: #adb5bd;
  transition: transform 0.3s ease;
}

.toggle-icon.rotated {
  transform: rotate(180deg);
  color: #1c7ed6;
}

/* 토글 내용 애니메이션 */
.toggle-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease-out, padding 0.3s ease;
  padding: 0 20px; /* 닫혔을 때는 패딩 0 */
}

.toggle-content.open {
  max-height: 1000px; /* 넉넉하게 설정 */
  padding: 10px 20px 20px 20px; /* 열렸을 때 여백 확보 */
  border-top: 1px solid #f1f3f5;
}

/* 6. 카테고리 칩(Chip) 스타일 (핵심 수정 부분) */
.category-grid {
  display: grid;
  /* PC에서는 칩 크기에 맞춰 유연하게 배치 */
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 10px;
}

.cat-item {
  cursor: pointer;
}

/* 실제 체크박스는 숨김 */
.hidden-checkbox {
  display: none;
}

/* 보여지는 캡슐 디자인 */
.cat-chip {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 15px;
  border: 1px solid #e9ecef;
  border-radius: 50px;
  background-color: #f8f9fa;
  color: #495057;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.2s ease;
  user-select: none;
}

.cat-chip:hover {
  background-color: #e9ecef;
}

/* ✅ 체크되었을 때 스타일 */
.hidden-checkbox:checked + .cat-chip {
  background-color: #1c7ed6;
  border-color: #1c7ed6;
  color: white;
  box-shadow: 0 4px 12px rgba(28, 126, 214, 0.2);
}

/* 7. 하단 가입 버튼 */
.signup-action-btn {
  grid-column: span 2;
  margin-top: 20px;
  padding: 16px;
  background-color: #212529;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.2s;
}

.signup-action-btn:hover {
  background-color: #000;
}

/* 8. 반응형 처리 (모바일용) */
@media (max-width: 768px) {
  .signup-page {
    padding: 20px 10px; /* 페이지 외곽 여백 축소 */
  }

  .signup-card {
    padding: 25px 20px; /* 카드 내부 패딩 대폭 축소 (핵심!) */
    border-radius: 15px;
  }

  .signup-title {
    font-size: 1.5rem;
  }

  .signup-grid-form {
    grid-template-columns: 1fr; /* 무조건 1열로 배치 */
    gap: 15px;
  }

  .field.full {
    grid-column: span 1;
  }

  /* 성별 버튼 높이 조정 */
  .gender-btns button {
    padding: 10px;
    font-size: 0.9rem;
  }

  .toggle-header {
    padding: 12px 15px;
  }

  /* 건강 분야 & 알러지 칩 그리드 조정 */
  .category-grid {
    grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
    gap: 8px;
  }

  .cat-chip {
    padding: 8px 5px;
    font-size: 0.8rem;
    height: 40px; /* 높이 통일 */
  }

  .signup-action-btn {
    grid-column: span 1;
    padding: 14px;
    font-size: 1rem;
  }
}

/* 아주 작은 화면 (320px 이하) 대응 */
@media (max-width: 320px) {
  .signup-card {
    padding: 20px 15px;
  }
  .category-grid {
    grid-template-columns: 1fr 1fr; /* 무조건 2열 배치 */
  }
}

/* 알러지 선택  */
.allergy-label {
  color: #e11d48; /* Red/Rose 계열 */
}

.cat-chip.allergy-chip {
  border-color: #fff1f2;
}

/* 알러지 체크박스 체크 시 스타일 */
.hidden-checkbox:checked + .cat-chip.allergy-chip {
  background-color: #e11d48; /* 가입 버튼과 차별화되는 경고 레드 */
  border-color: #e11d48;
  color: white;
  box-shadow: 0 4px 12px rgba(225, 29, 72, 0.2);
}

.mt-3 {
  margin-top: 24px;
}
</style>
