// src/components/NavBar.tsx
import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faSearch, faPlus, faEye, faUser, faHeart } from "@fortawesome/free-solid-svg-icons";

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

const NavButton = styled(NavLink)`
  text-decoration: none;
  color: #555;
  font-size: 14px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  transition: color 0.2s;

  &.active {
    color: #007bff;
  }
`;

const NavBar: React.FC = () => {
  return (
    <NavBarContainer>
      <NavButton to="/swipe">
        <FontAwesomeIcon icon={faHeart} size="2x" />
        공고 추천
      </NavButton>
      <NavButton to="/search">
        <FontAwesomeIcon icon={faSearch} size="2x" />
        공고 검색
      </NavButton>
      <NavButton to="/add-card">
        <FontAwesomeIcon icon={faPlus} size="2x" />
        공고 등록
      </NavButton>
      <NavButton to="/feed">
        <FontAwesomeIcon icon={faEye} size="2x" />
        후기 탐색
      </NavButton>
      <NavButton to="/my-page">
        <FontAwesomeIcon icon={faUser} size="2x" />
        마이페이지
      </NavButton>
    </NavBarContainer>
  );
};

export default NavBar;
