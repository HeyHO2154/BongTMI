// src/styles/GlobalStyle.ts
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Arial', sans-serif;
    background-color: #f8f9fa;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }

  #root {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    width: 100%;
    height: 100%;
  }

  .app-container {
    width: 600px; /* 가로 길이를 500px로 고정 */
    background-color: white;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* 그림자 효과 추가 */
    border: 1px solid #ddd; /* 외곽선 추가 */
    position: relative; /* NavBar가 fixed일 때 상위 구조 내에 위치 */
  }
`;

export default GlobalStyle;
