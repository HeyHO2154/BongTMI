// src/pages/FeedDetail.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { ThumbsUp, MessageCircle } from "lucide-react";
import config from "../../config";
import Loading from "../../components/Lodaing";

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

interface FeedDetailData {
  feedID: string;
  title: string;
  author: string;
  createdAt: string;
  content: string;
  likes: number;
  comments: number;
  imageUrls: string[];
  isLiked: boolean;
}

const FeedDetail: React.FC = () => {
  const { feedID } = useParams<{ feedID: string }>();
  const [feed, setFeed] = useState<FeedDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeedDetail = async () => {
      try {
        const response = await axios.get<FeedDetailData>(`${config.API_DEV}/api/feed/info?feedID=${feedID}`);
    
        // ✅ 사용자의 좋아요 상태 확인
        const likeStatusRes = await axios.get(`${config.API_DEV}/api/feed/like-status`, {
          params: { userId: "testUser123", feedId: feedID },
        });
    
        setFeed({
          ...response.data,
          imageUrls: [`${config.API_DEV}/api/bong/image/${response.data.feedID}/1`],
          isLiked: likeStatusRes.data.isLiked, // ✅ isLiked 추가
        });
      } catch (error) {
        console.error("피드 로드 실패:", error);
        setError("게시글을 불러오는 데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };
    

    if (feedID) fetchFeedDetail();
  }, [feedID]);

  const handleLike = async (e: React.MouseEvent<HTMLButtonElement >) => {
    e.stopPropagation(); // ✅ 클릭 이벤트 전파 방지
  
    if (!feed) return;
  
    try {
      const newLikeStatus = !feed.isLiked; // ✅ 현재 상태 반전
      const action = newLikeStatus ? 1 : 0; // ✅ 1 = 좋아요, 0 = 좋아요 취소
  
      // ✅ 백엔드 API 요청
      const response = await axios.post(`${config.API_DEV}/api/feed/like`, null, {
        params: { userId: "testUser123", feedId: feed.feedID, action },
      });
  
      if (response.status === 200) {
        const updatedLikes = response.data.likes; // ✅ 최신 좋아요 개수 가져오기
  
        // ✅ 상태 업데이트 (isLiked + 좋아요 개수 업데이트)
        setFeed(prevFeed => {
          if (!prevFeed) return prevFeed; // ✅ prevFeed가 없으면 변경하지 않음
        
          return {
            ...prevFeed,
            isLiked: newLikeStatus, // ✅ 좋아요 상태 업데이트
            likes: updatedLikes !== undefined ? updatedLikes : prevFeed.likes // ✅ likes 값이 undefined이면 기존 값 유지
          };
        });
        
      }
    } catch (error) {
      console.error("좋아요 처리 실패:", error);
    }
  };
  

  if (isLoading) return <LoadingText><Loading/></LoadingText>;
  if (error) return <ErrorText>{error}</ErrorText>;
  if (!feed) return <ErrorText>feedID: {feedID}, 데이터가 없습니다.</ErrorText>;

  return (
    <Wrapper>
      {/* 피드 이미지 (전체 화면) */}
      {feed.imageUrls[0] && <FeedImage src={feed.imageUrls[0]} alt="게시물 이미지" />}

      <FeedContent>
        {/* 작성자 및 날짜 */}
        <FeedHeader>
          <ProfileImage src="/assets/DC.png" alt="프로필 이미지" />
          <ProfileInfo>
            <Author>{feed.author}</Author>
            <TimeAgoText>{timeAgo(feed.createdAt)}</TimeAgoText>
          </ProfileInfo>
        </FeedHeader>

        {/* 제목 및 내용 */}
        <Title>{feed.title}</Title>
        <Content>{feed.content}</Content>

        {/* 좋아요 & 댓글 버튼 */}
        <Actions>
          <ActionButton onClick={(e) => handleLike(e)}>
            {feed?.isLiked ? <ThumbsUp fill="blue" /> : <ThumbsUp />}
            <span>{feed?.likes}</span>
          </ActionButton>



          <ActionButton>
            <MessageCircle />
            <span>{feed.comments}</span>
          </ActionButton>
        </Actions>

        {/* 댓글 UI */}
        <CommentSection>
          <CommentTitle>댓글</CommentTitle>
          <CommentInput placeholder="댓글을 입력하세요..." />
          <CommentList>
            <CommentItem>
              <CommentAuthor>사용자1</CommentAuthor>
              <CommentText>좋은 글이네요!</CommentText>
            </CommentItem>
            <CommentItem>
              <CommentAuthor>사용자2</CommentAuthor>
              <CommentText>감사합니다!</CommentText>
            </CommentItem>
          </CommentList>
        </CommentSection>
      </FeedContent>
    </Wrapper>
  );
};

export default FeedDetail;

// --------------------
// 스타일 정의
// --------------------

/* ✅ 전체 화면 적용 */
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow-y: auto;
`;

/* ✅ 전체 화면을 차지하는 피드 이미지 */
const FeedImage = styled.img`
  width: 100%;
  max-height: 50vh;
  object-fit: cover;
`;

/* ✅ 본문 컨텐츠 */
const FeedContent = styled.div`
  padding: 16px;
  flex: 1;
`;

/* ✅ 피드 작성자 정보 */
const FeedHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
`;

const ProfileImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const Author = styled.span`
  font-weight: bold;
  font-size: 16px;
`;

const TimeAgoText = styled.span`
  font-size: 12px;
  color: gray;
`;

/* ✅ 제목 */
const Title = styled.h1`
  font-size: 22px;
  font-weight: bold;
  margin-top: 10px;
`;

/* ✅ 본문 내용 */
const Content = styled.p`
  font-size: 16px;
  margin-top: 12px;
  line-height: 1.6;
`;

/* ✅ 좋아요 & 댓글 버튼 */
const Actions = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 12px;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
`;

/* ✅ 댓글 섹션 */
const CommentSection = styled.div`
  margin-top: 20px;
`;

const CommentTitle = styled.h2`
  font-size: 18px;
  margin-bottom: 10px;
`;

const CommentInput = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const CommentList = styled.div`
  margin-top: 12px;
`;

const CommentItem = styled.div`
  padding: 8px;
  border-bottom: 1px solid #ddd;
`;

const CommentAuthor = styled.span`
  font-weight: bold;
  font-size: 14px;
`;

const CommentText = styled.p`
  font-size: 14px;
  margin-top: 4px;
`;

const LoadingText = styled.div`
  text-align: center;
  margin-top: 20px;
`;

const ErrorText = styled.div`
  text-align: center;
  color: red;
  margin-top: 20px;
`;
