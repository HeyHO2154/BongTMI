import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import axios from "axios"; // API 호출을 위해 axios 사용

interface CardData {
  label: string;
  region: string;
  type: string;
  date: string;
  imageUrl: string; // 이미지 URL 추가
}

const SWIPE_THRESHOLD = 200; // 스와이프 판정 기준 (px)

const Swipe: React.FC = () => {
  const [cards, setCards] = useState<CardData[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1); // 현재 최상단 카드 인덱스
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0); // 드래그 시작점

  // --------------------
  // API 호출 로직
  // --------------------
  const fetchCardData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/bong/random");
  
      const newCard: CardData = {
        label: response.data.progrmSj || "제목 없음",
        region: response.data.nanmmbyNm || "지역 없음",
        type: response.data.srvcClCode || "상세 설명 없음",
        date: `모집마감일: ${new Date(response.data.progrmEndde).toLocaleDateString()}`,
        imageUrl: `http://localhost:8080/api/bong/image/${response.data.progrmRegistNo}/1`, // 이미지 URL 추가
      };
  
      return newCard;
    } catch (error) {
      console.error("Failed to fetch card data:", error);
      return null;
    }
  };
  
  const initializeCards = async () => {
    const newCards: CardData[] = [];
    for (let i = 0; i < 5; i++) {
      const card = await fetchCardData();
      if (card) newCards.push(card);
    }
    setCards(newCards);
    setCurrentIndex(newCards.length - 1); // 마지막 카드가 최상단으로 보이게 설정
  };  

  // --------------------
  // 초기 데이터 로드
  // --------------------
  useEffect(() => {
    initializeCards();
  }, []);

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
      setDragX(0);
    }
  };


  const swipe = async (direction: "left" | "right") => {
    // 새 카드 데이터를 가져옴
    const newCard = await fetchCardData();
    if (!newCard) return; // API 호출 실패 시 중단
  
    setCards((prevCards) => {
      const updatedCards = [...prevCards]; // 기존 배열 복사
  
      // 배열을 위로 한 칸씩 이동
      for (let i = updatedCards.length - 1; i > 0; i--) {
        updatedCards[i] = updatedCards[i - 1]; // 이전 카드의 정보를 현재 위치에 복사
      }
  
      // 새 카드를 0번 인덱스에 추가
      updatedCards[0] = newCard;

      return updatedCards;
    });
  
    // 인덱스 업데이트
    setDragX(0);
    setCurrentIndex(cards.length - 1); // 항상 최상단 인덱스를 맨 마지막으로 설정
  };
  
  

  return (
    <Wrapper>
      {cards.map((card, index) => {
        const isTop = index === currentIndex;
  
        return (
          <Card
            style={{
              zIndex: index,
              backgroundImage: `url(${card.imageUrl})`, // 템플릿 리터럴로 URL 생성
              backgroundSize: "cover",
              backgroundPosition: "center",
              transform: isTop
                ? `translateX(${dragX}px) rotate(${dragX * 0.05}deg)`
                : "translateX(0) rotate(0)",
            }}
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
              <ContextText>{card.region}</ContextText>
              <ContextText>{card.type}</ContextText>
              <ContextText>{card.date}</ContextText>
            </TextContainer>
          </Card>
        );
      })}
  
      {currentIndex < 0 && <NoMoreCards>더 이상 카드가 없습니다!</NoMoreCards>}
    </Wrapper>
  );
};

export default Swipe;

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
  user-select: none;
  cursor: grab;
`;

const TextContainer = styled.div`
  position: absolute;
  bottom: 0%;
  left: 0%;
  right: 0%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background-color: rgba(0, 0, 0, 0.5); /* 반투명 검정 배경 추가 */
  padding: 30px 30px 200px 30px; /* 상, 우, 하, 좌 순서로 설정 */
  border-radius: 8px; /* 박스 모서리를 둥글게 */
`;

const LabelText = styled.div`
  font-size: 1.6rem;
  font-weight: bold;
  color: #fff; /* 흰색 텍스트 */
`;

const ContextText = styled.div`
  font-size: 1.2rem;
  color: #ddd; /* 흰색과 대비되는 밝은 회색 */
  margin-top: 2%;
`;

const NoMoreCards = styled.div`
  margin-top: 50%;
  text-align: center;
  color: #888;
`;
