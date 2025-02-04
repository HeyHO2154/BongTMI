import React, { useState } from "react";
import styled from "styled-components";
import { Heart, Send, MoreHorizontal } from "lucide-react";

interface FeedData {
  id: string;
  title: string;
  author: string;
  createdAt: string;
  content: string;
  likes: number;
  views: number;
  imageUrl?: string;
  profileUrl?: string; // ✅ 프로필 이미지 추가
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
    imageUrl: "https://source.unsplash.com/500x500/?nature",
    profileUrl: "https://source.unsplash.com/50x50/?face",
  },
  {
    id: "DCI1111473",
    title: "지랄은 오브젝트 강타는 무조건 정글 소양이지",
    author: "user2",
    createdAt: "2025-02-04 13:47:47",
    content: "그게 존재이유인데 그것조차 못하면 정글을 왜 함?",
    likes: 5,
    views: 80,
    imageUrl: "https://source.unsplash.com/500x500/?gaming",
    profileUrl: "https://source.unsplash.com/50x50/?gamer",
  },
  {
    id: "DCI1351901",
    title: "봉사랑 헌혈안해서 일반기술은 광탈이여도",
    author: "user3",
    createdAt: "2025-02-04 13:38:17",
    content: "일반기술말고 기계로는 못가나?",
    likes: 20,
    views: 200,
    imageUrl: "https://source.unsplash.com/500x500/?technology",
    profileUrl: "https://source.unsplash.com/50x50/?engineer",
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
            {/* 사용자 정보 */}
            <FeedHeader>
              <Profile>
                <ProfileImage src={feed.profileUrl} alt="Profile" />
                <Author>{feed.author}</Author>
              </Profile>
              <MoreHorizontal />
            </FeedHeader>

            {/* 이미지 */}
            {feed.imageUrl && <FeedImage src={feed.imageUrl} alt="Feed Image" />}

            {/* 버튼 */}
            <FeedFooter>
              <Actions>
                <Heart onClick={() => handleLike(feed.id)} />
                <Send />
              </Actions>
              <Stats>❤️ {feed.likes}</Stats>
            </FeedFooter>

            {/* 게시글 내용 */}
            <FeedContent>
              <ContentTitle>{feed.title}</ContentTitle>
              <ContentText>{feed.content}</ContentText>
              <CreatedAt>{feed.createdAt}</CreatedAt>
            </FeedContent>
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
  overflow-y: auto;
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

// ✅ 사용자 정보 (프로필 영역)
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
`;

// ✅ 게시물 이미지
const FeedImage = styled.img`
  width: 100%;
  height: 400px; /* ✅ 인스타그램 스타일 */
  object-fit: cover;
`;

// ✅ 본문 내용
const FeedContent = styled.div`
  padding: 10px;
`;

const ContentTitle = styled.h3`
  font-size: 16px;
  font-weight: bold;
`;

const ContentText = styled.p`
  font-size: 14px;
  color: #333;
`;

// ✅ 버튼 및 좋아요 정보
const FeedFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
`;

const Actions = styled.div`
  display: flex;
  gap: 10px;
  font-size: 24px;
  cursor: pointer;
`;

const Stats = styled.div`
  font-size: 14px;
  font-weight: bold;
`;

const CreatedAt = styled.div`
  font-size: 12px;
  color: gray;
  text-align: right;
  margin-top: 5px;
`;
