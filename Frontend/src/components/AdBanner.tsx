import { useEffect, useState } from "react";
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

  useEffect(() => {
    const loadAd = () => {
      if (window.kakaoAdFit?.cmd) {
        window.kakaoAdFit.cmd.push(function() {  // 함수로 변경
          try {
            console.log('광고 초기화 시도');
            const ins = document.querySelector('.kakao_ad_area');
            if (ins) {
              console.log('광고 영역 찾음');
              (window.kakaoAdFit as any).push({});  // 실제 광고 요청
            } else {
              console.log('광고 영역을 찾을 수 없음');
            }
          } catch (error) {
            console.error('광고 초기화 실패:', error);
          }
        });
      } else {
        console.log('kakaoAdFit not found, retrying...');
        setTimeout(loadAd, 500);
      }
    };

    if (isVisible) {
      loadAd();
    }
  }, [isVisible]);

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

const AdFitWrapper = styled.div`
  position: fixed;
  z-index: 1000;
  right: 20px;
  top: 100px;
  width: 300px;
  height: 250px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;  // iframe이 컨테이너를 벗어나지 않도록
`;

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

export default AdBanner;

