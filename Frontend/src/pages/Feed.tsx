import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { ThumbsUp, MessageCircle, Eye } from "lucide-react";
import axios from "axios";
import config from "../config";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Lodaing";

// ✅ 날짜 변환 함수 (몇 분 전, 몇 시간 전)
const timeAgo = (dateString: string) => {
  const postDate = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - postDate.getTime();

  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (years > 0) return `${years}년 전`;
  if (months > 0) return `${months}개월 전`;
  if (days > 0) return `${days}일 전`;
  if (hours > 0) return `${hours}시간 전`;
  if (minutes > 0) return `${minutes}분 전`;
  return "방금 전";
};

interface FeedData {
  feedID: string;
  title: string;
  author: string;
  createdAt: string;
  content: string;
  likes: number;
  comments: number;
  imageUrl: string;
  isLiked: boolean; // ✅ 추가된 부분
  category: number;
  views: number;
}

const Feed: React.FC = () => {
  const [allCards, setAllCards] = useState<FeedData[]>([]); // 전체 데이터를 저장
  const [visibleCards, setVisibleCards] = useState<FeedData[]>([]); // 화면에 보여질 카드
  const [isLoading, setIsLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const limit = 5; // 한 번에 로드할 개수
  const [isSearching, setIsSearching] = useState(true); // 검색 중 상태 추가
  const [noResults, setNoResults] = useState(false); // 결과 없음 상태 추가

  // 카테고리 목록 수정
  const categories = [
    { id: -1, label: '전체' },    // 전체 보기용 카테고리 ID를 -1로 설정
    { id: 1, label: '공지' },
    { id: 2, label: '건의' },
    { id: 3, label: '후기' },
    { id: 4, label: '자유' }
  ];

  const [selectedCategory, setSelectedCategory] = useState(-1); // 기본값을 전체(-1)로 설정

  const getUserId = (): string | null => {
    const userData = localStorage.getItem("user");
    if (!userData) return null; // ✅ 저장된 사용자 정보가 없으면 null 반환
  
    try {
      const user = JSON.parse(userData);
      return user?.id || null; // ✅ user 객체에서 ID 값 가져오기 (없으면 null)
    } catch (error) {
      console.error("사용자 정보 파싱 실패:", error);
      return null;
    }
  };

  const fetchCommentCount = async (feedID: string) => {
    try {
      const response = await axios.get(`${config.API_DEV}/api/feed/comments`, {
        params: { feedId: feedID },
      });
      return response.data.length ?? 0; // ✅ 댓글 개수 반환
    } catch (error) {
      console.error(`댓글 개수 가져오기 실패 (feedID: ${feedID}):`, error);
      return 0; // 실패하면 0 반환
    }
  };
  
  

  // ✅ API 데이터 불러오기
const fetchFeedsByCategory = async (categoryId: number) => {
  setIsSearching(true);
  try {
    const userId = getUserId();
    
    // 피드 정보 가져오기
    const feedResponse = await axios.get(`${config.API_DEV}/api/feed/list`, {
      params: { category: categoryId === -1 ? null : categoryId }
    });

    // 각 피드의 추가 정보(조회수, 좋아요 상태, 댓글 수) 가져오기
    const feedsWithDetails = await Promise.all(
      feedResponse.data.map(async (feed: FeedData) => {
        const [viewResponse, likeStatusRes, commentsCount] = await Promise.all([
          axios.get(`${config.API_DEV}/api/feed/view/${feed.feedID}/count`),
          userId
            ? axios.get(`${config.API_DEV}/api/feed/like-status`, {
                params: { userId, feedId: feed.feedID },
              })
            : Promise.resolve({ data: { isLiked: false } }),
          fetchCommentCount(feed.feedID)
        ]);

        return {
          ...feed,
          imageUrl: `${config.API_DEV}/api/bong/image/${feed.feedID}/1`,
          views: viewResponse.data,
          isLiked: likeStatusRes.data.isLiked,
          comments: commentsCount
        };
      })
    );

    setAllCards(feedsWithDetails);
    setVisibleCards(feedsWithDetails.slice(0, limit));
    setOffset(limit);
    setNoResults(feedsWithDetails.length === 0);
  } catch (error) {
    console.error("피드 로드 실패:", error);
    setNoResults(true);
  } finally {
    setIsSearching(false);
  }
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

  const handleFeedClick = (feedID: string) => {
    navigate(`/feed/${feedID}`);
  };

  const wrapperRef = useRef<HTMLDivElement>(null);

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
  
  // 카테고리 변경 핸들러
  const handleCategoryChange = (categoryId: number) => {
    setSelectedCategory(categoryId);
    setVisibleCards([]); // 기존 게시글 초기화
    setOffset(0); // 오프셋 초기화
    fetchFeedsByCategory(categoryId);
  };

  // 초기 로딩 시 전체 카테고리 데이터 불러오기
  useEffect(() => {
    fetchFeedsByCategory(-1);
  }, []);

  const navigate = useNavigate();

  // 카테고리 라벨 가져오는 함수
  const getCategoryLabel = (categoryId: number) => {
    switch (categoryId) {
      case 0: return '미분류';
      case 1: return '공지';
      case 2: return '건의';
      case 3: return '후기';
      case 4: return '자유';
      default: return '기타';
    }
  };

  return (
    <FeedWrapper ref={wrapperRef} onScroll={handleScroll}>
      <CategoryContainer>
        {categories.map(category => (
          <CategoryButton
            key={category.id}
            isSelected={selectedCategory === category.id}
            onClick={() => handleCategoryChange(category.id)}
          >
            {category.label}
          </CategoryButton>
        ))}
      </CategoryContainer>

      <FeedContainer>
        {visibleCards.length > 0 ? (
          visibleCards.map((feed: FeedData) => (
            <FeedCard key={feed.feedID} onClick={() => handleFeedClick(feed.feedID)}>
              {/* 사용자 정보 */}
              <FeedHeader>
                <UserInfo>
                  <ProfileImage src="/assets/DC.png" alt="프로필" />
                  <UserInfoText>
                    <UserName>{feed.author}</UserName>
                    <PostDate>{timeAgo(feed.createdAt)}</PostDate>
                  </UserInfoText>
                </UserInfo>
                <CategoryBadge category={feed.category}>
                  {getCategoryLabel(feed.category)}
                </CategoryBadge>
              </FeedHeader>

              <FeedImageContainer>
                  <FeedImage style={{ backgroundImage: `url(${feed.imageUrl})` }} />
              </FeedImageContainer>

              {/* 게시글 내용 */}
              <FeedContent>
                <ContentTitle>{feed.title}</ContentTitle>
                {/* <ContentText>{feed.content}</ContentText> */}
              </FeedContent>

              {/* 버튼 */}
              <FeedFooter>
                <Actions>
                  {/* 좋아요 & 댓글 버튼 (이벤트 전파 방지) */}
                  <LikeButton>
                    {feed?.isLiked ? <ThumbsUp fill="blue" /> : <ThumbsUp />}
                    <span>{feed?.likes}</span>
                  </LikeButton>
                  <CommentButton>
                    <MessageCircle />
                    <span>{feed?.comments ?? 0}</span> {/* ✅ 댓글 개수 표시 */}
                  </CommentButton>
                  <EyeButton>
                    <Eye />
                    <span>{feed?.views ?? 0}</span>
                  </EyeButton>
                </Actions>
              </FeedFooter>

            </FeedCard>
          ))
        ) : (
          <NoResultsWrapper>
            {isSearching ? (
              <Loading />
            ) : noResults ? (
              <NoResultsMessage>
                <span>표시할 피드가 없습니다 😢</span>
                <span>첫 게시글의 주인공이 되어보세요!</span>
              </NoResultsMessage>
            ) : (
              <Loading />
            )}
          </NoResultsWrapper>
        )}
      </FeedContainer>

      <FloatingButton onClick={() => navigate("/feed-write")}>+</FloatingButton>
    </FeedWrapper>
  );
};

export default Feed;

// --------------------
// 스타일 정의
// --------------------

const FeedWrapper = styled.div`
  display: flex;
  flex-direction: column; // 수직 방향으로 변경
  height: calc(100vh - 160px);
  overflow-y: auto;
`;

const FeedContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  padding-bottom: 80px; // NavBar 높이만큼 여백 추가
  width: 100%;
  max-width: 600px;
`;

const FeedCard = styled.div`
  width: 100%;
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  border: 1px solid #ddd;
  cursor: pointer; /* ✅ 마우스 올릴 때 손가락 표시 */
`;

// ✅ 사용자 정보
const FeedHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ProfileImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;

const UserInfoText = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const UserName = styled.span`
  font-weight: bold;
  font-size: 16px;
`;

const PostDate = styled.span`
  font-size: 14px;
  color: #666;
`;

// ✅ 이미지 컨테이너
const FeedImageContainer = styled.div`
  width: 100%;
  height: 200px;
  background: #f3f3f3;
`;

const FeedImage = styled.div`
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

// ✅ 좋아요 & 댓글
const FeedFooter = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 10px;
`;

const Actions = styled.div`
  display: flex;
  gap: 15px;
  font-size: 24px;
  cursor: pointer;
`;

const LikeButton = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 8px; /* ✅ 아이콘과 숫자 사이의 간격 */
`;

const CommentButton = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 8px; /* ✅ 아이콘과 숫자 사이의 간격 */
`;

const EyeButton = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 8px; /* ✅ 아이콘과 숫자 사이의 간격 */
`;

const FeedContent = styled.div`
  padding: 10px;
`;

const ContentTitle = styled.h3`
  font-size: 18px;
  font-weight: bold;
  height: 48px; /* 대략 2줄 높이 (줄 바꿈 고려) */
  line-height: 24px; /* 줄 높이를 24px로 설정 */
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* 최대 2줄 표시 */
  -webkit-box-orient: vertical;
`;

// const ContentText = styled.p`
//   font-size: 14px;
//   color: #333;
//   overflow: hidden;
//   text-overflow: ellipsis;
//   display: -webkit-box;
//   -webkit-line-clamp: 3; /* 3줄 이상 넘어가면 ... 표시 */
//   -webkit-box-orient: vertical;
// `;

const FloatingButton = styled.button`
  position: absolute; /* FeedWrapper 내부에서 배치 */
  bottom: 120px;
  right: 22px;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background-color:rgb(231, 174, 100);
  color: white;
  font-size: 38px;
  // font-weight: bold;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: background 0.3s, transform 0.2s;
  z-index: 1000;
  opacity: 0.5; /* 기본 상태에서 반투명 */

  &:hover {
    background-color:rgb(230, 141, 26);
    opacity: 1; /* 마우스를 올리면 불투명 */
  }

  &:hover::after {
    content: "글 작성하기";
    position: absolute;
    right: 75px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 6px 10px;
    border-radius: 5px;
    font-size: 16px;
    white-space: nowrap;
  }
`;

const NoResultsWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  width: 100%;
`;

const NoResultsMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #666;
  text-align: center;

  span:first-child {
    font-size: 1.2rem;
    font-weight: bold;
  }

  span:last-child {
    font-size: 1rem;
    color: #888;
  }
`;

// 새로운 스타일 컴포넌트 추가
const CategoryContainer = styled.div`
  display: flex;
  gap: 8px;
  padding: 16px;
  height: 60px; // 고정 높이
  min-height: 60px; // 최소 높이
  background: white;
  border-bottom: 1px solid #eee;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  align-items: center;
  position: sticky; // 추가: 스크롤 시 고정
  top: 0px; // 추가: TopBar 높이만큼 아래에 고정 (TopBar가 60px 높이라고 가정)
  z-index: 10; // 추가: 다른 컨텐츠 위에 표시
  
  /* 스크롤바 숨기기 */
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-scrolling: none;
  scrollbar-width: none;
`;

const CategoryButton = styled.button<{ isSelected: boolean }>`
  height: 36px; // 버튼 높이 고정
  padding: 0 16px; // 좌우 패딩만 설정
  border-radius: 20px;
  border: none;
  background-color: ${props => props.isSelected ? '#3498db' : '#f0f0f0'};
  color: ${props => props.isSelected ? 'white' : '#666'};
  font-size: 14px;
  font-weight: ${props => props.isSelected ? '600' : '400'};
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: ${props => props.isSelected ? '#2980b9' : '#e0e0e0'};
  }
`;

// 새로운 스타일 컴포넌트 추가
const CategoryBadge = styled.span<{ category: number }>`
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  
  ${props => {
    switch (props.category) {
      case 1: // 공지
        return `
          background-color: #ff4444;
          color: white;
        `;
      case 2: // 건의
        return `
          background-color: #ffbb33;
          color: white;
        `;
      case 3: // 후기
        return `
          background-color: #00C851;
          color: white;
        `;
      case 4: // 자유
        return `
          background-color: #33b5e5;
          color: white;
        `;
      default: // 미분류
        return `
          background-color: #999;
          color: white;
        `;
    }
  }}
`;
