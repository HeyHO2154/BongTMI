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
    // 광고 초기화 시도
    const initAd = () => {
      if (window.kakaoAdFit?.cmd) {
        window.kakaoAdFit.cmd.push(() => {
          try {
            console.log('광고 초기화 시도');
          } catch (error) {
            console.error('광고 초기화 실패:', error);
          }
        });
      } else {
        setTimeout(initAd, 500);  // 시간 늘림
      }
    };

    initAd();
  }, []);

  if (!isVisible) return null;

  return (
    <AdContainer>
      <CloseButton onClick={() => setIsVisible(false)}>✕</CloseButton>
      {/* 광고 영역과 닫기 버튼을 분리 */}
      <div style={{ 
        width: '300px', 
        height: '250px',
        background: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        <ins 
          className="kakao_ad_area" 
          style={{ display: "none" }}
          data-ad-unit="DAN-ZSqt2LGCgKELa710"
          data-ad-width="300"
          data-ad-height="250"
        />
      </div>
    </AdContainer>
  );
};

// 전체 컨테이너
const AdContainer = styled.div`
  position: fixed;
  z-index: 1000;
  right: 20px;
  top: 100px;
`;

// 닫기 버튼 (위치 조정)
const CloseButton = styled.button`
  position: absolute;
  top: -24px;  // 버튼을 광고 영역 위로 이동
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
  
  &:hover {
    background: #444;
  }
`;

export default AdBanner;

