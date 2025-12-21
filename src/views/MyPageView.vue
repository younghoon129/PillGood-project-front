<template>
  <div class="mypage-wrapper">
    <div class="profile-card">
      <div class="card-header">
        <h2>마이페이지</h2>
        <p class="subtitle">
          회원님의 정보를 관리하고 관심 건강 분야 및 알러지를 설정하세요.
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
          <br />

          <div class="cabinet-section">
            <div class="cabinet-header">
              <h3>📦 나의 영양제함</h3>
              <button @click="showModal = true" class="add-manual-btn">
                + 직접 등록
              </button>
            </div>

            <Transition name="modal">
              <div
                v-if="showModal"
                class="modal-overlay"
                @click.self="showModal = false"
              >
                <div class="modal-card">
                  <div class="modal-header">
                    <h4>✨ 영양제 직접 등록</h4>
                    <button class="close-btn" @click="showModal = false">
                      &times;
                    </button>
                  </div>

                  <div class="modal-body">
                    <div class="input-group">
                      <label>제품명 <span class="required">*</span></label>
                      <input
                        v-model="newCustomPill.name"
                        placeholder="예: 해외직구 오메가3"
                      />
                    </div>

                    <div class="input-group">
                      <label>제조사/브랜드</label>
                      <input
                        v-model="newCustomPill.brand"
                        placeholder="예: 스포츠리서치"
                      />
                    </div>

                    <div class="input-group">
                      <label>주요 성분 선택 (중복 분석용)</label>

                      <div class="selected-tags">
                        <span
                          v-for="(ing, idx) in selectedIngredients"
                          :key="idx"
                          class="ing-tag"
                        >
                          {{ ing }}
                          <i class="bi bi-x" @click="removeIngredient(idx)"></i>
                        </span>
                      </div>

                      <div class="search-wrap">
                        <input
                          v-model="ingredientSearch"
                          placeholder="성분명 검색 (예: 비타민C)"
                        />
                        <ul
                          v-if="filteredIngredients.length"
                          class="autocomplete-list"
                        >
                          <li
                            v-for="name in filteredIngredients"
                            :key="name"
                            @click="addIngredient(name)"
                          >
                            {{ name }}
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div class="input-group">
                      <label>복용 메모</label>
                      <textarea
                        v-model="newCustomPill.memo"
                        placeholder="예: 아침 식사 직후 1알 복용"
                        rows="3"
                      ></textarea>
                    </div>
                  </div>

                  <div class="modal-footer">
                    <button class="btn-cancel" @click="showModal = false">
                      취소
                    </button>
                    <button class="btn-submit" @click="handleCustomRegister">
                      등록하기
                    </button>
                  </div>
                </div>
              </div>
            </Transition>

            <div v-if="allPills && allPills.length > 0" class="pill-grid">
              <div
                v-for="item in allPills"
                :key="item.type + item.id"
                class="pill-card"
                @click="item.type === 'db' ? goToDetail(item.pill_id) : null"
              >
                <img :src="item.img || defaultImg" class="mini-pill-img" />

                <div class="pill-info">
                  <p class="name">
                    <span v-if="item.type === 'custom'" class="badge-custom"
                      >개인</span
                    >
                    {{ item.name }}
                  </p>
                  <button @click.stop="removePill(item)" class="remove-btn">
                    <i class="bi bi-trash"></i> 삭제
                  </button>
                </div>
              </div>
            </div>

            <p v-else class="empty-msg">현재 섭취 중인 영양제가 없습니다.</p>
          </div>

          <br />

          <div class="category-section mb-3">
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
            <div v-else class="empty-tag">설정된 관심 카테고리가 없습니다.</div>
          </div>
          <br />

          <div class="category-section allergy-section">
            <span class="label">나의 알러지 정보</span>
            <div
              class="tag-container"
              v-if="profileData.allergies_names?.length"
            >
              <span
                v-for="name in profileData.allergies_names"
                :key="name"
                class="allergy-tag"
              >
                <i class="bi bi-exclamation-circle-fill me-1"></i> # {{ name }}
              </span>
            </div>
            <div v-else class="empty-tag">등록된 알러지 정보가 없습니다.</div>
          </div>
        </div>

        <button @click="enterEditMode" class="main-btn edit-btn">
          프로필 수정하기
        </button>

        <div class="withdrawal-area">
          <button class="btn-text-danger" @click="moveToDeletePage">
            회원 탈퇴
          </button>
        </div>
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

          <div
            v-if="profileData.provider === 'local'"
            class="password-edit-area"
          >
            <button
              type="button"
              @click="showPwFields = !showPwFields"
              class="pw-toggle-btn"
            >
              {{ showPwFields ? "비밀번호 변경 취소" : "비밀번호 변경하기" }}
            </button>

            <div v-if="showPwFields" class="pw-inputs mt-3">
              <div class="input-group">
                <label>현재 비밀번호</label>
                <input
                  v-model="pwData.current_password"
                  type="password"
                  placeholder="현재 비밀번호 입력"
                />
              </div>
              <div class="input-group">
                <label>새 비밀번호</label>
                <input
                  v-model="pwData.new_password"
                  type="password"
                  placeholder="새 비밀번호 입력"
                />
              </div>
              <div class="input-group">
                <label>새 비밀번호 확인</label>
                <input
                  v-model="pwData.confirm_password"
                  type="password"
                  placeholder="새 비밀번호 다시 입력"
                />
              </div>
            </div>
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
          <label class="label">관심 카테고리 수정</label>
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

        <div class="category-edit-box allergy-edit-box mt-3">
          <label class="label">알러지 정보 수정 (해당 성분 선택)</label>
          <div class="checkbox-group">
            <label
              v-for="allergy in allAllergyOptions"
              :key="allergy.id"
              :class="[
                'checkbox-item allergy-item',
                { active: editedData.allergies?.includes(allergy.id) },
              ]"
            >
              <input
                type="checkbox"
                :value="allergy.id"
                v-model="editedData.allergies"
              />
              {{ allergy.name }}
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
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import CalendarRegisterForm from "@/components/CalendarRegisterForm.vue";
import defaultImg from "@/assets/pill.jpg";

