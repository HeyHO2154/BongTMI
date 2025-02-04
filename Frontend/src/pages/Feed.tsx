import React, { useState } from "react";
import styled from "styled-components";
import { Heart, Send } from "lucide-react";

interface FeedData {
  id: string;
  title: string;
  author: string;
  createdAt: string;
  content: string;
  likes: number;
  views: number;
}

const dummyFeeds: FeedData[] = [
  {
    id: "DCI1051229",
    title: "근데 차민은 비수기에 하면 남는게 있음?",
    author: "user1",
    createdAt: "2025-02-04 13:38:17",
    content: "길게보면 걍 무료봉사라던데.",
    likes: 10,
    views: 150,
  },
  {
    id: "DCI1111473",
    title: "지랄은 오브젝트 강타는 무조건 정글 소양이지",
    author: "user2",
    createdAt: "2025-02-04 13:47:47",
    content: "그게 존재이유인데 그것조차 못하면 정글을 왜 함?",
    likes: 5,
    views: 80,
  },
  {
    id: "DCI1351901",
    title: "봉사랑 헌혈안해서 일반기술은 광탈이여도",
    author: "user3",
    createdAt: "2025-02-04 13:38:17",
    content: "일반기술말고 기계로는 못가나?",
    likes: 20,
    views: 200,
  },
  {
    id: "DCI1400001",
    title: "게임 밸런스 왜이래?",
    author: "user4",
    createdAt: "2025-02-04 14:00:00",
    content: "이게 말이 되냐고...",
    likes: 12,
    views: 250,
  },
];

const Feed: React.FC = () => {
  const [feeds, setFeeds] = useState(dummyFeeds);

  const handleLike = (feedId: string) => {
    setFeeds((prev) =>
      prev.map((feed) =>
        feed.id === feedId ? { ...feed, likes: feed.likes + 1 } : feed
      )
    );
  };

  return (
    <FeedWrapper>
      <FeedContainer>
        {feeds.map((feed) => (
          <FeedCard key={feed.id}>
            <FeedHeader>
              <Title>{feed.title}</Title>
              <Author>{feed.author}</Author>
            </FeedHeader>

            <Content>{feed.content}</Content>

            <FeedFooter>
              <Stats>
                <span>❤️ {feed.likes}</span>
                <span>👁️ {feed.views}</span>
              </Stats>
              <Actions>
                <Heart onClick={() => handleLike(feed.id)} />
                <Send />
              </Actions>
            </FeedFooter>

            <CreatedAt>{feed.createdAt}</CreatedAt>
          </FeedCard>
        ))}
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
  height: 100vh;  /* 화면 전체 높이 */
  overflow-y: auto; /* ✅ 전체 컨테이너에서 스크롤 가능하게 변경 */
`;

const FeedContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  width: 100%;
  min-height: 100vh; /* ✅ 최소 높이 설정으로 스크롤 가능하게 */
`;

const FeedCard = styled.div`
  width: 90%;
  max-width: 500px;
  height: 250px; /* 카드 크기 고정 */
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;


const FeedHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ddd;
  padding-bottom: 8px;
`;

const Title = styled.h3`
  font-size: 18px;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Author = styled.span`
  font-size: 14px;
  color: gray;
`;

const Content = styled.p`
  font-size: 16px;
  flex-grow: 1;
`;

const FeedFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #ddd;
  padding-top: 10px;
`;

const Stats = styled.div`
  font-size: 14px;
  color: gray;
  display: flex;
  gap: 10px;
`;

const Actions = styled.div`
  display: flex;
  gap: 10px;
  font-size: 24px;
  cursor: pointer;
`;

const CreatedAt = styled.div`
  font-size: 12px;
  color: gray;
  text-align: right;
  margin-top: 5px;
`;
