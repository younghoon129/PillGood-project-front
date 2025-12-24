import axios from "axios";

const instance = axios.create({
  // 새로운 EC2 퍼블릭 IP를 입력합니다.
  // Django가 8000번 포트에서 실행 중이라면 :8000을 붙여야 합니다.
  baseURL: "http://localhost:8001",
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