const router = useRouter();
const authStore = useAuthStore();

const profileData = ref(null);
const isEditMode = ref(false);
const editedData = ref({ interested_genres: [], allergies: [] });

// 비밀번호 변경 관련 상태
const showPwFields = ref(false);
const pwData = ref({
  current_password: "",
  new_password: "",
  confirm_password: "",
});

const allCategoryOptions = ref([]);
const allAllergyOptions = ref([]); // 🚩 알러지 전체 목록을 위한 ref

const myPills = ref([]);
const myCustomPills = ref([]);

const allIngredients = ref([]); // 서버에서 받은 전체 성분 리스트
const ingredientSearch = ref(""); // 사용자 검색어
const selectedIngredients = ref([]); // 현재 선택된 성분들(배열)

// 1. 성분 리스트 불러오기
const fetchIngredients = async () => {
  const res = await axios.get("http://localhost:8000/pills/all-ingredients/");
  allIngredients.value = res.data;
};

// 2. 검색어에 따른 자동완성 필터링 (최대 10개 표시)
const filteredIngredients = computed(() => {
  const query = ingredientSearch.value.trim();
  if (!query) return [];
  return allIngredients.value
    .filter((name) => name.includes(query))
    .filter((name) => !selectedIngredients.value.includes(name)) // 이미 선택한 건 제외
    .slice(0, 10);
});

// 3. 성분 추가/삭제 함수
const addIngredient = (name) => {
  selectedIngredients.value.push(name);
  ingredientSearch.value = ""; // 입력창 비우기
};
const removeIngredient = (idx) => selectedIngredients.value.splice(idx, 1);

const fetchCustomPills = async () => {
  try {
    const response = await axios.get(
      "http://localhost:8000/pills/custom-pills/",
      config
    );
    myCustomPills.value = response.data;
  } catch (err) {
    console.error("커스텀 영양제 로드 실패:", err);
  }
};

const allPills = computed(() => {
  // 1. 일반 영양제 데이터 가공
  const dbList = myPills.value.map((item) => ({
    id: item.id, // UserPill 모델의 PK (삭제 시 필요할 수 있음)
    pill_id: item.pill?.id, // 🚩 실제 영양제 상세페이지로 갈 때 쓰는 ID
    name: item.pill?.PRDLST_NM || "이름 정보 없음",
    img: item.pill?.cover || defaultImg,
    type: "db",
    created_at: item.created_at,
  }));

  // 2. 커스텀 영양제 데이터 가공
  const customList = myCustomPills.value.map((item) => ({
    id: item.id,
    pill_id: null, // 커스텀은 상세페이지가 없음
    name: item.name,
    img: defaultImg,
    type: "custom",
    created_at: item.created_at,
  }));

  return [...dbList, ...customList].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );
});

const showModal = ref(false);
const newCustomPill = ref({ name: "", brand: "", memo: "" });

