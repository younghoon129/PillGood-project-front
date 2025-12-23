import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

export const usePillStore = defineStore('pills', () => {
  // 1. State
  const pills = ref([])
  const pill = ref(null)
  const count = ref(0) // ★ 전체 개수 저장용 변수 추가

  const API_URL = 'http://127.0.0.1:8000'

  const clearPillDetail = () => {
    pill.value = null
  }

  // 2. Actions
  const getPills = (page = 1, searchParams = {}) => {
    axios({
      method: 'get',
      url: `${API_URL}/pills/`,
      params: {
        page: page,
        ...searchParams
      }
    })
      .then((response) => {
        pills.value = response.data.results
        count.value = response.data.count // ★ API의 전체 개수를 state에 저장
      })
      .catch((error) => {
        console.log('검색 에러:', error)
      })
  }

  const getPillDetail = function (pillId) {
    axios({
      method: 'get',
      url: `${API_URL}/pills/${pillId}/`
    })
      .then((response) => {
        pill.value = response.data
      })
      .catch((error) => {
        console.log('상세 정보 가져오기 실패:', error)
      })

  }


  // ★ count도 반환 목록에 추가
  return { pills, pill, count, getPills, getPillDetail, clearPillDetail }
})