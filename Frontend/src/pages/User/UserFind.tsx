import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import config from "../../config";

const FindAccount: React.FC = () => {
  const [email, setEmail] = useState("");
  const [foundId, setFoundId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  // 아이디 찾기 요청
  const handleFindId = async () => {
    try {
      const response = await axios.post(`${config.API_DEV}/api/auth/find-id`, { email });
      setFoundId(response.data.id);
      setMessage(""); // 메시지 초기화
    } catch (error) {
      setMessage("등록된 이메일이 없습니다.");
      setFoundId(null);
    }
  };

  // 비밀번호 재설정 요청
  const handleResetPassword = async () => {
    try {
      await axios.post(`${config.API_DEV}/api/auth/reset-password`, { email });
      setMessage("비밀번호 재설정 링크가 이메일로 전송되었습니다.");
    } catch (error) {
      setMessage("비밀번호 재설정 요청 실패.");
    }
  };

  return (
    <Container>
      <Title>아이디 / 비밀번호 찾기</Title>

      <InputContainer>
        <Label>가입한 이메일을 입력하세요</Label>
        <Input
          type="email"
          placeholder="example@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </InputContainer>

      <ButtonContainer>
        <Button onClick={handleFindId}>아이디 찾기</Button>
        <Button onClick={handleResetPassword}>비밀번호 재설정</Button>
      </ButtonContainer>

      {foundId && <ResultText>아이디: <strong>{foundId}</strong></ResultText>}
      {message && <ResultText>{message}</ResultText>}
    </Container>
  );
};

export default FindAccount;

// --------------------
// 스타일 정의
// --------------------

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 160px); /* TopBar(60px) + Navbar(60px) */
  background-color: #f8f9fa;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`;

const Label = styled.label`
  font-size: 14px;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 280px;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const Button = styled.button`
  width: 130px;
  padding: 12px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;

  &:hover {
    background-color: #0056b3;
  }
`;

const ResultText = styled.p`
  margin-top: 15px;
  font-size: 16px;
  color: #333;
`;
