import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import axios from "axios"; // API 호출을 위해 axios 사용
import { useNavigate } from "react-router-dom"; // React Router 사용
import DetailBong from "./Bong/DetailBong"; // DetailBong 컴포넌트 임포트

interface CardData {
  id: string; // 고유 식별자 추가
  label: string;
  region: string;
  type: string;
  date: string;
  imageUrl: string; // 이미지 URL 추가
}

const SWIPE_THRESHOLD_X = 200; // 스와이프 판정 기준 (px)
const SWIPE_THRESHOLD_Y = 300; // 스와이프 판정 기준 (px)

const Swipe: React.FC = () => {
  const [cards, setCards] = useState<CardData[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1); // 현재 최상단 카드 인덱스
  const [dragX, setDragX] = useState(0); // X축 드래그 상태
  const [dragY, setDragY] = useState(0); // Y축 드래그 상태
  const [isDragging, setIsDragging] = useState(false); // 드래그 상태 여부
  const startX = useRef(0); // 드래그 시작점 X
  const startY = useRef(0); // 드래그 시작점 Y

  const navigate = useNavigate(); // navigate 함수 생성

  // --------------------
  // API 호출 로직
  // --------------------
  const fetchCardData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/bong/random");
  
      const newCard: CardData = {
        id: response.data.progrmRegistNo, // 고유 id 추가
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
    startY.current = e.clientY;
    setDragX(0);
    setDragY(0);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    const currentX = e.clientX;
    const currentY = e.clientY;

    const deltaX = currentX - startX.current;
    const deltaY = currentY - startY.current;

    // 좌우 또는 상하 스와이프 처리
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // 좌우 스와이프
      setDragX(deltaX);
      setDragY(0); // 상하 초기화
    } else {
      // 상하 스와이프
      if (deltaY < 0) {
        // 위로 스와이프만 허용
        setDragY(deltaY);
        setDragX(0); // 좌우 초기화
      }
    }
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
    if (dragY < -SWIPE_THRESHOLD_Y && currentIndex >= 0) {
      const progrmRegistNo = cards[currentIndex].id;
      console.log("Navigating to:", `/detail/${progrmRegistNo}`); // 로그 확인
      navigate(`/detail/${progrmRegistNo}`);
    } else if (dragX > SWIPE_THRESHOLD_X) {
      swipe("right");
    } else if (dragX < -SWIPE_THRESHOLD_X) {
      swipe("left");
    } else {
      setDragX(0);
      setDragY(0);
    }
  };
  
  const swipe = async (direction: "left" | "right") => {
    console.log(direction);
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
    setDragY(0);
    setCurrentIndex(cards.length - 1); // 항상 최상단 인덱스를 맨 마지막으로 설정
  };
  
  return (
    <Wrapper>
      {cards.map((card, index) => {
        const isTop = index === currentIndex;

        return (
          <Card
            key={card.id}
            style={{
              zIndex: index,
              backgroundImage: `url(${card.imageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              transform: isTop
                ? Math.abs(dragX) > Math.abs(dragY)
                  ? `translateX(${dragX}px) rotate(${dragX * 0.05}deg)` // 좌우 스와이프
                  : `translateY(${dragY}px)` // 상하 스와이프
                : `translateY(0px)`, // 상하 스와이프 - 모든 카드가 같이 이동X
              transition: isDragging ? "none" : "transform 0.3s ease",
            }}
            onTouchStart={isTop ? handleTouchStart : undefined}
            onTouchMove={isTop ? handleTouchMove : undefined}
            onTouchEnd={isTop ? handleTouchEnd : undefined}
            onMouseDown={isTop ? handleMouseDown : undefined}
            onMouseMove={isTop ? handleMouseMove : undefined}
            onMouseUp={handleMouseUp}
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
  border-radius: 0px; /* 카드 모서리를 둥글게 */
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
  padding: 30px 30px 160px 30px; /* 상, 우, 하, 좌 순서로 설정 */
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
