// src/components/NavBar.tsx
import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

const NavBarContainer = styled.nav`
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
  transition: color 0.3s;

  &.active {
    color: #007bff;
  }
`;

const NavBar: React.FC = () => {
  return (
    <NavBarContainer>
      <NavButton to="/slider">Slider</NavButton>
      <NavButton to="/search">Search</NavButton>
      <NavButton to="/add-card">AddCard</NavButton>
      <NavButton to="/feed">Feed</NavButton>
      <NavButton to="/my-page">MyPage</NavButton>
    </NavBarContainer>
  );
};

export default NavBar;
