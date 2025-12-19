<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const categoryName = ref('')
const substances = ref([])

onMounted(() => {
  const catId = route.params.categoryId
  axios.get(`http://127.0.0.1:8000/pills/categories/${catId}/`)
    .then(res => {
      categoryName.value = res.data.name
      substances.value = res.data.substances
    })
})

const goToDetail = (id) => {
  router.push({ name: 'ingredient-detail', params: { substanceId: id } })
}
</script>

<template>
  <div class="container">
    <h2 class="title"><span class="highlight">{{ categoryName }}</span> 관련 성분</h2>
    <div class="substance-grid">
      <div 
        v-for="sub in substances" 
        :key="sub.id" 
        class="sub-card"
        @click="goToDetail(sub.id)"
      >
        {{ sub.name }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.container { max-width: 800px; margin: 0 auto; padding: 40px 20px; }
.title { text-align: center; margin-bottom: 40px; font-weight: 800; }
.highlight { color: #1c7ed6; }
.substance-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 15px; }
.sub-card {
  background: white; border: 1px solid #dee2e6; border-radius: 12px;
  padding: 20px; text-align: center; font-weight: 600; color: #495057;
  cursor: pointer; transition: all 0.2s;
}
.sub-card:hover { border-color: #1c7ed6; color: #1c7ed6; background-color: #f8f9fa; }
</style>