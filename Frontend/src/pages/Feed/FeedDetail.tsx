// src/pages/FeedDetail.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { ThumbsUp, MessageCircle } from "lucide-react";
import config from "../../config";

interface FeedDetailData {
  feedID: string;
  title: string;
  author: string;
  createdAt: string;
  content: string;
  likes: number;
  comments: number;
  imageUrls: string[];
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

        setFeed({
          ...response.data,
          imageUrls: [`${config.API_DEV}/api/bong/image/${response.data.feedID}/1`], // ✅ 1번 이미지만 사용
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

  if (isLoading) return <LoadingText>로딩 중...</LoadingText>;
  if (error) return <ErrorText>{error}</ErrorText>;
  if (!feed) return <ErrorText>feedID: {feedID}, 데이터가 없습니다.</ErrorText>;

  return (
    <Wrapper>
      <FeedCard>
        <FeedHeader>
          <ProfileImage src="/assets/BongTMI1.png" alt="프로필 이미지" />
          <ProfileInfo>
            <Author>{feed.author}</Author>
            <TimeAgo>{new Date(feed.createdAt).toLocaleDateString()}</TimeAgo>
          </ProfileInfo>
        </FeedHeader>

        {/* ✅ 1번 이미지만 표시 */}
        {feed.imageUrls[0] && <FeedImage src={feed.imageUrls[0]} alt="게시물 이미지" />}

        <Content>{feed.content}</Content>

        <Actions>
          <ActionButton>
            <ThumbsUp />
            <span>{feed.likes}</span>
          </ActionButton>
          <ActionButton>
            <MessageCircle />
            <span>{feed.comments}</span>
          </ActionButton>
        </Actions>

        {/* ✅ 댓글 UI 추가 (SNS 스타일) */}
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
      </FeedCard>
    </Wrapper>
  );
};

export default FeedDetail;

// --------------------
// 스타일 정의
// --------------------

// 전체 페이지 감싸는 컨테이너
const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* ✅ 전체 화면 높이 */
  padding: 16px;
  overflow-y: auto; /* ✅ 스크롤 가능하도록 설정 */
`;

// SNS 스타일의 피드 카드
const FeedCard = styled.div`
  width: 100%;
  max-width: 600px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 16px;
`;

// 피드 헤더 (프로필 정보)
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

const TimeAgo = styled.span`
  font-size: 12px;
  color: gray;
`;

// 이미지 (한 장만 표시)
const FeedImage = styled.img`
  width: 100%;
  border-radius: 8px;
  margin-top: 8px;
`;

// 본문 내용
const Content = styled.p`
  font-size: 16px;
  margin-top: 12px;
`;

// 좋아요 & 댓글 버튼
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

// 댓글 섹션
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
