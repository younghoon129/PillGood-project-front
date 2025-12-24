<template>
  <div class="user-delete-container container my-5">
    <div class="delete-card shadow-sm">
      <div class="warning-icon-area">
        <i class="bi bi-person-x-fill"></i>
      </div>

      <h2 class="title">회원 탈퇴</h2>

      <div class="info-section">
        <p class="summary-text">
          정말로 <strong>PillGood</strong> 계정을 삭제하시겠습니까?
        </p>
        <div class="details-box">
          <ul>
            <li>
              탈퇴 시 귀하의 모든 <strong>개인 정보 및 후기</strong>가
              삭제됩니다.
            </li>
            <li>좋아요 내역 및 활동 데이터는 복구할 수 없습니다.</li>
            <li>
              동일한 이메일로 재가입 시에도 이전 데이터는 연동되지 않습니다.
            </li>
          </ul>
        </div>
      </div>

      <div class="action-group">
        <button @click="handleUserDelete" class="btn-delete-confirm">
          탈퇴 확정
        </button>
        <button @click="$router.back()" class="btn-go-back">
          취소하고 돌아가기
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "@/api/http";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const authStore = useAuthStore();
const API_URL = "/accounts";

const handleUserDelete = async () => {
  // 1. 브라우저 최종 확인
  if (!confirm("정말로 탈퇴하시겠습니까? 이 결정은 되돌릴 수 없습니다.")) {
    return;
  }

  try {
    // 2. 백엔드 DELETE 요청 (user-delete)
    await axios.delete(`${API_URL}/user-delete/`, {
      headers: {
        Authorization: `Token ${authStore.token}`,
      },
    });

    // 3. 성공 시 클라이언트 측 인증 데이터 파기
    alert("회원 탈퇴가 완료되었습니다. 이용해 주셔서 감사합니다.");

    // authStore에 logout 함수가 있다면 호출, 없다면 직접 초기화
    if (typeof authStore.logout === "function") {
      authStore.logout();
    } else {
      authStore.token = null;
      authStore.userInfo = null;
      localStorage.removeItem("token");
    }

    // 4. 메인 인덱스 페이지로 이동
    router.push({ name: "pills_index" });
  } catch (err) {
    console.error("탈퇴 오류:", err);
    alert("탈퇴 처리 중 문제가 발생했습니다. 관리자에게 문의하세요.");
  }
};
</script>

<style scoped>
.user-delete-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
}

.delete-card {
  max-width: 480px;
  width: 100%;
  background: #ffffff;
  padding: 50px 40px;
  border-radius: 30px;
  text-align: center;
}

.warning-icon-area {
  font-size: 4rem;
  color: #ff4d4f;
  margin-bottom: 20px;
}

.title {
  font-family: "GmarketSansMedium", sans-serif;
  font-weight: 800;
  color: #1a1a1a;
  margin-bottom: 30px;
}

.info-section {
  text-align: left;
  margin-bottom: 40px;
}

.summary-text {
  font-size: 1.1rem;
  color: #4a4a4a;
  text-align: center;
  margin-bottom: 20px;
}

.details-box {
  background: #fff5f5;
  padding: 20px;
  border-radius: 15px;
  border-left: 5px solid #ff4d4f;
}

.details-box ul {
  margin: 0;
  padding-left: 20px;
  font-size: 0.95rem;
  color: #666;
  line-height: 1.7;
}

.action-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.btn-delete-confirm {
  width: 100%;
  padding: 16px;
  background: #ff4d4f;
  color: white;
  border: none;
  border-radius: 14px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-delete-confirm:hover {
  background: #d32f2f;
  transform: translateY(-2px);
}

.btn-go-back {
  width: 100%;
  padding: 16px;
  background: #f5f5f5;
  color: #555;
  border: none;
  border-radius: 14px;
  font-weight: 600;
  cursor: pointer;
}

.btn-go-back:hover {
  background: #eeeeee;
}
</style>
