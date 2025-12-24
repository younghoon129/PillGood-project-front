<script setup>
import { ref, onMounted } from 'vue'
import axios from "@/api/http";
import { useRouter } from 'vue-router'

const categories = ref([])
const router = useRouter()

// 이모지 매핑 (텍스트 매칭이 안되면 기본값 💊 표시)
const categoryIcons = {
  '간': '🍺',          // 간 건강 (피로/해독)
  '눈': '👀',          // 눈 건강
  '장': '🚽',          // 장 건강/배변
  '뼈': '🦴',          // 관절/뼈
  '면역': '🛡️',        // 면역/활력, 유아/아동 (성장/면역)
  '다이어트': '⚖️',    // 다이어트 (체지방)
  '혈관': '🩸',        // 혈관/혈액순환
  '심장': '💓',        // 심장/혈압
  '피부': '✨',        // 피부/미용
  '수면': '💤',        // 뇌/신경/수면
  '뇌': '🧠',          // 뇌/신경/수면 (키워드 순서에 따라 위 아이콘이 뜰 수 있음)
  '위': '🤢',          // 위/소화기
  '호흡기': '😷',      // 호흡기/구강
  '구강': '🦷',        // (혹시 호흡기가 매칭 안될 경우)
  '남성': '👨',        // 남성 건강
  '여성': '👩',        // 여성 건강
  '유아': '👶',        // 유아/아동
  '근육': '💪',        // 근육/운동
  '운동': '🏃',        // (근육 매칭 안될 경우)
  '피로': '⚡',        // 간 건강 쪽에 포함되지만 혹시 몰라 추가
}

const getIcon = (name) => {
  for (const key in categoryIcons) {
    if (name.includes(key)) return categoryIcons[key]
  }
  return '💊'
}

onMounted(() => {
  axios.get('/pills/categories/')
    .then(res => categories.value = res.data)
})

const goToList = (id) => {
  router.push({ name: 'ingredient-list', params: { categoryId: id } })
}
</script>

<template>
  <div class="container">
    <h1 class="title">어떤 고민이 있으신가요?</h1>
    <div class="grid-box">
      <div 
        v-for="cat in categories" 
        :key="cat.id" 
        class="category-card"
        @click="goToList(cat.id)"
      >
        <div class="icon">{{ getIcon(cat.name) }}</div>
        <div class="name">{{ cat.name }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container { max-width: 800px; margin: 0 auto; padding: 40px 20px; text-align: center; }
.title { margin-bottom: 40px; font-weight: 800; color: #343a40; }
.grid-box { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 20px; }
.category-card { 
  background: white; padding: 20px; border-radius: 20px; 
  box-shadow: 0 4px 12px rgba(0,0,0,0.08); cursor: pointer; transition: transform 0.2s;
}
.category-card:hover { transform: translateY(-5px); background-color: #e7f5ff; }
.icon { font-size: 3rem; margin-bottom: 10px; }
.name { font-weight: 700; color: #495057; word-break: keep-all;}
</style>