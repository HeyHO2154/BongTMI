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
  right: 20px;
  top: 100px;
  width: 300px;
  height: 250px;
  z-index: 1000;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

  @media (max-width: 1200px) {
    display: none;
  }
`; 