const refreshAllPills = async () => {
  try {
    // 두 API 호출을 동시에 실행하고 모두 완료될 때까지 기다립니다.
    await Promise.all([fetchMyPills(), fetchCustomPills()]);
    console.log("모든 영양제 리스트가 갱신되었습니다. ✨");
  } catch (err) {
    console.error("리스트 갱신 중 오류 발생:", err);
  }
};

const handleCustomRegister = async () => {
  // 1. 유효성 검사 (가장 먼저 수행)
  if (!newCustomPill.value.name) {
    alert("영양제 이름을 입력해주세요! 💊");
    return;
  }

  try {
    // 2. 데이터 가공 (선택된 성분 배열을 쉼표 문자열로 변환)
    const payload = {
      ...newCustomPill.value,
      ingredients: selectedIngredients.value.join(", "),
    };

    // 3. 서버 전송
    await axios.post(
      "http://localhost:8000/pills/custom-pills/",
      payload,
      config
    );

    // 4. 성공 처리
    alert("나의 영양제함에 등록되었습니다! ✨");
    showModal.value = false;

    // 5. 데이터 초기화 (입력창 + 선택된 성분 태그들)
    newCustomPill.value = { name: "", brand: "", memo: "" };
    selectedIngredients.value = []; // 🚩 성분 태그 초기화 추가
    ingredientSearch.value = "";

    // 6. 리스트 최신화
    await refreshAllPills();
  } catch (err) {
    console.error("등록 실패:", err);
    alert("등록 중 오류가 발생했습니다.");
  }
};

const removePill = async (item) => {
  if (!confirm(`[${item.name}] 영양제를 삭제하시겠습니까?`)) return;

  try {
    const url =
      item.type === "custom"
        ? `http://localhost:8000/pills/custom-pills/${item.id}/`
        : `http://localhost:8000/pills/${item.pill_id}/toggle/`;

    await axios.delete(url, config);

    await refreshAllPills();

    alert("영양제함에서 삭제되었습니다.");
  } catch (err) {
    console.error("삭제 실패:", err);
    alert("삭제 중 오류가 발생했습니다.");
  }
};

const fetchMyPills = async () => {
  try {
    const response = await axios.get(
      "http://localhost:8000/pills/my-pills/",
      config
    );
    myPills.value = response.data; // 서버에서 받아온 리스트 저장
  } catch (err) {
    console.error(err);
  }
};

const goToDetail = (pillId) => {
  // 영양제 상세 페이지의 라우터 경로가 '/pills/:pill_pk'라고 가정합니다.
  // name을 사용하신다면 router.push({ name: 'PillDetail', params: { pill_pk: pillId } })
  router.push(`/pills/${pillId}`);
};

const config = {
  headers: { Authorization: `Token ${authStore.token}` },
};

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

// 1. 전체 카테고리 로드
const fetchAllCategories = async () => {
  try {
    const response = await axios.get("http://localhost:8000/pills/categories/");
    allCategoryOptions.value = response.data;
  } catch (err) {
    console.error(err);
  }
};

// 🚩 2. 전체 알러지 목록 로드 (새로 만든 API 호출)
const fetchAllAllergies = async () => {
  try {
    const response = await axios.get(
      "http://localhost:8000/accounts/allergies/"
    );
    allAllergyOptions.value = response.data;
  } catch (err) {
    console.error("알러지 로드 실패:", err);
  }
};

// 3. 프로필 정보 로드
const fetchProfile = async () => {
  try {
    const response = await axios.get(
      "http://localhost:8000/accounts/profile/",
      config
    );
    profileData.value = response.data;
  } catch (err) {
    console.error(err);
  }
};

onMounted(() => {
  fetchProfile();
  fetchAllCategories();
  fetchAllAllergies();
  fetchMyPills();
  fetchCustomPills();
  fetchIngredients();
});

