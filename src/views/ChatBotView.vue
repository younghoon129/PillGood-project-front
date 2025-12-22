<template>
  <div class="chatbot-container">
    <div class="chatbot-header">
      <div class="bot-info">
        <div class="bot-avatar-circle">P</div>
        <div>
          <h3>PillGood AI 상담사</h3>
          <p class="status"><span class="dot"></span> 온라인</p>
        </div>
      </div>
      <button @click="$emit('close')" class="close-btn">×</button>
    </div>

    <div class="chat-window" ref="chatWindow">
      <div
        v-for="(msg, idx) in messages"
        :key="idx"
        :class="['message-row', msg.role]"
      >
        <div v-if="msg.role === 'bot'" class="bot-icon">💊</div>
        <div class="bubble">
          <div class="text-content" style="white-space: pre-wrap">
            {{ msg.text }}
          </div>
        </div>
      </div>

      <div v-if="isLoading" class="message-row bot">
        <div class="bot-icon">💊</div>
        <div class="bubble loading-bubble">
          <div class="dots"><span></span><span></span><span></span></div>
          <p>데이터 분석 중...</p>
        </div>
      </div>
    </div>

    <div class="input-area">
      <input
        v-model="userInput"
        @keyup.enter="sendMessage"
        placeholder="증상이나 상황을 입력해 주세요..."
        :disabled="isLoading"
      />
      <button @click="sendMessage" :disabled="isLoading || !userInput.trim()">
        전송
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from "vue";
import axios from "axios";
import { useAuthStore } from "@/stores/auth";

const emit = defineEmits(["close"]);
const authStore = useAuthStore();

const userInput = ref("");
const messages = ref([
  {
    role: "bot",
    text: '안녕하세요! 당신의 건강 멘토 PillGood입니다. \n\n"요즘 눈이 너무 침침해" 또는 "우리 부모님 선물 추천해줘" 처럼 고민되는 상황을 말씀해 주세요!',
  },
]);
const isLoading = ref(false);
const chatWindow = ref(null);

// 🚩 스크롤 최하단 이동 함수
const scrollToBottom = async () => {
  await nextTick();
  if (chatWindow.value) {
    chatWindow.value.scrollTop = chatWindow.value.scrollHeight;
  }
};

const sendMessage = async () => {
  if (!userInput.value.trim() || isLoading.value) return;

  const userMsg = userInput.value;
  messages.value.push({ role: "user", text: userMsg });
  userInput.value = "";
  isLoading.value = true;

  await scrollToBottom();

  try {
    const res = await axios.post(
      "http://localhost:8000/pills/chatbot/",
      { message: userMsg },
      { headers: { Authorization: `Token ${authStore.token}` } }
    );

    messages.value.push({ role: "bot", text: res.data.reply });
  } catch (err) {
    console.error(err);
    messages.value.push({
      role: "bot",
      text: "죄송합니다. AI 멘토와 연결에 실패했습니다. 잠시 후 다시 시도해 주세요.",
    });
  } finally {
    isLoading.value = false;
    await scrollToBottom();
  }
};

onMounted(() => {
  scrollToBottom();
});
</script>

<style scoped>
/*  */

.chatbot-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%; /* HomeView의 modal-window 높이(80vh)를 가득 채움 */
  background: white;
  overflow: hidden; /* 컨테이너 자체 스크롤 방지 */
}

/* 헤더 고정 */
.chatbot-header {
  padding: 20px;
  background: white;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}

.bot-info {
  display: flex;
  align-items: center;
  gap: 12px;
}
.bot-avatar-circle {
  width: 40px;
  height: 40px;
  background: #1c7ed6;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1.2rem;
}
.bot-info h3 {
  margin: 0;
  font-size: 1rem;
  color: #333;
}
.status {
  margin: 0;
  font-size: 0.8rem;
  color: #888;
  display: flex;
  align-items: center;
  gap: 4px;
}
.dot {
  width: 6px;
  height: 6px;
  background: #22c55e;
  border-radius: 50%;
}

.close-btn {
  background: none;
  border: none;
  font-size: 2rem;
  color: #ccc;
  cursor: pointer;
  line-height: 1;
}

/* 🚩 채팅창 (이 영역만 스크롤됨) */
.chat-window {
  flex: 1; /* 남은 중간 공간을 모두 차지 */
  padding: 20px;
  overflow-y: auto; /* 내용이 넘치면 스크롤바 생성 */
  display: flex;
  flex-direction: column;
  gap: 15px;
  background: #fdfdfd;
}

/* 스크롤바 커스텀 */
.chat-window::-webkit-scrollbar {
  width: 6px;
}
.chat-window::-webkit-scrollbar-thumb {
  background: #e9ecef;
  border-radius: 10px;
}

.message-row {
  display: flex;
  gap: 10px;
  max-width: 85%;
}
.message-row.user {
  align-self: flex-end;
  flex-direction: row-reverse;
}
.message-row.bot {
  align-self: flex-start;
}

.bot-icon {
  font-size: 1.2rem;
  margin-top: 5px;
}

.bubble {
  padding: 12px 16px;
  border-radius: 15px;
  font-size: 0.95rem;
  line-height: 1.5;
}
.user .bubble {
  background: #1c7ed6;
  color: white;
  border-bottom-right-radius: 2px;
}
.bot .bubble {
  background: #f1f3f5;
  color: #333;
  border-bottom-left-radius: 2px;
}

/* 입력 영역 하단 고정 */
.input-area {
  padding: 20px;
  background: white;
  display: flex;
  gap: 10px;
  border-top: 1px solid #eee;
  flex-shrink: 0;
}

.input-area input {
  flex: 1;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 10px;
  font-size: 1rem;
}
.input-area input:focus {
  outline: none;
  border-color: #1c7ed6;
}
.input-area button {
  padding: 0 20px;
  background: #1c7ed6;
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
}

/* 로딩 애니메이션 */
.loading-bubble {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #888;
}
.dots span {
  display: inline-block;
  width: 5px;
  height: 5px;
  background: #ccc;
  border-radius: 50%;
  animation: blink 1.4s infinite;
  margin: 0 2px;
}
.dots span:nth-child(2) {
  animation-delay: 0.2s;
}
.dots span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes blink {
  0% {
    opacity: 0.2;
  }
  20% {
    opacity: 1;
  }
  100% {
    opacity: 0.2;
  }
}
</style>
