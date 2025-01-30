import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    width: 100%;
    height: 100%;
    overflow: hidden;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    touch-action: manipulation;
  }

  #root {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
  }

  .app-container {
    width: 100%;
    max-width: 600px;
    height: var(--app-height, 100vh); /* 동적 높이 적용 */
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border: 1px solid #ddd;
    position: relative;
    padding-bottom: env(safe-area-inset-bottom); /* iOS 하단 영역 확보 */
  }

  .navbar {
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: 600px;
    background-color: white;
    z-index: 100;
    padding-bottom: env(safe-area-inset-bottom); /* iOS 하단 안전 영역 추가 */
    box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
  }
`;

export default GlobalStyle;