const enterEditMode = () => {
  editedData.value = {
    ...profileData.value,
    interested_genres: profileData.value.interested_genres
      ? [...profileData.value.interested_genres]
      : [],
    allergies: profileData.value.allergies
      ? [...profileData.value.allergies]
      : [],
  };

  // 🚩 비밀번호 필드 초기화
  showPwFields.value = false;
  pwData.value = {
    current_password: "",
    new_password: "",
    confirm_password: "",
  };

  isEditMode.value = true;

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

const updateProfile = async () => {
  try {
    // 1. 비밀번호 변경 시도 (비밀번호 변경이 활성화된 경우)
    if (showPwFields.value) {
      if (!pwData.value.current_password || !pwData.value.new_password) {
        alert("비밀번호 필드를 모두 입력해주세요.");
        return;
      }
      if (pwData.value.new_password !== pwData.value.confirm_password) {
        alert("새 비밀번호 확인이 일치하지 않습니다.");
        return;
      }

      await axios.post(
        "http://localhost:8000/accounts/change-password/",
        {
          current_password: pwData.value.current_password,
          new_password: pwData.value.new_password,
        },
        config
      );
    }

    // 2. 기존 프로필 정보 수정 (닉네임, 나이 등)
    const response = await axios.put(
      "http://localhost:8000/accounts/profile/",
      editedData.value,
      config
    );

    profileData.value = response.data.data || response.data;
    authStore.nickname = profileData.value.nickname;
    localStorage.setItem("nickname", profileData.value.nickname);

    isEditMode.value = false;
    alert("정보가 성공적으로 수정되었습니다! ✨");
    fetchProfile();
  } catch (err) {
    // 백엔드에서 보낸 에러 메시지가 있으면 출력
    const errorMsg = err.response?.data?.error || "수정에 실패했습니다.";
    alert(errorMsg);
  }
};

const moveToDeletePage = () => {
  router.push({ name: "user_delete" });
};
</script>

<style scoped>
/* --- 기존 CSS 유지 및 알러지 스타일 추가 --- */

.allergy-tag {
  background: rgb(243, 91, 91);
  color: black;
  padding: 6px 14px;
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 600;
  border: 1px solid #d1fae5;
}

.empty-tag {
  font-size: 0.85rem;
  color: #94a3b8;
  margin-top: 10px;
}

/* 알러지 수정 칩 스타일 (수정 모드) */
.allergy-edit-box {
  border-top: 1px dashed #e2e8f0;
  padding-top: 20px;
}

.checkbox-item.allergy-item.active {
  background: #f43f5e; /* Rose 500 */
  color: white;
  border-color: #f43f5e;
  box-shadow: 0 4px 10px rgba(244, 63, 94, 0.2);
}

/* --- 공통 스타일 (기존 코드와 동일) --- */
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
.provider-badge.local {
  background-color: #f1f5f9;
  color: #64748b;
}
.provider-badge.kakao {
  background-color: #fee500;
  color: #3c1e1e;
}
.provider-badge.naver {
  background-color: #03c75a;
  color: #ffffff;
}
.provider-badge.google {
  background-color: white;
  color: black;
  border: 1px solid #e2e8f0;
}

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
  background: #518dee;
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
  margin-top: 20px;
}
.button-group {
  display: flex;
  gap: 10px;
}

.withdrawal-area {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #f1f3f5;
  text-align: center;
}
.btn-text-danger {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font-family: inherit;
  font-size: 0.9rem;
  color: #adb5bd;
  font-weight: 600;
  transition: all 0.3s ease;
  text-decoration: none;
}
.btn-text-danger:hover {
  color: #e11d48;
  text-decoration: underline;
  text-underline-offset: 4px;
}

/* 사용자 영양제함 스타일 */
.cabinet-section {
  padding: 25px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
}

.cabinet-section h3 {
  margin-top: 0;
}

.pill-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.pill-card {
  background: white;
  border: 1px solid #f1f5f9;
  border-radius: 16px;
  padding: 15px;
  text-align: center;
  transition: transform 0.2s;
}

.pill-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  opacity: 0.8;
}

.mini-pill-img {
  width: 100%;
  height: 100px;
  object-fit: contain;
  margin-bottom: 10px;
}

