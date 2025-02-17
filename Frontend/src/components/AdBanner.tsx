import { useEffect } from "react";
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
  useEffect(() => {
    // 광고 초기화 시도
    const initAd = () => {
      if (window.kakaoAdFit?.cmd) {
        window.kakaoAdFit.cmd.push(() => {
          const ins = document.querySelector('.kakao_ad_area');
          if (ins) {
            // display: none을 block으로 변경
            ins.setAttribute('style', 'display: block');
            console.log('광고 영역 초기화 완료');
          }
        });
      } else {
        // 스크립트가 아직 로드되지 않았다면 재시도
        setTimeout(initAd, 100);
      }
    };

    initAd();
  }, []);

  return (
    <AdContainer>
      <AdFitWrapper>
        <ins 
          className="kakao_ad_area" 
          style={{ display: "none" }}
          data-ad-unit="DAN-ZSqt2LGCgKELa710"
          data-ad-width="300"
          data-ad-height="250"
        />
      </AdFitWrapper>
      <CloseButton onClick={() => console.log('광고 닫기')}>✕</CloseButton>
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

// 광고 래퍼
const AdFitWrapper = styled.div`
  width: 300px;
  height: 250px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

// 닫기 버튼 (위치 조정)
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

