<template>
  <div class="mypage-wrapper">
    <div class="profile-card">
      <div class="card-header">
        <h2>마이페이지</h2>
        <p class="subtitle">
          회원님의 정보를 관리하고 관심 건강 분야를 설정하세요.
        </p>
      </div>

      <div v-if="!isEditMode">
        <div v-if="profileData" class="info-container">
          <div class="profile-summary">
            <div class="avatar-placeholder">
              {{ profileData.nickname?.[0] }}
            </div>
            <div class="summary-text">
              <div class="nickname-wrapper">
                <h3>{{ profileData.nickname }}</h3>
                <span :class="['provider-badge', profileData.provider]">
                  {{ providerLabel }}
                </span>
              </div>
              <span>{{ profileData.email || "이메일 미등록" }}</span>
            </div>
          </div>

          <div class="info-grid">
            <div class="info-box">
              <span class="label">계정 유형</span>
              <span class="value">{{ loginType }}</span>
            </div>
            <div class="info-box">
              <span class="label">성별</span>
              <span class="value">{{
                profileData.gender === "M" ? "남성" : "여성"
              }}</span>
            </div>
            <div class="info-box">
              <span class="label">나이</span>
              <span class="value">{{ profileData.age }}세</span>
            </div>
            <div class="info-box">
              <span class="label">사용자 ID</span>
              <span class="value">@{{ profileData.username }}</span>
            </div>
          </div>

          <CalendarRegisterForm />
          <hr />
          <div class="category-section">
            <span class="label">나의 관심 건강 카테고리</span>
            <div
              class="tag-container"
              v-if="profileData.interested_genres_names?.length"
            >
              <span
                v-for="name in profileData.interested_genres_names"
                :key="name"
                class="category-tag"
              >
                # {{ name }}
              </span>
            </div>
            <div v-else class="empty-tag">
              설정된 관심 카테고리가 없습니다. 수정에서 추가해 보세요!
            </div>
          </div>
        </div>
        <button @click="enterEditMode" class="main-btn edit-btn">
          프로필 수정하기
        </button>
      </div>

      <div v-else class="edit-form">
        <h3 class="edit-title">정보 수정</h3>
        <div class="edit-grid">
          <div class="input-group">
            <label>닉네임</label>
            <input v-model="editedData.nickname" type="text" />
          </div>
          <div class="input-group">
            <label>나이</label>
            <input v-model.number="editedData.age" type="number" />
          </div>
          <div class="input-group full-width">
            <label>이메일 주소</label>
            <input
              v-model="editedData.email"
              type="email"
              placeholder="example@email.com"
            />
          </div>
          <div class="input-group full-width">
            <label>성별</label>
            <select v-model="editedData.gender">
              <option value="M">남성</option>
              <option value="F">여성</option>
            </select>
          </div>
        </div>

        <div class="category-edit-box">
          <label class="label">관심 카테고리 수정 (중복 선택 가능)</label>
          <div class="checkbox-group">
            <label
              v-for="option in allCategoryOptions"
              :key="option.id"
              :class="[
                'checkbox-item',
                { active: editedData.interested_genres?.includes(option.id) },
              ]"
            >
              <input
                type="checkbox"
                :value="option.id"
                v-model="editedData.interested_genres"
              />
              {{ option.name }}
            </label>
          </div>
        </div>

        <div class="button-group">
          <button @click="updateProfile" class="main-btn save-btn">
            변경사항 저장
          </button>
          <button @click="isEditMode = false" class="main-btn cancel-btn">
            취소
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import { useAuthStore } from "@/stores/auth";
import CalendarRegisterForm from "@/components/CalendarRegisterForm.vue";

const authStore = useAuthStore();
const profileData = ref(null);
const allCategoryOptions = ref([]);
const isEditMode = ref(false);
const editedData = ref({ interested_genres: [] });
const providerLabel = computed(() => {
  const providers = {
    kakao: "카카오 로그인",
    naver: "네이버 로그인",
    google: "구글 로그인",
    local: "자체 회원",
  };
  return providers[profileData.value?.provider] || "일반 회원";
});

const loginType = computed(() => {
  if (profileData.value?.username?.startsWith("kakao_")) return "카카오 로그인";
  if (profileData.value?.username?.startsWith("naver_")) return "네이버 로그인";
  if (profileData.value?.username?.startsWith("google_")) return "구글 로그인";
  return "일반 로그인";
});

const config = {
  headers: { Authorization: `Token ${authStore.token}` },
};

// 1. 전체 카테고리 목록 로드 (pills 앱의 API 호출)
const fetchAllCategories = async () => {
  try {
    const response = await axios.get("http://localhost:8000/pills/categories/");
    allCategoryOptions.value = response.data;
  } catch (err) {
    console.error("카테고리 로드 실패:", err);
  }
};

