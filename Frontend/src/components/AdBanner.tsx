import styled from "styled-components";

const AdBanner = () => {
  return (
    <AdFitWrapper>
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