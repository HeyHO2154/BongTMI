import { useState, useEffect } from "react";
import styled from "styled-components";

// kakaoAdfit 타입 선언 추가
declare global {
  interface Window {
    kakaoAdfit: any[];
  }
}

const AdBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // 광고 초기화를 위한 배열 생성
    if (!window.kakaoAdfit) {
      window.kakaoAdfit = [];
    }
    
    // 광고 로드
    window.kakaoAdfit.push({});
  }, []);

  if (!isVisible) return null;

  return (
    <AdFitWrapper>
      <CloseButton onClick={() => setIsVisible(false)}>✕</CloseButton>
      <ins 
        className="kakao_ad_area" 
        style={{ display: "none" }}
        data-ad-unit="DAN-ZSqt2LGCgKELa710"
        data-ad-width="300"
        data-ad-height="250"
      />
    </AdFitWrapper>
  );
};

export default AdBanner;

const AdFitWrapper = styled.div`
  position: fixed;
  z-index: 1000;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

  /* 데스크톱 */
  @media (min-width: 1200px) {
    right: 20px;
    top: 100px;
    width: 300px;
    height: 250px;
  }

  /* 모바일 */
  @media (max-width: 1199px) {
    right: 10px;
    top: 80px;
    width: 300px;
    height: 250px;
    transform: scale(0.8); // 크기를 약간 줄임
    transform-origin: top right; // 오른쪽 상단 기준으로 크기 조절
  }
`;

// 닫기 버튼 스타일
const CloseButton = styled.button`
  position: absolute;
  top: -8px;
  right: -8px;
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
  
  &:hover {
    background: #444;
  }
`; 