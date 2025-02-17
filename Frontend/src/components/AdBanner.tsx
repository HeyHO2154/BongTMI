import { useState } from "react";
import styled from "styled-components";

// kakaoAdFit 타입 선언 추가 
declare global {
  interface Window {
    kakaoAdFit: {
      cmd: {
        push: (arg: any) => void;
      };
    };
  }
}

const AdBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <AdContainer>
      <CloseButton onClick={() => setIsVisible(false)}>✕</CloseButton>
      <AdWrapper>
        <ins 
          className="kakao_ad_area" 
          style={{ display: "none" }}
          data-ad-unit="DAN-ZSqt2LGCgKELa710"
          data-ad-width="300"
          data-ad-height="250"
        />
      </AdWrapper>
    </AdContainer>
  );
};

const AdContainer = styled.div`
  position: fixed;
  z-index: 1000;
  right: 20px;
  top: 100px;

  @media screen and (max-width: 768px) {
    right: 50%;
    transform: translateX(50%);
    top: auto;
    bottom: 80px; // NavBar 위에 위치하도록
  }
`;

const AdWrapper = styled.div`
  width: 300px;
  height: 250px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;

  .kakao_ad_area {
    width: 100% !important;
    height: 100% !important;
  }

  @media screen and (max-width: 768px) {
    width: 320px; // 모바일에서 약간 더 넓게
    height: 250px;
    margin: 0 auto;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: -30px;
  right: 0;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #666;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  z-index: 1001;
  
  @media screen and (max-width: 768px) {
    top: -24px;
    right: 10px;
  }
  
  &:hover {
    background: #444;
  }
`;

export default AdBanner;

