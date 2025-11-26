/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    // src 폴더 아래 모든 .vue, .js, .ts 파일 등을 스캔합니다.
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
