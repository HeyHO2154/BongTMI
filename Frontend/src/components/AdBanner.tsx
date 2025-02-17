import { useEffect, useState } from "react";
import styled from "styled-components";
import { useLocation } from 'react-router-dom';

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
  const location = useLocation();

  useEffect(() => {
    // 페이지 변경될 때마다 광고 재로드
    if (isVisible) {
      const loadAd = () => {
        if (window.kakaoAdFit?.cmd) {
          window.kakaoAdFit.cmd.push(() => {
            try {
              const ins = document.querySelector('.kakao_ad_area');
              if (ins) {
                console.log('광고 영역 초기화');
              }
            } catch (error) {
              console.error('광고 초기화 실패:', error);
            }
          });
        } else {
          setTimeout(loadAd, 500);
        }
      };

      loadAd();
    }
  }, [location.pathname, isVisible]); // 페이지 경로가 변경될 때마다 실행

  if (!isVisible) return null;

  return (
    <AdContainer>
      <CloseButton onClick={() => setIsVisible(false)}>✕</CloseButton>
      <div style={{ 
        width: '300px', 
        height: '250px'
      }}>
        {/* 가이드라인에 따른 정확한 광고 코드 */}
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
  top: -30px;  // 버튼을 광고 영역 위로 이동
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

