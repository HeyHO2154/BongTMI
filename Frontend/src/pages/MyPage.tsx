// src/pages/MyPage.tsx
import React from "react";
import { useNavigate } from "react-router-dom";

const MyPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/user/login");
  };

  return (
    <div>
      <h1>마이페이지</h1>
      <button onClick={handleLoginClick}>로그인</button>
    </div>
  );
};

export default MyPage;
