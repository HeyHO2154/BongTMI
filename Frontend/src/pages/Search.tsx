import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";


interface CardData {
  label: string;
  region: string;
  type: string;
  date: string;
  imageUrl: string; // 이미지 URL 추가
}

interface FilterState {
  srvcClCode: string; // 봉사 분야
  progrmSttusSe: string; // 모집 상태
  adultPosblAt: boolean; // 성인 가능 여부
  noticeStartDate: string; // 모집 시작일
  noticeEndDate: string; // 모집 종료일
  sidoCd: string; // 시도 코드
  gugunCd: string; // 시군구 코드
}

const Search: React.FC = () => {
  const [cards, setCards] = useState<CardData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFilterVisible, setIsFilterVisible] = useState(false); // 상세검색 토글 상태
  const [filters, setFilters] = useState<FilterState>({
    srvcClCode: "",
    progrmSttusSe: "",
    adultPosblAt: false,
    noticeStartDate: "",
    noticeEndDate: "",
    sidoCd: "",
    gugunCd: "",
  });

  const wrapperRef = useRef<HTMLDivElement>(null);

  const fetchCardData = async (): Promise<CardData | null> => {
    try {
      const response = await axios.get("http://localhost:8080/api/bong/random");
      return {
        label: response.data.progrmSj || "제목 없음",
        region: response.data.nanmmbyNm || "지역 없음",
        type: response.data.srvcClCode || "상세 설명 없음",
        date: `모집마감일: ${new Date(
          response.data.progrmEndde
        ).toLocaleDateString()}`,
        imageUrl: `http://localhost:8080/api/bong/image/${response.data.progrmRegistNo}/1`,
      };
    } catch (error) {
      console.error("Failed to fetch card data:", error);
      return null;
    }
  };

  const loadMoreCards = async () => {
    if (isLoading) return;
    setIsLoading(true);
    const newCards: CardData[] = [];
    for (let i = 0; i < 5; i++) {
      const card = await fetchCardData();
      if (card) newCards.push(card);
    }
    setCards((prevCards) => [...prevCards, ...newCards]);
    setIsLoading(false);
  };

  const handleScroll = () => {
    const wrapper = wrapperRef.current;
    if (wrapper) {
      const { scrollTop, scrollHeight, clientHeight } = wrapper;
      if (scrollTop + clientHeight >= scrollHeight - 100) {
        loadMoreCards();
      }
    }
  };

  const handleFilterChange = (
    key: keyof FilterState,
    value: string | boolean
  ) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
  };

  useEffect(() => {
    loadMoreCards();
  }, []);

  return (
    <Wrapper ref={wrapperRef} onScroll={handleScroll}>
      {/* 상단 검색창 */}
      <StickyBox>
        <SearchBarWrapper>
          <FontAwesomeIcon icon={faSearch} size="lg" />
          <SearchBar placeholder="검색어를 입력하세요..." />
        </SearchBarWrapper>
        <FilterToggle onClick={() => setIsFilterVisible(!isFilterVisible)}>
          <FontAwesomeIcon icon={isFilterVisible ? faChevronUp : faChevronDown} size="sm" />
          <ToggleText>상세검색</ToggleText>
        </FilterToggle>
        {isFilterVisible && (
          <FilterWrapper>
          <FilterLabel>봉사 분야</FilterLabel>
          <FilterSelect
            value={filters.srvcClCode}
            onChange={(e) => handleFilterChange("srvcClCode", e.target.value)}
          >
            <option value="">전체</option>
            <option value="0100">급식지원</option>
            <option value="0199">생활편의지원</option>
          </FilterSelect>
        
          <FilterLabel>모집 상태</FilterLabel>
          <FilterSelect
            value={filters.progrmSttusSe}
            onChange={(e) =>
              handleFilterChange("progrmSttusSe", e.target.value)
            }
          >
            <option value="">전체</option>
            <option value="1">모집대기</option>
            <option value="2">모집중</option>
            <option value="3">모집완료</option>
          </FilterSelect>
        
          <FilterLabel>성인 여부</FilterLabel>
          <CheckboxWrapper>
            <CheckboxLabel>
              <input
                type="checkbox"
                checked={filters.adultPosblAt}
                onChange={(e) =>
                  handleFilterChange("adultPosblAt", e.target.checked)
                }
              />
              가능
            </CheckboxLabel>
          </CheckboxWrapper>
        
          <FilterLabel>봉사 기간</FilterLabel>
          <DateWrapper>
            <DateInput
              type="date"
              value={filters.noticeStartDate}
              onChange={(e) =>
                handleFilterChange("noticeStartDate", e.target.value)
              }
            />
            <DateSeparator>~</DateSeparator>
            <DateInput
              type="date"
              value={filters.noticeEndDate}
              onChange={(e) =>
                handleFilterChange("noticeEndDate", e.target.value)
              }
            />
          </DateWrapper>
        
          <FilterLabel>지역</FilterLabel>
          <FilterSelect
            value={filters.sidoCd}
            onChange={(e) => handleFilterChange("sidoCd", e.target.value)}
          >
            <option value="">지역 선택</option>
            <option value="6110000">서울특별시</option>
            <option value="6230000">부산광역시</option>
            <option value="6410000">경기도</option>
            <option value="6420000">강원도</option>
            <option value="6510000">대구광역시</option>
          </FilterSelect>
        </FilterWrapper>        
        )}
      </StickyBox>

      {/* 카드 리스트 */}
      <CardList>
        {cards.map((card) => (
          <Card>
            <CardImage style={{ backgroundImage: `url(${card.imageUrl})` }} />
            <CardText>
              <Label>{card.label}</Label>
              <Context>{card.region}</Context>
              <Context>{card.type}</Context>
              <DateCss>{card.date}</DateCss>
            </CardText>
          </Card>
        ))}
      </CardList>
      {isLoading && <LoadingText>Loading...</LoadingText>}
    </Wrapper>
  );
};

export default Search;

// --------------------
// 스타일 정의
// --------------------

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 60px);
  box-sizing: border-box;
  overflow-y: auto;
`;

const StickyBox = styled.div`
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: #fff;
  padding: 16px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SearchBar = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-size: 1rem;
`;


const SearchBarWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 8px;
  background-color: #fff;
`;

const FilterToggle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #555;
  font-size: 1rem;

  &:hover {
    color: #007bff;
  }
`;

const ToggleText = styled.span`
  font-size: 0.9rem;
  font-weight: bold;
`;

const FilterWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

const FilterLabel = styled.label`
  font-size: 0.9rem;
  font-weight: bold;
`;

const FilterSelect = styled.select`
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.9rem;
  background-color: #f9f9f9;
`;

const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CheckboxLabel = styled.label`
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const DateWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const DateInput = styled.input`
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.9rem;
`;

const DateSeparator = styled.span`
  font-size: 1rem;
  color: #666;
`;

const CardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Card = styled.div`
  display: flex;
  flex-direction: row;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
`;

const CardImage = styled.div`
  flex: 0 0 25%;
  height: auto;
  background-size: cover;
  background-position: center;
`;

const CardText = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 16px;
`;

const Label = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
`;

const Context = styled.div`
  font-size: 1rem;
  color: #666;
  margin-top: 8px;
`;

const DateCss = styled.div`
  font-size: 0.9rem;
  color: #999;
  margin-top: 4px;
`;

const LoadingText = styled.div`
  text-align: center;
  color: #888;
  margin-top: 16px;
`;
