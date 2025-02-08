// src/components/Loading.tsx
import React from "react";
import styled, { keyframes } from "styled-components";

interface LoadingProps {
  size?: number; // 로딩 스피너 크기 (기본값: 50)
  message?: string; // 로딩 메시지 (기본값: "로딩 중...")
}

const Loading: React.FC<LoadingProps> = ({ size = 50, message = "로딩 중..." }) => {
  return (
    <LoadingContainer>
      <Spinner size={size} />
      <LoadingMessage>{message}</LoadingMessage>
    </LoadingContainer>
  );
};

export default Loading;

// 🔹 스타일 정의
const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  text-align: center;
  color: #555;
`;

// 🔹 스피너 애니메이션
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Spinner = styled.div<{ size: number }>`
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #007bff;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const LoadingMessage = styled.p`
  margin-top: 10px;
  font-size: 16px;
  font-weight: 500;
`;
