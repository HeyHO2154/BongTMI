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

  useEffect(() => {
    // kakaoAdfit 명시적 초기화
    window.kakaoAdfit = window.kakaoAdfit || [];

    const checkAdfit = setInterval(() => {
      // kakaoAdfit이 존재하고 push 메서드가 있는지 확인
      if (window.kakaoAdfit && typeof window.kakaoAdfit.push === 'function') {
        try {
          window.kakaoAdfit.push({});
          console.log('AdFit 광고 요청 성공');
          clearInterval(checkAdfit);
        } catch (error) {
          console.error('AdFit 광고 요청 실패:', error);
        }
      }
    }, 1000); // 1초마다 확인

    // cleanup
    return () => clearInterval(checkAdfit);
  }, []);

  if (!isVisible) return null;

  return (
    <AdFitWrapper>
      <CloseButton onClick={() => setIsVisible(false)}>✕</CloseButton>
      <ins
        className="kakao_ad_area"
        style={{ display: "block" }}
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