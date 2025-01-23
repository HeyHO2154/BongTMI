import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons"; // FontAwesomeIcon 아이콘 사용

const SearchBar: React.FC = () => {
  return (
    <SearchBarWrapper>
      <SearchInputWrapper>
        <FontAwesomeIcon icon={faSearch} size="lg" style={{ marginRight: "8px", color: "#888" }} />
        <SearchInput placeholder="검색어를 입력하세요..." />
      </SearchInputWrapper>
    </SearchBarWrapper>
  );
};

export default SearchBar;

// --------------------
// 스타일 정의
// --------------------
const SearchBarWrapper = styled.div`
  position: sticky;
  top: 0; /* 상단 고정 */
  z-index: 10; /* 다른 요소 위로 표시 */
  background-color: #fff;
  border-bottom: 1px solid #ddd;
  padding: 10px 16px;
  width: 100%;
`;

const SearchInputWrapper = styled.div`
  display: flex;
  align-items: center;
  background-color: #f9f9f9;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 8px 12px;
  width: 100%;
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  background-color: transparent;
  font-size: 1rem;
`;
