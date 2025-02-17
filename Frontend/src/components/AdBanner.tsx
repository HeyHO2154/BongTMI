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
    const loadAd = () => {
      if (window.kakaoAdFit?.cmd) {
        window.kakaoAdFit.cmd.push(() => {
          console.log('광고 초기화 시도');
        });
      } else {
        console.log('kakaoAdFit not found, retrying...');
        setTimeout(loadAd, 100);
      }
    };

    loadAd();
  }, []);

  return (
    <AdFitWrapper>
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

export default AdBanner;

