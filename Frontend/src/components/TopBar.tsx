import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom"; // useNavigate import

const TopBar: React.FC = () => {

  const navigate = useNavigate(); // useNavigate 훅 호출

  const toHome = () => {
    navigate('/'); // 홈으로 이동
  };

  return (
    <BarWrapper>
      <Logo
        src="/src/assets/봉틈이2.png"
        alt="봉틈이"
        style={{ cursor: 'pointer' }}
        onClick={toHome}
      />
    </BarWrapper>
  );
};

export default TopBar;

// --------------------
// 스타일 정의
// --------------------
const BarWrapper = styled.div`
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: #fff; /* 상단 바 배경색 */
  height: 65px; /* 상단 바 높이 */
  display: flex;
  align-items: center;
  justify-content: center; /* 로고를 중앙 배치 */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* 약간의 그림자 추가 */
`;

const Logo = styled.img`
  height: 45px; /* 로고 높이 */
  width: auto; /* 비율 유지 */
`;
