import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios"; // API 호출을 위해 axios 사용

interface CardData {
  id: number;
  label: string;
  date: string;
  context: string;
}

const Search: React.FC = () => {
  const [cards, setCards] = useState<CardData[]>([]); // 공고 목록
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태
  const [hasMore, setHasMore] = useState(true); // 더 가져올 데이터가 있는지 여부

  // --------------------
  // API 호출 로직
  // --------------------
  const fetchCardData = async (count: number = 5) => {
    try {
      const newCards: CardData[] = [];
      for (let i = 0; i < count; i++) {
        const response = await axios.get("http://localhost:8080/api/bong/random");
        const card = {
          id: Math.random(),
          label: response.data.progrmSj,
          date: `모집마감일`,
          context: response.data.progrmCn || "상세 설명 없음",
        };
        newCards.push(card);
      }
      return newCards;
    } catch (error) {
      console.error("Failed to fetch card data:", error);
      return [];
    }
  };

  // --------------------
  // 초기 데이터 로드
  // --------------------
  useEffect(() => {
    const initializeCards = async () => {
      setIsLoading(true);
      const initialCards = await fetchCardData(10); // 처음에 10개 로드
      setCards(initialCards);
      setIsLoading(false);
    };
    initializeCards();
  }, []);

  // --------------------
  // 무한 스크롤 로직
  // --------------------
  const loadMoreCards = async () => {
    if (isLoading || !hasMore) return; // 이미 로딩 중이거나 데이터가 없으면 중단
    setIsLoading(true);
    const newCards = await fetchCardData(5); // 추가로 5개 로드
    if (newCards.length === 0) {
      setHasMore(false); // 더 이상 데이터가 없으면 상태 업데이트
    } else {
      setCards((prevCards) => [...prevCards, ...newCards]); // 새 데이터를 기존 목록에 추가
    }
    setIsLoading(false);
  };

  // --------------------
  // 스크롤 이벤트 핸들러
  // --------------------
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 100 && !isLoading) {
      loadMoreCards(); // 스크롤이 하단 근처에 도달하면 데이터 추가 로드
    }
  };

  return (
    <Wrapper onScroll={handleScroll}>
        {cards.map((card, index) => (
          <Card key={card.id}>
            <Label>{card.label}</Label>
            <Date>{card.date}</Date>
            <Context>{card.context}</Context>
          </Card>
        ))}
        {isLoading && <LoadingText>로딩 중...</LoadingText>}
        {!hasMore && <EndText>더 이상 공고가 없습니다.</EndText>}
    </Wrapper>
  );  
};

export default Search;

// --------------------
// 스타일 정의
// --------------------

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  overflow-y: scroll; /* 스크롤 활성화 */
  padding: 16px;
  background-color: #f9f9f9;
`;

const Card = styled.div`
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Label = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
`;

const Date = styled.div`
  font-size: 0.9rem;
  color: #777;
  margin-top: 4px;
`;

const Context = styled.div`
  font-size: 1rem;
  color: #555;
  margin-top: 8px;
`;

const LoadingText = styled.div`
  text-align: center;
  color: #777;
  margin-top: 16px;
`;

const EndText = styled.div`
  text-align: center;
  color: #aaa;
  margin-top: 16px;
`;

