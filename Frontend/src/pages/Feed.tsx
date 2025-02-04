import React, { useState, useEffect, useRef, useCallback } from "react";
import styled from "styled-components";
import { ThumbsUp, MessageCircle, MoreHorizontal } from "lucide-react";
import axios from "axios";
import config from "../config";

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
  id: string;
  title: string;
  author: string;
  createdAt: string;
  content: string;
  likes: number;
  comments: number;
  imageUrl?: string;
  profileUrl?: string;
}

const Feed: React.FC = () => {
  const [feeds, setFeeds] = useState<FeedData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const pageRef = useRef(1);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastFeedElementRef = useRef<HTMLDivElement | null>(null);

  // ✅ API 데이터 불러오기
  const fetchFeeds = useCallback(async () => {
    if (!hasMore || isLoading) return;

    setIsLoading(true);
    try {
      const response = await axios.get(`${config.API_DEV}/api/feeds?page=${pageRef.current}&size=10`);
      const newFeeds = response.data;

      if (newFeeds.length === 0) {
        setHasMore(false);
      } else {
        // ✅ 이미지 URL 로드
        const feedsWithImages = newFeeds.map((feed: FeedData) => ({
          ...feed,
          imageUrl: feed.imageUrl || "https://source.unsplash.com/500x500/?random", // 기본 이미지 적용
          profileUrl: feed.profileUrl || "https://source.unsplash.com/50x50/?face", // 기본 프로필 이미지 적용
        }));

        setFeeds((prev) => [...prev, ...feedsWithImages]);
        pageRef.current += 1;
      }
    } catch (error) {
      console.error("데이터 로드 실패:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore]);

  // ✅ 최초 1회 실행
  useEffect(() => {
    fetchFeeds();
  }, []);

  // ✅ 무한 스크롤 이벤트 감지
  useEffect(() => {
    if (!hasMore) return;

    const observerCallback: IntersectionObserverCallback = (entries) => {
      if (entries[0].isIntersecting) {
        fetchFeeds();
      }
    };

    observer.current = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: "100px",
      threshold: 1.0,
    });

    if (lastFeedElementRef.current) {
      observer.current.observe(lastFeedElementRef.current);
    }

    return () => observer.current?.disconnect();
  }, [fetchFeeds, hasMore]);

  return (
    <FeedWrapper>
      <FeedContainer>
        {feeds.map((feed, index) => (
          <FeedCard key={feed.id} ref={index === feeds.length - 1 ? lastFeedElementRef : null}>
            {/* 사용자 정보 */}
            <FeedHeader>
              <Profile>
                <ProfileImage src={feed.profileUrl} alt="Profile" />
                <Author>
                  {feed.author} <TimeAgo>{timeAgo(feed.createdAt)}</TimeAgo>
                </Author>
              </Profile>
              <MoreHorizontal />
            </FeedHeader>

            {/* 이미지 */}
            <FeedImageContainer>
              <FeedImage src={feed.imageUrl} alt="Feed Image" />
            </FeedImageContainer>

            {/* 버튼 */}
            <FeedFooter>
              <Actions>
                <LikeButton>
                  <ThumbsUp />
                  <LikeCount>{feed.likes}</LikeCount>
                </LikeButton>
                <CommentButton>
                  <MessageCircle />
                  <CommentCount>{feed.comments}</CommentCount>
                </CommentButton>
              </Actions>
            </FeedFooter>

            {/* 게시글 내용 */}
            <FeedContent>
              <ContentTitle>{feed.title}</ContentTitle>
              <ContentText>{feed.content}</ContentText>
            </FeedContent>
          </FeedCard>
        ))}

        {isLoading && <LoadingText>로딩 중...</LoadingText>}
      </FeedContainer>
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
  height: 100vh;
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
  height: 400px;
  background: #f3f3f3;
`;

const FeedImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
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
