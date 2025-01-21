// src/pages/Slider.tsx
import React, { useState, useRef } from "react";
import styled from "styled-components";

interface CardData {
  id: number;
  label: string;
  date: string;
  context: string;
}

const initialCards: CardData[] = [
  { id: 1, label: "봄볕주야간보호센터", date: "모집마감일: 2025-01-21", context: "주야간보호센터 어르신 활동 보조 및 프로그램 준비 도움(오후)" },
  { id: 2, label: "삼송기쁨데이케어센터", date: "모집마감일: 2025-01-21", context: "(삼송역부근)악기,춤,노래,국악 등 자원봉사 모집합니다. 월-토 16-17시" },
  { id: 3, label: "아가페요양원", date: "모집마감일: 2025-01-21", context: "아가페요양원에서 어르신들을 위한 자원봉사자님을 모집합니다.(동인천아가페요양원)" },
  { id: 4, label: "산성종합사회복지관", date: "모집마감일: 2025-01-21", context: "산성종합사회복지관 경로식당 정기 봉사자를 모집합니다." },
  { id: 5, label: "삼송기쁨데이케어센터", date: "모집마감일: 2025-01-21", context: "(삼송역 부근)악기,춤,노래,국악 등 자원봉사 모집합니다.월-토 11-12시" },
];

const SWIPE_THRESHOLD = 100; // 스와이프 판정 기준 (px)

const Slider: React.FC = () => {
  // 남아 있는 카드 배열
  const [cards, setCards] = useState<CardData[]>(initialCards);
  // 현재 최상단(가장 마지막) 카드 인덱스
  const [currentIndex, setCurrentIndex] = useState<number>(cards.length - 1);

  // 드래그 위치 상태
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0); // 드래그 시작점

  // --------------------
  // 터치 이벤트 핸들러
  // --------------------
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setIsDragging(true);
    startX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    setDragX(currentX - startX.current);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    checkSwipe();
  };

  // --------------------
  // 마우스 이벤트 핸들러
  // --------------------
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    startX.current = e.clientX;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const currentX = e.clientX;
    setDragX(currentX - startX.current);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    checkSwipe();
  };

  const handleMouseLeave = () => {
    // 드래그 중에 영역을 벗어난 경우 처리
    if (isDragging) {
      setIsDragging(false);
      checkSwipe();
    }
  };

  // --------------------
  // 스와이프 판정 & 처리
  // --------------------
  const checkSwipe = () => {
    if (dragX > SWIPE_THRESHOLD) {
      swipe("right");
    } else if (dragX < -SWIPE_THRESHOLD) {
      swipe("left");
    } else {
      // 임계값 미만이면 원위치
      setDragX(0);
    }
  };

  const swipe = (direction: "left" | "right") => {
    // 최상단 카드를 배열에서 제거
    setCards((prevCards) => {
      return prevCards.filter((_, i) => i !== currentIndex);
    });

    // dragX 리셋 & 다음 카드 인덱스로 이동
    setDragX(0);
    const nextIndex = currentIndex - 1;
    setCurrentIndex(nextIndex >= 0 ? nextIndex : -1);
  };

  return (
    <Wrapper>
      {cards.map((card, index) => {
        // 현재 최상단 카드인지 확인
        const isTop = index === currentIndex;

        return (
          <Card
            key={card.id}
            style={{
              zIndex: index,
              // 최상단 카드만 드래그 이동
              transform: isTop
                ? `translateX(${dragX}px) rotate(${dragX * 0.05}deg)`
                : "translateX(0) rotate(0)",
            }}
            // 최상단 카드에만 이벤트 적용
            onTouchStart={isTop ? handleTouchStart : undefined}
            onTouchMove={isTop ? handleTouchMove : undefined}
            onTouchEnd={isTop ? handleTouchEnd : undefined}
            onMouseDown={isTop ? handleMouseDown : undefined}
            onMouseMove={isTop ? handleMouseMove : undefined}
            onMouseUp={isTop ? handleMouseUp : undefined}
            onMouseLeave={isTop ? handleMouseLeave : undefined}
          >
            <TextContainer>
              <LabelText>{card.label}</LabelText>
              <ContextText>{card.date}</ContextText>
              <ContextText>{card.context}</ContextText>
            </TextContainer>
          </Card>
        );
      })}

      {currentIndex < 0 && <NoMoreCards>더 이상 카드가 없습니다!</NoMoreCards>}
    </Wrapper>
  );
};

export default Slider;

// --------------------
// 스타일 정의
// --------------------

const Wrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const Card = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;

  /* 원래 중앙 정렬을 위해 설정돼 있던 부분 삭제/수정:
  display: flex;
  align-items: center;
  justify-content: center; 
  */

  user-select: none; /* 드래그 중 텍스트가 선택되지 않도록 */
  cursor: grab;
`;

/** 카드 하단 왼쪽에 텍스트를 배치할 컨테이너 */
const TextContainer = styled.div`
  position: absolute;
  bottom: 20%;
  left: 10%;
  right: 15%;

  /* 원하는 스타일 */
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

/** 라벨(큰 글씨) */
const LabelText = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #333;
`;

/** 컨텍스트(작은 글씨) */
const ContextText = styled.div`
  font-size: 1.1rem;
  color: #666;
  margin-top: 2%;
`;

const NoMoreCards = styled.div`
  margin-top: 50%;
  text-align: center;
  color: #888;
`;