// 2. 프로필 정보 로드
const fetchProfile = async () => {
  try {
    const response = await axios.get(
      "http://localhost:8000/accounts/profile/",
      config
    );
    profileData.value = response.data;
  } catch (err) {
    console.error("프로필 로드 실패:", err);
  }
};

onMounted(() => {
  fetchProfile();
  fetchAllCategories();
});

const enterEditMode = () => {
  editedData.value = {
    ...profileData.value,
    interested_genres: profileData.value.interested_genres
      ? [...profileData.value.interested_genres]
      : [],
  };
  isEditMode.value = true;
};

const updateProfile = async () => {
  try {
    const response = await axios.put(
      "http://localhost:8000/accounts/profile/",
      editedData.value,
      config
    );

    // 서버 응답 구조에 따라 데이터 갱신 (serializer.data 또는 response.data)
    profileData.value = response.data.data || response.data;
    authStore.nickname = profileData.value.nickname;
    localStorage.setItem("nickname", profileData.value.nickname);

    isEditMode.value = false;
    alert("정보가 성공적으로 수정되었습니다! ✨");
    fetchProfile(); // 최신 정보 다시 가져오기
  } catch (err) {
    console.error(err);
    alert("수정에 실패했습니다.");
  }
};
</script>

<style scoped>
.mypage-wrapper {
  padding: 60px 20px;
  background-color: #f8fafc;
  min-height: 100vh;
  display: flex;
  justify-content: center;
}
.profile-card {
  width: 100%;
  max-width: 800px;
  background: white;
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
}

.nickname-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}

.provider-badge {
  font-size: 0.75rem;
  padding: 4px 10px;
  border-radius: 50px;
  font-weight: 600;
}

/* 자체 회원 배지 */
.provider-badge.local {
  background-color: #f1f5f9;
  color: #64748b;
}

/* 카카오 배지 (노란색 계열) */
.provider-badge.kakao {
  background-color: #fee500;
  color: #3c1e1e;
}

/* 네이버 배지 (초록색 계열) */
.provider-badge.naver {
  background-color: #03c75a;
  color: #ffffff;
}

.provider-badge.google {
  background-color: white;
  color: black;
}

/* 헤더 및 섹션 스타일 */
.card-header {
  text-align: center;
  margin-bottom: 40px;
}
.card-header h2 {
  font-size: 2rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 8px;
}
.subtitle {
  color: #64748b;
}

.profile-summary {
  display: flex;
  align-items: center;
  padding: 25px;
  background: #f8fafc;
  border-radius: 20px;
  margin-bottom: 30px;
  border: 1px solid #e2e8f0;
}
.avatar-placeholder {
  width: 70px;
  height: 70px;
  background: #42b983;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  font-weight: bold;
  margin-right: 20px;
}
.summary-text h3 {
  margin: 0;
  font-size: 1.3rem;
}
.summary-text span {
  color: #94a3b8;
  font-size: 0.9rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}
.info-box {
  background: #ffffff;
  padding: 20px;
  border-radius: 16px;
  border: 1px solid #f1f5f9;
  display: flex;
  flex-direction: column;
}
.label {
  font-size: 0.8rem;
  color: #94a3b8;
  font-weight: 700;
  margin-bottom: 6px;
}
.value {
  font-size: 1.1rem;
  color: #1e293b;
  font-weight: 500;
}

/* 관심 카테고리 태그 */
.category-section {
  padding: 25px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
}
.tag-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}
.category-tag {
  background: #ecfdf5;
  color: #059669;
  padding: 6px 14px;
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 600;
  border: 1px solid #d1fae5;
}

/* 수정 모드 스타일 */
.edit-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 25px;
}
.input-group {
  display: flex;
  flex-direction: column;
}
.input-group.full-width {
  grid-column: span 2;
}
.input-group label {
  font-size: 0.9rem;
  margin-bottom: 6px;
  font-weight: 600;
  color: #475569;
}
.input-group input,
.input-group select {
  padding: 12px;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  font-size: 1rem;
}

/* 버튼형 체크박스 */
.category-edit-box {
  margin-top: 25px;
  padding: 20px;
  background: #f8fafc;
  border-radius: 16px;
}
.checkbox-group {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 10px;
  margin-top: 12px;
}
.checkbox-item {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  color: #64748b;
  transition: 0.2s;
}
.checkbox-item input {
  display: none;
}
.checkbox-item.active {
  background: #42b983;
  color: white;
  border-color: #42b983;
  box-shadow: 0 4px 10px rgba(66, 185, 131, 0.2);
}

.main-btn {
  width: 100%;
  padding: 16px;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s;
}
.edit-btn {
  background: #1e293b;
  color: white;
  margin-top: 20px;
}
.save-btn {
  background: #42b983;
  color: white;
  margin-top: 20px;
}
.cancel-btn {
  background: #f1f5f9;
  color: #64748b;
  margin-top: 10px;
}
.button-group {
  display: flex;
  gap: 10px;
}
</style>
