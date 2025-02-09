import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { ThumbsUp, MessageCircle, MoreHorizontal } from "lucide-react";
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
  isLiked: boolean; // ✅ 사용자별 좋아요 상태 추가
}

const Feed: React.FC = () => {
  const [allCards, setAllCards] = useState<FeedData[]>([]); // 전체 데이터를 저장
  const [visibleCards, setVisibleCards] = useState<FeedData[]>([]); // 화면에 보여질 카드
  const [isLoading, setIsLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const limit = 5; // 한 번에 로드할 개수

  // ✅ API 데이터 불러오기
  const fetchFeeds = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${config.API_DEV}/api/feed/all`);
      const allFeeds = response.data;
  
      // ✅ 현재 로그인한 사용자 (실제 로그인 값으로 변경 필요)
      const userId = "testUser";
  
      // ✅ 각 피드의 좋아요 상태 확인 요청 (비동기 병렬 실행)
      const likeStatusPromises = allFeeds.map(async (feed: FeedData) => {
        const likeStatusRes = await axios.get(`${config.API_DEV}/api/feed/like-status`, {
          params: { userId, feedId: feed.feedID },
        });
        return { ...feed, isLiked: likeStatusRes.data.isLiked };
      });
  
      const updatedFeeds = await Promise.all(likeStatusPromises);
      setAllCards(updatedFeeds);
      setVisibleCards(updatedFeeds.slice(0, limit));
      setOffset(limit);
    } catch (error) {
      console.error("데이터 로드 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchFeeds();
  }, []); // ✅ 페이지가 처음 로드될 때 실행
  

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

  const handleFeedClick = (e: React.MouseEvent<HTMLDivElement>, feedID: string) => {
    e.stopPropagation(); // ✅ 좋아요 & 댓글 클릭 시 이동 방지
    navigate(`/feed/${feedID}`);
  };

  const handleLike = async (e: React.MouseEvent<HTMLDivElement>, feedID: string) => {
    e.stopPropagation(); // 클릭 이벤트 전파 방지
  
    try {
      // 현재 피드의 상태 확인
      const targetFeed = allCards.find(feed => feed.feedID === feedID);
      if (!targetFeed) return;
  
      const newLikeStatus = !targetFeed.isLiked; // ✅ 좋아요 상태 반전
      const action = newLikeStatus ? 1 : 0; // ✅ 1 = 좋아요, 0 = 취소
  
      // 백엔드로 좋아요/취소 요청
      await axios.post(`${config.API_DEV}/api/feed/like`, null, {
        params: { userId: "testUser", feedId: feedID, action },
      });
  
      // ✅ UI 업데이트
      setAllCards(prevCards =>
        prevCards.map(card =>
          card.feedID === feedID
            ? { ...card, isLiked: newLikeStatus, likes: card.likes + (newLikeStatus ? 1 : -1) }
            : card
        )
      );
    } catch (error) {
      console.error("좋아요 처리 실패:", error);
    }
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

  const navigate = useNavigate();

  return (
    <FeedWrapper ref={wrapperRef} onScroll={handleScroll}>
      <FeedContainer>
        {visibleCards.map((feed: FeedData) => (
          <FeedCard key={feed.feedID} onClick={(e) => handleFeedClick(e, feed.feedID)}>
            {/* 사용자 정보 */}
            <FeedHeader>
              <Profile>
                <ProfileImage src="/assets/DC.png" alt="디시인사이드" />
                <Author>
                  {feed.author} <TimeAgo>{timeAgo(feed.createdAt)}</TimeAgo>
                </Author>
              </Profile>
              <MoreHorizontal />
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
                <LikeButton onClick={(e) => handleLike(e, feed.feedID)} style={{ color: feed.isLiked ? "blue" : "black" }}>
                  <ThumbsUp />
                  <LikeCount>{feed.likes}</LikeCount>
                </LikeButton>
                <CommentButton>
                  <MessageCircle />
                  <CommentCount>{feed.comments}</CommentCount>
                </CommentButton>
              </Actions>
            </FeedFooter>

          </FeedCard>
        ))}

        {isLoading && <LoadingText><Loading/></LoadingText>}
      </FeedContainer>

        {/* 글 작성하기 버튼 */}
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
  justify-content: center;
  align-items: flex-start;
  height: calc(100vh - 160px); /* TopBar + NavBar 높이 제외 */
  overflow-y: auto;
`;

const FeedContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
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
  padding: 10px;
`;

const Profile = styled.div`
  display: flex;
  align-items: center;
`;

const ProfileImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
`;

const Author = styled.span`
  font-weight: bold;
  display: flex;
  align-items: center;
`;

const TimeAgo = styled.span`
  font-size: 12px;
  color: gray;
  margin-left: 5px;
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
`;

const LikeCount = styled.span`
  font-size: 16px;
  margin-left: 5px;
`;

const CommentButton = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const CommentCount = styled.span`
  font-size: 16px;
  margin-left: 5px;
`;

const LoadingText = styled.div`
  text-align: center;
  color: #888;
  margin-top: 16px;
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
