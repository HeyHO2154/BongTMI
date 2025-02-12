// src/components/Loading.tsx
import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";

interface LoadingProps {
  size?: number; // 로딩 스피너 크기 (기본값: 80)
}

const Loading: React.FC<LoadingProps> = ({ size = 80 }) => {
  // 🔹 로딩 문구 리스트
  const messages = [
    "잠시만 기다려주세요...",
    "데이터를 불러오는 중이에요!",
    "곧 준비됩니다! ⏳",
    "봉틈이가 열심히 불러오고 있어요!🏃",
    "잠시 차 한잔은 어떤가요..? ☕",
    "살짝만 기다려주시면 감사해요 🙌",
    "봉사를 하려는 당신, 정말 멋져요!👍"
  ];

  // 🔹 랜덤 문구 상태
  const [message, setMessage] = useState<string>(messages[0]);

  useEffect(() => {
    // 🔹 1~2초 사이 랜덤 변경 (1000~2000ms)
    const updateMessage = () => {
      const randomIndex = Math.floor(Math.random() * messages.length);
      setMessage(messages[randomIndex]);
    };

    // 🔹 1~2초 간격으로 메시지 변경
    const interval = setInterval(() => {
      updateMessage();
    }, 3000); // 1000~2000ms 랜덤 설정

    return () => clearInterval(interval); // 🔹 컴포넌트 언마운트 시 정리
  }, []); // 최초 마운트 시 실행

  return (
    <Overlay>
      <LoadingContainer>
        <BongTMIIcon size={size} src="/BongTMI.png" alt="봉틈이" />
        <LoadingMessage>{message}</LoadingMessage>
      </LoadingContainer>
    </Overlay>
  );
};

export default Loading;

// 🔹 스타일 정의
const bounce = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 900;
`;

const LoadingContainer = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const BongTMIIcon = styled.img<{ size: number }>`
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  animation: ${bounce} 1s ease-in-out infinite;
`;

const LoadingMessage = styled.p`
  margin-top: 20px;
  font-size: 16px;
  font-weight: 500;
  color: #555;
  transition: opacity 0.5s ease-in-out;
`;
