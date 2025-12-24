<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from "@/api/http";
import PillCard from '@/components/pills/PillCard.vue'

const route = useRoute()
const router = useRouter()
const substance = ref({})
const topPills = ref([])

onMounted(async () => {
  const subId = route.params.substanceId
  
  // 1. 성분 정보 가져오기
  const subRes = await axios.get(`/pills/substances/${subId}/`)
  substance.value = subRes.data

  // 2. 관련 영양제 6개만 가져오기 (페이지네이션 활용)
  const pillRes = await axios.get(`/pills/substances/${subId}/pills/?page=1`)
  topPills.value = pillRes.data.results.slice(0, 6) // 앞에서 6개만 자르기
})

const goToMore = () => {
  router.push({ name: 'substance-pills', params: { substanceId: route.params.substanceId } })
}
</script>

<template>
  <div class="container" v-if="substance.name">
    <h1 class="page-title">{{ substance.name }}</h1>

    <div class="product-section">
      <div class="section-header">
        <h2><span class="blue-underline">{{ substance.name }}</span> 성분이 포함된 영양제 추천</h2>
        <button @click="goToMore" class="more-btn">더보기 ></button>
      </div>
      
      <div class="pill-grid">
        <PillCard v-for="pill in topPills" :key="pill.id" :pill="pill" />
      </div>
    </div>
  </div>
</template>

<style scoped>

.blue-underline {
  background: linear-gradient(to top, #A5D8FF 40%, transparent 40%);
}
.container { max-width: 1000px; margin: 0 auto; padding: 40px 20px; }
.page-title { text-align: center; margin-bottom: 40px; font-weight: 800; font-size: 2.5rem; }
.info-section { display: flex; flex-direction: column; gap: 20px; margin-bottom: 60px; }
.info-box { background: #f8f9fa; padding: 25px; border-radius: 16px; border-left: 5px solid #1c7ed6; }
.info-box.warning { border-left-color: #fa5252; background: #fff5f5; }
.info-box h3 { margin-bottom: 10px; font-weight: 700; font-size: 1.1rem; }
.info-box p { line-height: 1.6; color: #495057; white-space: pre-line; }

.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.more-btn { background: none; border: none; font-size: 1rem; color: #868e96; cursor: pointer; font-weight: 600; }
.more-btn:hover { color: #1c7ed6; }
.pill-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px; }
</style>