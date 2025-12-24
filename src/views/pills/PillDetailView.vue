<script setup>
import { onMounted, nextTick, ref, computed, watch } from "vue";
import { useRoute, RouterView } from "vue-router";
import { usePillStore } from "@/stores/pills";
import { useAuthStore } from "@/stores/auth";
import defaultImg from "@/assets/pill.jpg";
import axios from "@/api/http";

const route = useRoute();
const store = usePillStore();
const authStore = useAuthStore();

const reviewSection = ref(null);

const showReviews = ref(false);

const isEnrolled = ref(false); // 현재 영양제함에 있는지 여부

const myPills = ref([]); // 내 일반 영양제함 리스트
const myCustomPills = ref([]); // 내 커스텀 영양제함 리스트

//  영양제함에 들어있는지 확인 및 중복 체크
// 🚩 1. 내 모든 영양제 데이터 로드 (중복 분석용)
const fetchMyCabinet = async () => {
  if (!authStore.isLoggedIn) return;
  try {
    const config = { headers: { Authorization: `Token ${authStore.token}` } };
    const [res1, res2] = await Promise.all([
      axios.get("/pills/my-pills/", config),
      axios.get("/pills/custom-pills/", config),
    ]);
    myPills.value = res1.data;
    myCustomPills.value = res2.data;
  } catch (err) {
    console.error("함 데이터 로드 실패:", err);
  }
};

// 🚩 2. 중복 성분 분석 계산 로직
const duplicateNutrients = computed(() => {
  // 현재 보고 있는 영양제의 성분 정보가 없으면 빈 배열 반환
  if (!store.pill || !store.pill.nutrient_details) return [];

  // 현재 영양제의 성분 이름들 (예: ['비타민C', '아연'])
  const currentIngredients = store.pill.nutrient_details.map(
    (n) => n.substance_name
  );
  const duplicates = [];

  // A. 일반 영양제(DB)와 비교
  myPills.value.forEach((item) => {
    // 현재 보고 있는 제품 본인은 비교에서 제외
    if (item.pill.id === store.pill.id) return;

    item.pill.nutrient_details?.forEach((nut) => {
      if (currentIngredients.includes(nut.substance_name)) {
        duplicates.push({
          nutrient: nut.substance_name,
          pillName: item.pill.PRDLST_NM,
          type: "일반",
        });
      }
    });
  });

  // B. 직접 등록한 영양제(Custom)와 비교
  myCustomPills.value.forEach((item) => {
    if (!item.ingredients) return;

    // 저장된 "비타민C, 아연" 문자열을 배열로 변환
    const customIngs = item.ingredients.split(",").map((s) => s.trim());

    customIngs.forEach((ing) => {
      if (currentIngredients.includes(ing)) {
        duplicates.push({
          nutrient: ing,
          pillName: item.name,
          type: "개인",
        });
      }
    });
  });

  // 결과에서 중복으로 쌓인 데이터 정제 (선택사항: 같은 성분이 여러 제품에 있을 수 있음)
  return duplicates;
});

// 🚩 추가: 현재 영양제가 내 함에 있는지 확인하는 함수
const checkEnrollmentStatus = async () => {
  if (!authStore.isLoggedIn) return;

  try {
    const response = await axios.get(
      `/pills/${route.params.pill_pk}/is-enrolled/`,
      { headers: { Authorization: `Token ${authStore.token}` } }
    );
    // 서버에서 받은 결과(true/false)를 변수에 저장
    isEnrolled.value = response.data.is_enrolled;
  } catch (err) {
    console.error("상태 확인 실패:", err);
  }
};

watch(
  () => route.name,
  async (newName) => {
    if (newName === "thread_list") {
      // 라우트가 바뀌고 DOM이 렌더링될 때까지 잠깐 대기
      await nextTick();
      scrollToReviews();
    }
  }
);

