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
  imageUrls: string[]; // ✅ 여러 개의 이미지 URL 저장
}

const FeedDetail: React.FC = () => {
  const { feedID } = useParams<{ feedID: string }>();
  const [feed, setFeed] = useState<FeedDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeedDetail = async () => {
      try {
        const response = await axios.get<FeedDetailData>(`${config.API_DEV}/api/feed/info?feedID=${feedID}`)

        setFeed({
          ...response.data,
          imageUrls: [
            `${config.API_DEV}/api/bong/image/${response.data.feedID}/1`,
            `${config.API_DEV}/api/bong/image/${response.data.feedID}/2`,
            `${config.API_DEV}/api/bong/image/${response.data.feedID}/3`,
          ],
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
    <Container>
      <Title>{feed.title}</Title>
      <AuthorInfo>
        <span>{feed.author}</span>
        <span>{new Date(feed.createdAt).toLocaleDateString()}</span>
      </AuthorInfo>

      {/* ✅ 여러 개의 이미지 지원 */}
      <ImageGallery>
        {feed.imageUrls.map((imageUrl, index) => (
          <FeedImage key={index} src={imageUrl} alt={`이미지 ${index + 1}`} />
        ))}
      </ImageGallery>

      <Content>{feed.content}</Content>

      {/* 좋아요 & 댓글 버튼 (UI만) */}
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

      {/* 댓글 UI 추가 */}
      <CommentSection>
        <CommentTitle>댓글</CommentTitle>
        <CommentInput placeholder="댓글을 입력하세요..." />
        <CommentList>
          {/* 여기에 나중에 댓글 데이터 추가 가능 */}
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
    </Container>
  );
};

export default FeedDetail;

// 스타일 정의
const Container = styled.div`
  padding: 16px;
  max-width: 600px;
  margin: auto;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
`;

const AuthorInfo = styled.div`
  font-size: 14px;
  color: #555;
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
`;

// ✅ 여러 개의 이미지가 표시될 갤러리
const ImageGallery = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 16px;
`;

const FeedImage = styled.img`
  width: 100%;
  border-radius: 8px;
`;

const Content = styled.p`
  font-size: 16px;
  margin-top: 12px;
`;

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

const CommentSection = styled.div`
  margin-top: 20px;
`;

const CommentTitle = styled.h2`
  font-size: 18px;
`;

const CommentInput = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-top: 8px;
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
