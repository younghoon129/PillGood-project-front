import { defineStore } from "pinia";
import axios from "axios";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("token") || null,
    username: localStorage.getItem("username") || null,
    userId: localStorage.getItem("userId") || null,
    nickname: localStorage.getItem("nickname") || null,
  }),
  getters: {
    isLoggedIn: (state) => !!state.token,
  },
  actions: {
    // 회원가입
    async signup(payload) {
      try {
        const res = await axios.post(
          "http://localhost:8000/accounts/signup/",
          payload
        );
        this.saveToken(res.data);
      } catch (err) {
        throw err;
      }
    },
    // 로그인
    async login(payload) {
      try {
        const res = await axios.post(
          "http://localhost:8000/accounts/login/",
          payload
        );
        this.saveToken(res.data);
      } catch (err) {
        throw err;
      }
    },
    // 토큰 저장 공통 로직
    saveToken(data) {
      this.token = data.token;
      this.username = data.username;
      this.userId = data.id;
      this.nickname = data.nickname;
      localStorage.setItem("token", this.token);
      localStorage.setItem("username", this.username);
      localStorage.setItem("nickname", this.nickname);
      // 이후 모든 axios 요청에 토큰 자동 포함
      axios.defaults.headers.common["Authorization"] = `Token ${this.token}`;
    },
    // 로그아웃
    logout() {
      this.token = null;
      this.username = null;
      this.nickname = null;
      localStorage.clear();
      delete axios.defaults.headers.common["Authorization"];
    },
  },
});
