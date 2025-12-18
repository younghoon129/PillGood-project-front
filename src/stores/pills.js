// src/stores/pills.js
import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

export const usePillStore = defineStore('pills', () => {
  // 1. State (데이터 보관함)
  const pills = ref([])      // 전체 목록
  const pill = ref(null)     // 상세 정보 (1개)

  // API 기본 주소 (반복 사용되니 변수로)
  const API_URL = 'http://127.0.0.1:8000'

  // 2. Actions (함수/로직)
  
  // [목록 가져오기]
const getPills = (page = 1, searchParams = {}) => {
    
    axios({
      method: 'get',
      url: `${API_URL}/pills/`, // 혹은 views.index 주소
      // params 옵션에 넣으면 자동으로 주소 뒤에 ?keyword=...&search_type=... 형태로 붙습니다.
      params: {
        page: page,
        ...searchParams // 검색 조건 객체 풀어서 넣기
      }
    })
      .then((response) => {
        // ... 데이터 저장 로직 ...
        pills.value = response.data.results
        // 페이지네이션 정보 등 저장
      })
      .catch((error) => {
        console.log('검색 에러:', error)
      })
  }

  // [상세 정보 가져오기]
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

  // 3. 밖에서 쓸 수 있게 return
  return { pills, pill, getPills, getPillDetail }
})