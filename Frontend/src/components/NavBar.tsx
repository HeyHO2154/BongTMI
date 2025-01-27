// src/components/NavBar.tsx
import React, { useState, useEffect } from "react";
import { NavLink, useLocation} from "react-router-dom";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faPlus, faEye, faUser, faHeart } from "@fortawesome/free-solid-svg-icons";

const NavBarContainer = styled.nav`
  position: fixed;
  z-index: 999; /* NavBar를 모든 콘텐츠 위로 가져오기 */
  width: 100%; /* 부모 컨테이너의 100% 폭 */
  background-color: #fff;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-around;
  padding: 20px 0;
  position: absolute; /* app-container 내부에서 절대 위치 */
  bottom: 0; /* 하단에 고정 */
`;

const NavButton = styled(NavLink)<{ isActive?: boolean }>`
  text-decoration: none;
  color: ${(props) => (props.isActive ? "#007bff" : "#555")};
  font-size: 14px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  transition: color 0.2s;
`;

const NavBar: React.FC = () => {
  const location = useLocation();
  const [activeButton, setActiveButton] = useState<string>("");

  useEffect(() => {
    // 마이페이지 이동 시 로그인 여부 확인
    const isDetailPage = /^\/detail\/\d+$/.test(location.pathname); // 정규식으로 숫자 포함 경로 확인
    if (location.pathname === "/my-page" || location.pathname === "/user/login" || location.pathname === "/A" || location.pathname === "/B") {
      setActiveButton("my-page");
    } else if (isDetailPage) {
      setActiveButton("/");
    } else {
      setActiveButton(location.pathname); // 다른 버튼들 활성화 상태 업데이트
    }
  });

  return (
    <NavBarContainer>
      <NavButton to="/" isActive={activeButton === "/"}>
        <FontAwesomeIcon icon={faHeart} size="2x" />
        봉사 추천
      </NavButton>
      <NavButton to="/search" isActive={activeButton === "/search"}>
        <FontAwesomeIcon icon={faSearch} size="2x" />
        봉사 검색
      </NavButton>
      <NavButton to="/add-bong" isActive={activeButton === "/add-bong"}>
        <FontAwesomeIcon icon={faPlus} size="2x" />
        봉사 등록
      </NavButton>
      <NavButton to="/feed" isActive={activeButton === "/feed"}>
        <FontAwesomeIcon icon={faEye} size="2x" />
        후기 탐색
      </NavButton>
      <NavButton
        to="/my-page"
        isActive={activeButton === "my-page"}
      >
        <FontAwesomeIcon icon={faUser} size="2x" />
        마이페이지
      </NavButton>
    </NavBarContainer>
  );
};

export default NavBar;
