import { useEffect, useState } from "react";
import styled from "styled-components";

// kakaoAdfit 타입 선언 추가
declare global {
  interface Window {
    kakaoAdfit: any[];
  }
}

const AdBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  // NO-AD 콜백 함수
  const handleAdFail = (elm: HTMLElement) => {
    console.log('광고 로드 실패');
    setIsVisible(false);
  };

  useEffect(() => {
    // kakaoAdfit 명시적 초기화
    window.kakaoAdfit = window.kakaoAdfit || [];
    window.kakaoAdfit.push({});
  }, []);

  if (!isVisible) return null;

  return (
    <AdFitWrapper>
      <CloseButton onClick={() => setIsVisible(false)}>✕</CloseButton>
      <ins 
        className="kakao_ad_area" 
        style={{ display: "none", width: "100%" }}  // width: 100% 추가
        data-ad-unit="DAN-ZSqt2LGCgKELa710"
        data-ad-width="300"
        data-ad-height="250"
        data-ad-onfail="handleAdFail"  // NO-AD 콜백 추가
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
  right: 20px;
  top: 100px;
  width: 300px;
  height: 250px;
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