const scrollToReviews = () => {
  // RouterView가 들어가는 위치나 후기 섹션으로 스크롤
  if (reviewSection.value) {
    reviewSection.value.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
};

const handleTogglePill = async () => {
  if (!authStore.isLoggedIn) {
    alert("로그인이 필요한 기능입니다.");
    return;
  }

  try {
    const method = isEnrolled.value ? "delete" : "post";
    const config = { headers: { Authorization: `Token ${authStore.token}` } };

    await axios({
      method: method,
      url: `/pills/${route.params.pill_pk}/toggle/`,
      ...config,
    });

    isEnrolled.value = !isEnrolled.value;
    alert(
      isEnrolled.value
        ? "영양제함에 담았습니다! 💊"
        : "영양제함에서 삭제했습니다."
    );
  } catch (err) {
    console.error(err);
  }
};

//  [추가] 알러지 경고 로직
const dangerAllergens = computed(() => {
  // 로그인하지 않았거나, 영양제 정보 또는 알러지 정보가 없으면 빈 배열 반환
  if (!authStore.isLoggedIn || !store.pill || !store.pill.allergens_info)
    return [];

  // 1. 사용자가 마이페이지에서 등록한 알러지 이름들 (예: ['우유', '대두'])
  const userAllergyNames = authStore.userInfo?.allergies_names || [];

  // 2. 현재 영양제에 포함된 알러지 유발 성분 이름들 (예: ['우유', '밀'])
  const pillAllergenNames = store.pill.allergens_info.map((a) => a.name);

  // 3. 두 목록에서 겹치는 성분만 필터링하여 반환
  return pillAllergenNames.filter((name) => userAllergyNames.includes(name));
});

const toggleReviews = async () => {
  showReviews.value = !showReviews.value;
  if (showReviews.value) {
    await nextTick();
    document
      .querySelector(".review-togglable-area")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

onMounted(async () => {
  const pillId = route.params.pill_pk;
  store.clearPillDetail();

  await store.getPillDetail(route.params.pill_pk);
  

  // 페이지 로드 시 , 영양제가 사용자 영양제함에 있는지 확인
  checkEnrollmentStatus();
  fetchMyCabinet();

  // 🚩 유저의 최신 알러지 정보를 가져오기 위해 프로필 요청 추가
  if (authStore.isLoggedIn) {
    try {
      const response = await axios.get(
        "/accounts/profile/",
        {
          headers: { Authorization: `Token ${authStore.token}` },
        }
      );
      // 가져온 데이터를 authStore에 업데이트 (authStore에 setUserInfo 같은 액션이 있다고 가정)
      authStore.userInfo = response.data;
    } catch (err) {
      console.error("유저 정보를 불러오지 못했습니다.", err);
    }
  }
  
});
</script>

<template>
  <div class="container">
    <div v-if="!store.pill" class="loading">
      <p>데이터를 불러오는 중입니다...</p>
    </div>

    <div v-else class="detail-wrap">
      <div v-if="dangerAllergens.length > 0" class="allergy-danger-banner">
        <div class="banner-content">
          <div class="warning-icon">
            <i class="bi bi-exclamation-triangle-fill">!</i>
          </div>
          <div class="warning-text">
            <h4>섭취 주의 알림</h4>
            <p>
              이 제품은 회원님이 등록하신
              <span class="danger-highlight"
                >[{{ dangerAllergens.join(", ") }}]</span
              >
              성분을 포함하고 있습니다.
            </p>
          </div>
        </div>
      </div>

      <div
        v-if="duplicateNutrients.length > 0"
        class="duplicate-warning-banner"
      >
        <div class="banner-content">
          <div class="warning-icon yellow">
            <i class="bi bi-exclamation-circle-fill">!</i>
          </div>
          <div class="warning-text">
            <h4>중복 섭취 주의</h4>
            <p>
              현재 섭취 중인 제품과 성분이 겹칩니다. 과다 섭취에 주의하세요!
            </p>

            <div class="duplicate-list">
              <div
                v-for="(item, idx) in duplicateNutrients"
                :key="idx"
                class="duplicate-item"
              >
                • <span class="dup-nut">{{ item.nutrient }}</span>
                <span class="dup-pill">({{ item.pillName }})</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section class="header-section">
        <div class="img-box">
          <img
            :src="store.pill.cover || defaultImg"
            :alt="store.pill.PRDLST_NM"
          />
        </div>

        <div class="info-box">
          <span class="company">{{ store.pill.BSSH_NM }}</span>
          <h1 class="title">{{ store.pill.PRDLST_NM }}</h1>

          <div class="badges">
            <span class="badge category">{{
              store.pill.category_name || "기타"
            }}</span>
          </div>

          <p class="summary">{{ store.pill.PRIMARY_FNCLTY }}</p>
          <div class="purchase-box">
            <div v-if="store.pill.price > 0" class="price-info">
              <span class="price-label">최저가 예측</span>
              <span class="price-value"
                >{{ Number(store.pill.price).toLocaleString() }}원</span
              >
            </div>

            <a
              v-if="store.pill.price > 0 && store.pill.purchase_url"
              :href="store.pill.purchase_url"
              target="_blank"
              class="buy-btn"
            >
              {{ store.pill.mall_name || "판매처" }}로 이동 🚀
            </a>

            <button
              v-else-if="store.pill.price === -1"
              class="buy-btn disabled"
              disabled
            >
              온라인 판매처를 찾을 수 없습니다 😢
            </button>

            <button v-else class="buy-btn disabled" disabled>
              가격 정보 분석 중...
            </button>
          </div>
        </div>
      </section>

      <hr class="divider" />

      <section class="content-section">
        <div class="info-item">
          <h3>💊 섭취 방법</h3>
          <p>{{ store.pill.NTK_MTHD || "정보 없음" }}</p>
        </div>

        <div class="info-item">
          <h3>⚠️ 섭취 시 주의사항</h3>
          <p class="multi-line">
            {{ store.pill.IFTKN_ATNT_MATR_CN || "정보 없음" }}
          </p>
        </div>

        <div class="info-item">
          <h3>📦 보관 방법</h3>
          <p>{{ store.pill.CSTDY_MTHD || "상온 보관" }}</p>
        </div>

        <div class="info-item">
          <h3>🧪 유통기한(소비기한)</h3>
          <p>{{ store.pill.POG_DAYCNT || "정보 없음" }}</p>
        </div>

        <div class="info-item">
          <h3>📊 영양 기능 정보</h3>

          <div
            v-if="
              store.pill.nutrient_details &&
              store.pill.nutrient_details.length > 0
            "
            class="nutrient-table-wrap"
          >
            <table class="nutrient-table">
              <thead>
                <tr>
                  <th>성분명</th>
                  <th>함량</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(nut, index) in store.pill.nutrient_details"
                  :key="index"
                >
                  <td>{{ nut.substance_name }}</td>
                  <td>{{ nut.value }} {{ nut.unit }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-else class="empty-text">해당 정보 없음</div>
        </div>

        <div class="info-item">
          <h3>⚠️ 알레르기 유발 물질</h3>

          <div
            v-if="
              store.pill.allergens_info && store.pill.allergens_info.length > 0
            "
            class="allergy-list"
          >
            <span
              v-for="(allergy, index) in store.pill.allergens_info"
              :key="index"
              class="badge allergy-badge"
            >
              {{ allergy.name }}
            </span>
          </div>

          <div v-else class="empty-text">해당 정보 없음</div>
        </div>

        <div class="info-item" ref="reviewSection">
          <h3>🌟 사용자 후기</h3>
          <div class="community-cta-container">
            <RouterLink
              :to="{ name: 'thread_list', params: { pill_pk: store.pill.id } }"
              class="community-cta-card"
            >
              <div class="cta-left">
                <div class="cta-icon-box">
                  <i class="bi bi-chat-dots-fill">P</i>
                </div>
                <div class="cta-info">
                  <span class="cta-label">복용 후기</span>
                  <span class="cta-desc"
                    >실제 복용자들의 진솔한 후기를 확인해보세요</span
                  >
                </div>
              </div>
              <div class="cta-right">
                <span class="cta-action-text">전체보기</span>
                <i class="bi bi-chevron-right"></i>
              </div>
            </RouterLink>
          </div>
        </div>

        <button
          @click="handleTogglePill"
          :class="['cabinet-btn', { 'is-taking': isEnrolled }]"
        >
          <i :class="isEnrolled ? 'bi bi-archive-fill' : 'bi bi-archive'"></i>
          {{ isEnrolled ? "섭취 중인 영양제" : "영양제함에 담기" }}
        </button>
      </section>

      <hr class="divider" />
            <RouterView :key="route.fullPath" />

      <div class="btn-area">
        <RouterLink
          :to="{ name: 'pills_index' }"
          class="back-btn"
          style="text-decoration: none; display: inline-block"
        >
          목록으로 돌아가기
        </RouterLink>
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
  border-radius: 8px; /* 모서리 둥글게 */
  overflow: hidden; /* 둥근 모서리 밖으로 내용 넘침 방지 */
}

/* 2. 테이블 기본 설정 */
.nutrient-table {
  width: 100%;
  border-collapse: collapse; /* 셀 사이 간격 없애기 */
  font-size: 0.95rem; /* 글자 크기 적당하게 */
}

/* 3. 제목(th)과 내용(td) 공통 여백 (★여백 핵심★) */
.nutrient-table th,
.nutrient-table td {
  padding: 12px 20px; /* 상하 12px, 좌우 20px (충분한 여백) */
  text-align: left; /* 왼쪽 정렬 */
  border-bottom: 1px solid #f1f3f5; /* 가로 줄 긋기 */
}

/* 4. 제목줄(th) 배경색 */
.nutrient-table th {
  background-color: #f8f9fa; /* 아주 연한 회색 배경 */
  color: #495057; /* 진한 회색 글씨 */
  font-weight: 600;
  width: 60%; /* 성분명 칸을 좀 더 넓게(60%) 잡음 */
}

/* 5. 내용줄(td) 글씨색 */
.nutrient-table td {
  color: #212529; /* 검정색에 가까운 글씨 */
  width: 40%; /* 함량 칸은 40% */
}

/* 6. 마지막 줄은 밑줄 없애기 (깔끔함) */
.nutrient-table tr:last-child td {
  border-bottom: none;
}

.community-cta-container {
  margin-top: 15px;
}

.community-cta-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 30px;
  background: linear-gradient(135deg, #f0f7ff 0%, #ffffff 100%);
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02);
}

/* 마우스 올렸을 때 효과 */
.community-cta-card:hover {
  transform: translateY(-5px);
  border-color: #4f46e5;
  box-shadow: 0 12px 30px rgba(79, 70, 229, 0.1);
  background: #ffffff;
}

.cta-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

/* 왼쪽 아이콘 박스 */
.cta-icon-box {
  width: 54px;
  height: 54px;
  background: #4f46e5;
  color: white;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2);
}

.cta-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.cta-label {
  font-size: 1.1rem;
  font-weight: 800;
  color: #1f2937;
}

.cta-desc {
  font-size: 0.9rem;
  color: #6b7280;
}

/* 오른쪽 화살표 영역 */
.cta-right {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #4f46e5;
  font-weight: 700;
  font-size: 0.95rem;
}

.cta-action-text {
  opacity: 0.8;
}

.bi-chevron-right {
  font-size: 1.1rem;
  transition: transform 0.2s;
}

.community-cta-card:hover .bi-chevron-right {
  transform: translateX(5px);
}

/* 반응형 (모바일) */
@media (max-width: 640px) {
  .community-cta-card {
    padding: 20px;
  }

  .cta-icon-box {
    width: 44px;
    height: 44px;
    font-size: 1.2rem;
  }

  .cta-desc {
    display: none; /* 모바일에서는 설명을 숨겨 깔끔하게 */
  }

  .cta-label {
    font-size: 1rem;
  }
}

/* 🚩 알러지 경고 배너 스타일 */
.allergy-danger-banner {
  background-color: #fff1f2; /* Rose 50 */
  border: 1px solid #fecaca; /* Red 200 */
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 30px;
  animation: slideDown 0.4s ease-out;
}

.banner-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.warning-icon {
  width: 50px;
  height: 50px;
  background-color: #ef4444; /* Red 500 */
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  font-weight: 900;
  box-shadow: 0 4px 10px rgba(239, 68, 68, 0.2);
}

.warning-text h4 {
  margin: 0 0 4px 0;
  font-size: 1.15rem;
  font-weight: 800;
  color: #991b1b; /* Red 800 */
}

.warning-text p {
  margin: 0;
  font-size: 0.95rem;
  color: #b91c1c;
  line-height: 1.5;
}

.danger-highlight {
  font-weight: 900;
  text-decoration: underline;
  color: #dc2626;
}

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
.purchase-box {
  margin-top: 25px;
  padding-top: 20px;
  border-top: 1px dashed #eee; /* 위쪽 구분선 */
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.price-info {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.price-label {
  font-size: 0.9rem;
  color: #888;
  font-weight: 500;
}

.price-value {
  font-size: 1.6rem;
  font-weight: 800;
  color: #d11; /* 가격 강조색 (빨강 계열) */
  font-family: "Roboto", sans-serif; /* 숫자 폰트 깔끔하게 */
}

.buy-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 14px 0;
  background-color: #1c7ed6; /* 네이버 쇼핑 시그니처 그린 */
  color: white;
  font-size: 1.1rem;
  font-weight: 700;
  border-radius: 8px;
  text-decoration: none; /* a 태그 밑줄 제거 */
  transition: all 0.2s ease;
  box-shadow: 0 4px 6px rgba(3, 46, 82, 0.3);
}

.buy-btn:hover {
  background-color: #99cbf1;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(3, 46, 82, 0.3);
}

.buy-btn.disabled {
  background-color: #ccc;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

/* 모바일 대응 */
@media (max-width: 768px) {
  .purchase-box {
    width: 100%; /* 모바일에서는 꽉 차게 */
    align-items: center;
  }

  .buy-btn {
    width: 100%;
    max-width: 300px; /* 너무 넓어지지 않게 제한 */
  }
}

/* 영양제함 담기 버튼 */
.cabinet-btn {
  padding: 10px 20px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  background: white;
  font-weight: 700;
  cursor: pointer;
  transition: 0.3s;
}
.cabinet-btn.is-taking {
  background: #42b983;
  color: white;
  border-color: #42b983;
}

/* 중복 섭취 스타일 */
.duplicate-warning-banner {
  background-color: #fffbeb; /* Amber 50 */
  border: 1px solid #dfd3a4; /* Amber 200 */
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 20px;
  animation: slideDown 0.4s ease-out;
}

.warning-icon.yellow {
  background-color: #f59e0b; /* Amber 500 */
  color: white;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
}

.warning-text h4 {
  margin: 0 0 6px 0;
  color: #92400e;
  font-weight: 800;
}

.duplicate-list {
  padding: 10px;
}

.duplicate-item {
  font-size: 0.9rem;
  color: #b45309;
  margin-bottom: 4px;
}

.dup-nut {
  font-weight: 800;
  text-decoration: underline;
}

.dup-pill {
  font-size: 0.85rem;
  color: #d97706;
}
</style>
