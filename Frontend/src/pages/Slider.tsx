// src/pages/Slider.tsx
import React, { useState, useRef } from "react";
import styled from "styled-components";

interface CardData {
  id: number;
  label: string;
}

const initialCards: CardData[] = [
  { id: 1, label: "배추" },
  { id: 2, label: "감자" },
  { id: 3, label: "오이" },
  { id: 4, label: "토마토" },
  { id: 5, label: "당근" },
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
            {card.label}
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
  flex: 1;           /* flex 아이템이 남은 공간을 차지 */
  display: flex;     /* 혹은 내부 레이아웃도 flex로 쓸 수 있음 */
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
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  /* 텍스트 중앙 배치 */
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;

  user-select: none; /* 드래그 중 텍스트가 선택되지 않도록 */
  cursor: grab;
`;

const NoMoreCards = styled.div`
  margin-top: 20px;
  text-align: center;
  color: #888;
`;
