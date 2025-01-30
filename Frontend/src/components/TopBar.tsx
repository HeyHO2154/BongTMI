import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { Bell, MessageCircle } from "lucide-react"; // 종 & 채팅 아이콘

const TopBar: React.FC = () => {
  const navigate = useNavigate();

  const toHome = () => navigate("/"); // 홈으로 이동
  const toNotifications = () => navigate("/notifications"); // 알람 페이지로 이동
  const toMessages = () => navigate("/messages"); // 채팅 페이지로 이동

  return (
    <BarWrapper>
      {/* 💬 오른쪽 채팅 아이콘 */}
      <IconWrapper onClick={toMessages}>
        <MessageCircle size={28} />
      </IconWrapper>

      {/* 🏠 중앙 로고 */}
      <Logo src="/assets/BongTMI2.png" alt="봉틈이" onClick={toHome} />


      {/* 🔔 왼쪽 알람 아이콘 */}
      <IconWrapper onClick={toNotifications}>
        <Bell size={28} />
      </IconWrapper>
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
  background-color: #fff;
  height: 65px;
  display: flex;
  align-items: center;
  justify-content: space-between; /* 좌우 정렬 */
  padding: 0 16px; /* 좌우 여백 */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const Logo = styled.img`
  height: 46px;
  width: auto;
  cursor: pointer;
`;

const IconWrapper = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 50%;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;
