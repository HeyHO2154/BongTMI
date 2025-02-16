import { useState, useEffect } from "react";
import styled from "styled-components";

const AdBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // 저장된 시간 확인
    const hiddenTime = localStorage.getItem('adHiddenTime');
    if (hiddenTime) {
      const diff = Date.now() - parseInt(hiddenTime);
      // 5분(300000ms) 이내라면 광고 숨김
      if (diff < 300000) {
        setIsVisible(false);
        // 남은 시간만큼 타이머 설정
        const remainingTime = 300000 - diff;
        setTimeout(() => setIsVisible(true), remainingTime);
      } else {
        // 5분이 지났다면 저장된 시간 삭제
        localStorage.removeItem('adHiddenTime');
      }
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    // 현재 시간 저장
    localStorage.setItem('adHiddenTime', Date.now().toString());
    // 5분 후 다시 표시
    setTimeout(() => setIsVisible(true), 300000);
  };

  if (!isVisible) return null;

  return (
    <AdFitWrapper>
      <CloseButton onClick={handleClose}>✕</CloseButton>
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