import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // React Router 사용

interface CardData {
  id: string; // 고유 식별자 추가
  label: string;
  region: string;
  type: string;
  date: string;
  imageUrl: string; // 이미지 URL 추가
  from: string; // 출처 정보 추가
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
  const [allCards, setAllCards] = useState<CardData[]>([]); // 전체 데이터를 저장
  const [visibleCards, setVisibleCards] = useState<CardData[]>([]); // 화면에 보여질 카드
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const limit = 10; // 한 번에 로드할 개수

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

  // 전체 Bong 리스트를 가져오는 함수
  const fetchAllCards = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://localhost:8080/api/bong/all");
      const formattedCards = response.data.map((bong: any) => {
        const source = bong.progrmRegistNo.substring(0, 3); // 출처 구분 (앞 3글자)
        let fromValue = bong.nanmmbyNmAdmn || "미등록 사용자"; // 기본값 설정
  
        if (source === "SYO") {
          fromValue = "1365자원봉사";
        } else if (source === "VMS") {
          fromValue = "VMS사회복지";
        }
  
        return {
          id: bong.progrmRegistNo,
          label: bong.progrmSj || "제목 없음",
          region: bong.nanmmbyNm || "지역 없음",
          type: bong.srvcClCode || "상세 설명 없음",
          date: `모집마감일: ${new Date(bong.progrmEndde).toLocaleDateString()}`,
          imageUrl: `http://localhost:8080/api/bong/image/${bong.progrmRegistNo}/1`,
          from: fromValue, // 추가된 필드
        };
      });

      setAllCards(formattedCards);
      setVisibleCards(formattedCards.slice(0, limit)); // 첫 페이지 로드
      setOffset(limit);
    } catch (error) {
      console.error("Failed to fetch all Bong data:", error);
    }
    setIsLoading(false);
  };

  // 스크롤 시 추가 로딩 함수
  const loadMoreCards = () => {
    if (isLoading || offset >= allCards.length) return; // 더 불러올 데이터 없으면 중단
    setIsLoading(true);

    setTimeout(() => {
      setVisibleCards((prevCards) => [...prevCards, ...allCards.slice(offset, offset + limit)]);
      setOffset((prevOffset) => prevOffset + limit);
      setIsLoading(false);
    }, 500);
  };

  // 스크롤 감지 이벤트
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

  const navigate = useNavigate(); // navigate 함수 생성
  const handleCardClick = (progrmRegistNo: string) => {
    //navigate(`/?progrmRegistNo=${progrmRegistNo}`); // 쿼리 파라미터로 전달
    navigate(`/detail/${progrmRegistNo}`);
  };  

  useEffect(() => {
    fetchAllCards();
  }, []);

  return (
    <Wrapper ref={wrapperRef} onScroll={handleScroll}>
      {/* 상단 검색창 */}
      <StickyBox>
        <SearchBarWrapper>
          <SearchBar placeholder="검색어를 입력하세요..." />
          <FontAwesomeIcon
            icon={faSearch}
            size="lg"
            style={{ cursor: "pointer" }} // 클릭 가능하도록 설정
            onClick={() => console.log("Search icon clicked!")} // 클릭 이벤트 추가
          />
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
        {visibleCards.length > 0 ? (
          visibleCards.map((card: CardData) => (
            <Card key={card.id} onClick={() => handleCardClick(card.id)}>
              <CardImage style={{ backgroundImage: `url(${card.imageUrl})` }} />
              <Badge from={card.from}>{card.from}</Badge>
              <CardText>
                <Label>{card.label}</Label>
                <Context>{card.region}</Context>
                {/* <Context>{card.type}</Context> */}
                <DateCss>{card.date}</DateCss>
              </CardText>
            </Card>
          ))
        ) : (
          <LoadingText>봉사 데이터를 불러오는 중...</LoadingText>
        )}
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
  height: calc(100vh - 160px); /* TopBar(60px) + Navbar(60px) */
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
  justify-content: space-between; /* 양 끝으로 정렬 */
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
  padding-top: 7px; /* 위쪽 패딩 추가 */
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
  position: relative; /* ✅ 추가 */
  display: flex;
  flex-direction: row;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: box-shadow 0.3s ease;
  height: 170px; /* 고정된 높이 설정 */

  &:hover {
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  }
`;


const CardImage = styled.div`
  flex: 0 0 25%;
  height: auto;
  background-size: cover;
  background-position: center;
`;

const CardText = styled.div`
  position: absolute;
  top: 30px;
  left: 142px;
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

const Badge = styled.div<{ from: string }>`
  position: absolute;
  top: 10px;
  left: 155px;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: bold;
  color: ${({ from }) => (from === "1365자원봉사" ? "black" : "white")};
  background-color: ${({ from }) =>
    from === "1365자원봉사"
      ? "rgba(255, 215, 0, 1)" // 노란색 (1365)
      : from === "VMS사회복지"
      ? "rgba(138, 43, 226, 1)" // 보라색 (VMS)
      : from === "미등록 사용자"
      ? "rgb(218, 40, 40)" // 적색 (비 로그인)
      : "rgb(36, 177, 36)"}; // 녹색 (사용자 정의)
`;