.pill-info .name {
  font-size: 0.9rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  /* 두 줄 이상이면 생략 처리(...) */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.remove-btn {
  margin-top: 12px;
  width: 100%;
  padding: 6px 0;
  font-size: 0.8rem;
  font-weight: 600;
  color: #ef4444;
  background: #fff1f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.remove-btn:hover {
  background: #ef4444;
  color: white;
  border-color: #ef4444;
}

/* 모달 기본 스타일 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal-content {
  background: white;
  padding: 30px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 350px;
}

/* 모달 애니메이션 (Vue Transition) */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

/* 오버레이: 배경 흐림 효과 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(15, 23, 42, 0.6); /* 진한 네이비톤 반투명 */
  backdrop-filter: blur(8px); /* 글래스모피즘 핵심 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

/* 모달 카드 */
.modal-card {
  background: white;
  width: 90%;
  max-width: 450px;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

/* 헤더 */
.modal-header {
  padding: 24px 24px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.modal-header h4 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 800;
  color: #1e293b;
}
.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #94a3b8;
  cursor: pointer;
}

/* 바디 & 입력창 */
.modal-body {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.input-group label {
  font-size: 0.85rem;
  font-weight: 700;
  color: #475569;
}
.required {
  color: #ef4444;
}

.input-group input,
.input-group textarea {
  padding: 12px 16px;
  border: 2px solid #f1f5f9;
  border-radius: 12px;
  font-size: 0.95rem;
  transition: all 0.2s;
}
.input-group input:focus,
.input-group textarea:focus {
  outline: none;
  border-color: #42b983; /* 포인트 컬러 */
  background: #f0fdf4;
}

/* 푸터 버튼 */
.modal-footer {
  padding: 16px 24px 24px;
  display: flex;
  gap: 12px;
}
.btn-cancel,
.btn-submit {
  flex: 1;
  padding: 14px;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s;
}
.btn-cancel {
  background: #f1f5f9;
  color: #64748b;
  border: none;
}
.btn-cancel:hover {
  background: #e2e8f0;
}

.btn-submit {
  background: #42b983;
  color: white;
  border: none;
}
.btn-submit:hover {
  background: #38a169;
  box-shadow: 0 4px 12px rgba(66, 185, 131, 0.3);
}

/* 1. 나의 영양제함 헤더 레이아웃 */
.cabinet-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

/* 2. 직접 등록 버튼 스타일 */
.add-manual-btn {
  background-color: #f8fafc;
  border: 1px dashed #cbd5e1; /* 점선 테두리로 '추가' 느낌 강조 */
  color: #475569;
  padding: 8px 16px;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 4px;
}

.add-manual-btn:hover {
  background-color: #f1f5f9;
  border-color: #94a3b8;
  color: #1e293b;
  transform: translateY(-2px); /* 살짝 떠오르는 효과 */
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

/* 3. 직접 등록 뱃지 스타일 */
.badge-custom {
  display: inline-block;
  background-color: #64748b; /* 차분한 슬레이트 블루 톤 */
  color: white;
  font-size: 0.65rem;
  font-weight: 800;
  padding: 2px 6px;
  border-radius: 4px;
  margin-right: 6px;
  vertical-align: middle;
  line-height: 1.4;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

/* 4. 커스텀 영양제 카드 변주 (선택 사항) */
/* 직접 등록한 카드임을 더 강조하고 싶다면 사용하세요 */
.pill-card {
  position: relative;
  overflow: hidden;
}

/* 5. 텍스트 줄바꿈 및 정렬 보정 */
.pill-info .name {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap; /* 뱃지와 이름이 자연스럽게 섞이도록 */
  gap: 4px;
}

/* 성분 선택 관련 스타일 */
.selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 10px;
}

.ing-tag {
  background: #f0fdf4; /* 연한 초록색 배경 */
  color: #16a34a;
  border: 1px solid #bbf7d0;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 4px;
}

.ing-tag i {
  cursor: pointer;
  font-size: 1rem;
}

.search-wrap {
  position: relative;
}

.autocomplete-list {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  z-index: 50; /* 모달 내부에서 가장 위에 뜨도록 */
  list-style: none;
  padding: 5px 0;
  margin-top: 5px;
  max-height: 150px;
  overflow-y: auto;
}

.autocomplete-list li {
  padding: 10px 15px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.2s;
}

.autocomplete-list li:hover {
  background: #f8fafc;
  color: #42b983;
}
/* 1. 비밀번호 변경 전체 컨테이너 */
.password-edit-area {
  margin-top: 20px;
  /* padding: 12px; */
  /* background: #fcfdfe; */
  /* border: 1px solid #e2e8f0; */
  border-radius: 20px;
  transition: all 0.3s ease;
  grid-column: span 2;
}

/* 2. 비밀번호 변경 토글 버튼 */
.pw-toggle-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 12px;
  background-color: #ffffff;
  color: #6366f1;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
  grid-column: span 2;
}

.pw-toggle-btn:hover {
  background-color: #f8faff;
  border-color: #6366f1;
  transform: translateY(-1px);
}

/* 3. 비밀번호 입력 영역 (내부 레이아웃) */
.pw-inputs {
  display: flex;
  flex-direction: column;
  gap: 16px;
  animation: slideDown 0.3s ease-out;
}

/* 4. 입력창 스타일 보정 */
.pw-inputs .input-group label {
  font-size: 0.85rem;
  color: #475569;
  font-weight: 700;
  margin-bottom: 6px;
}

.pw-inputs .input-group input {
  padding: 12px 16px;
  border: 2px solid #f1f5f9;
  border-radius: 12px;
  background: #ffffff;
  transition: all 0.2s;
}

.pw-inputs .input-group input:focus {
  border-color: #6366f1;
  background: #ffffff;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
  outline: none;
}

/* 애니메이션 효과 */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 여백 조절 */
.mt-3 {
  margin-top: 15px;
}
</style>
