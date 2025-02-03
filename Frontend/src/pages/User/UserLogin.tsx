import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // 페이지 이동을 위한 훅
import styled from "styled-components";
import config from "../../config";

const handleKakaoLogin = () => {
  window.location.href = `${config.API_DEV}/oauth/kakao`;
};
const handleNaverLogin = () => {
  window.location.href = `${config.API_DEV}/oauth/naver`;
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
    console.log("로그인 시도:", { userId, password });
  };

  return (
    <Container>
      <Logo src="/assets/BongTMI1.png" alt="봉틈이" />

      <Input
        type="text"
        placeholder="아이디를 입력하세요"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />

      <Input
        type="password"
        placeholder="비밀번호를 입력하세요"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <LoginButton onClick={handleLogin}>로그인</LoginButton>
      <LinkContainer>
        <StyledLink onClick={() => navigate("/user/find-account")}>계정찾기</StyledLink>
        |
        <StyledLink onClick={() => navigate("/user/register")}>회원가입</StyledLink>
      </LinkContainer>
      <ButtonContainer>
        <NaverButton
          src="/assets/Login_Naver.png"
          onClick={handleNaverLogin}
        />
        <KakaoButton
          src="/assets/Login_Kakao.png"
          onClick={handleKakaoLogin}
        />
      </ButtonContainer>

      
    </Container>
  );
};

export default Login;


const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80vh;
  text-align: center;
`;

const Logo = styled.img`
  height: 250px; /* 로고 높이 */
  width: auto; /* 비율 유지 */
  padding-bottom: 15px;
`;

const Input = styled.input`
  margin-bottom: 10px;
  padding: 12px;
  width: 280px;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding-top: 30px;
`;

const LoginButton = styled.button`
  width: 280px;
  padding: 12.5px 21.5px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  font-size: 14px;
  &:hover {
    background-color: #0056b3;
  }
`;

const KakaoButton = styled.img`
  cursor: pointer;
  max-width: 200px;
`;
const NaverButton = styled.img`
  cursor: pointer;
  max-width: 91.6px;
  border-radius: 7px;
`;

const LinkContainer = styled.div`
  margin-top: 15px;
  display: flex;
  justify-content: center;
  gap: 15px;
`;

const StyledLink = styled.span`
  cursor: pointer;
  text-decoration: underline;
  color: #007bff;
`;
