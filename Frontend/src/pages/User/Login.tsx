import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // 페이지 이동을 위한 훅

const handleKakaoLogin = () => {
  const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=aa593063067708935c526eedf855bc6e&redirect_uri=http://localhost:5173/auth/callback/kakao`;
  window.location.href = kakaoAuthUrl;
};

const Login: React.FC = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // 페이지 이동을 위한 훅

  const handleLogin = () => {
    if (!userId || !password) {
      alert("아이디와 비밀번호를 입력해주세요.");
      return;
    }
    // 일반 로그인 로직 처리 (추후 구현 필요)
    console.log("로그인 시도:", { userId, password });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "80vh",
        textAlign: "center",
      }}
    >
      <h1 style={{ marginBottom: "20px" }}>로그인</h1>
      {/* 아이디 입력 창 */}
      <input
        type="text"
        placeholder="아이디를 입력하세요"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        style={{
          marginBottom: "10px",
          padding: "10px",
          width: "280px",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
      />
      {/* 비밀번호 입력 창 */}
      <input
        type="password"
        placeholder="비밀번호를 입력하세요"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{
          marginBottom: "20px",
          padding: "10px",
          width: "280px",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
      />
      {/* 로그인 버튼 + 카카오 로그인 버튼 */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <button
          onClick={handleLogin}
          style={{
            padding: "12.5px 21.5px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          로그인
        </button>
        <img
          src="/src/assets/kakao_login_medium.png"
          alt="Login with Kakao"
          style={{ cursor: "pointer", maxWidth: "200px" }}
          onClick={handleKakaoLogin}
        />
      </div>
      {/* 계정찾기 / 회원가입 */}
      <div
        style={{
          marginTop: "20px",
          display: "flex",
          justifyContent: "center",
          gap: "20px",
        }}
      >
        <span
          onClick={() => navigate("/A")}
          style={{
            cursor: "pointer",
            textDecoration: "underline",
            color: "#007bff",
          }}
        >
          계정찾기
        </span>
        /
        <span
          onClick={() => navigate("/B")}
          style={{
            cursor: "pointer",
            textDecoration: "underline",
            color: "#007bff",
          }}
        >
          회원가입
        </span>
      </div>
    </div>
  );
};

export default Login;
