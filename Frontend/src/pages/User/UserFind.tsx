import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const FindAccount: React.FC = () => {
  const [email, setEmail] = useState("");
  const [foundAccount, setFoundAccount] = useState<any>(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleFindAccount = async () => {
    if (!email) {
      setMessage("이메일을 입력해주세요.");
      return;
    }

    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setMessage("올바른 이메일 형식이 아닙니다.");
        return;
      }

      // API 연동은 나중에 구현
      setMessage("현재 테스트 중입니다.");
    } catch (error) {
      setMessage("계정을 찾을 수 없습니다.");
      setFoundAccount(null);
    }
  };

  return (
    <Container>
      <FormWrapper>
        <Title>계정 찾기</Title>
        <Subtitle>가입 시 등록한 이메일을 입력해주세요</Subtitle>

        <InputGroup>
          <Label>이메일</Label>
          <StyledInput
            type="email"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </InputGroup>

        {message && <Message isError={!foundAccount}>{message}</Message>}

        <ButtonGroup>
          <FindButton onClick={handleFindAccount}>계정 찾기</FindButton>
          <BackButton onClick={() => navigate("/login")}>
            로그인으로 돌아가기
          </BackButton>
        </ButtonGroup>
      </FormWrapper>
    </Container>
  );
};

export default FindAccount;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 160px);
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%);
  padding: 20px;
`;

const FormWrapper = styled.div`
  width: 100%;
  max-width: 480px;
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #2c3e50;
  text-align: center;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: #7f8c8d;
  text-align: center;
  margin-bottom: 32px;
`;

const InputGroup = styled.div`
  margin-bottom: 24px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #34495e;
  margin-bottom: 8px;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 15px;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
  }

  &::placeholder {
    color: #bdc3c7;
  }
`;

const Message = styled.p<{ isError: boolean }>`
  text-align: center;
  font-size: 14px;
  color: ${props => props.isError ? '#e74c3c' : '#27ae60'};
  margin: 16px 0;
  padding: 12px;
  border-radius: 12px;
  background-color: ${props => props.isError ? '#ffebee' : '#e8f5e9'};
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 24px;
`;

const FindButton = styled.button`
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(52, 152, 219, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
`;

const BackButton = styled.button`
  width: 100%;
  padding: 14px;
  background: transparent;
  color: #7f8c8d;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #f8f9fa;
    border-color: #bdc3c7;
  }
`;
