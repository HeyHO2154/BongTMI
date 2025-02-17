import { useEffect } from "react";


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
    // 광고 초기화
    if (window.kakaoAdFit && window.kakaoAdFit.cmd) {
      window.kakaoAdFit.cmd.push({});
    }
  }, []);

  return (
    <div style={{ 
      position: 'fixed',
      right: '20px',
      top: '100px',
      zIndex: 1000
    }}>
      <ins 
        className="kakao_ad_area" 
        style={{ display: "none" }}
        data-ad-unit="DAN-ZSqt2LGCgKELa710"
        data-ad-width="300"
        data-ad-height="250"
      />
    </div>
  );
};

export default AdBanner;

