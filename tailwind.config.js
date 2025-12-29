/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // ⚠️ 이 줄이 없으면 스타일 적용 안 됨!
  ],
  theme: {
    extend: {
      // 1. 색상 정의 (Interview-GO 테마)
      colors: {
        primary: "#4F46E5",        /* Indigo 600 */
        "primary-hover": "#4338CA", /* Indigo 700 */
        secondary: "#64748B",      /* Slate 500 */
        "bg-base": "#F8FAFC",      /* Slate 50 */
        surface: "#FFFFFF",        /* White */
        danger: "#F43F5E",         /* Rose 500 */
      },
      // 2. 그림자 정의
      boxShadow: {
        card: "0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)",
        floating: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
      },
      // 3. 폰트 정의 (선택사항, 필요시 사용)
      fontFamily: {
        sans: ["Pretendard", "-apple-system", "BlinkMacSystemFont", "system-ui", "Roboto", "sans-serif"],
      }
    },
  },
  plugins: [],
}
