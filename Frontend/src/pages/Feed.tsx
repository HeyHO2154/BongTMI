import React, { useState } from "react";
import styled from "styled-components";
import { Heart, MessageCircle, Send } from "lucide-react"; // 아이콘 라이브러리

// ✅ 더미 데이터 (게시글 목록)
const dummyPosts = [
  {
    id: 1,
    user: {
      name: "johndoe",
      profileImg: "https://thumb.mt.co.kr/06/2024/12/2024121110110632754_1.jpg",
    },
    image: "https://i.ytimg.com/vi/7qIuReWbE28/maxresdefault.jpg",
    likes: 120,
    caption: "오늘 날씨 너무 좋다! 🌞 #자연 #힐링",
    comments: [
      { user: "alice", text: "와우 멋진 사진이네요!" },
      { user: "bob", text: "여기 어디인가요?" },
    ],
  },
  {
    id: 2,
    user: {
      name: "janedoe",
      profileImg: "https://cdn.hankyung.com/photo/202303/BF.32882728.1.jpg",
    },
    image: "https://i.ytimg.com/vi/qe0gepQh8N0/maxresdefault.jpg",
    likes: 85,
    caption: "도시의 야경이 정말 아름답다 🌃 #야경 #도시감성",
    comments: [{ user: "chris", text: "야경이 너무 멋져요!" }],
  },
];

const Feed: React.FC = () => {
  const [posts, setPosts] = useState(dummyPosts);

  // 좋아요 버튼 클릭 핸들러
  const handleLike = (postId: number) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };

  // 댓글 추가 핸들러
  const [commentInputs, setCommentInputs] = useState<{ [key: number]: string }>(
    {}
  );

  const handleCommentChange = (postId: number, text: string) => {
    setCommentInputs((prev) => ({ ...prev, [postId]: text }));
  };

  const handleAddComment = (postId: number) => {
    if (!commentInputs[postId]) return;

    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: [...post.comments, { user: "me", text: commentInputs[postId] }],
            }
          : post
      )
    );

    // 입력값 초기화
    setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
  };

  return (
    <FeedWrapper>
      <FeedContainer>
        {posts.map((post) => (
          <PostCard key={post.id}>
            {/* 사용자 정보 */}
            <UserInfo>
              <ProfileImage src={post.user.profileImg} alt={post.user.name} />
              <Username>{post.user.name}</Username>
            </UserInfo>

            {/* 게시글 이미지 */}
            <PostImage src={post.image} alt="post" />

            {/* 액션 버튼 */}
            <Actions>
              <Heart onClick={() => handleLike(post.id)} />
              <MessageCircle />
              <Send />
            </Actions>

            {/* 좋아요 개수 */}
            <Likes>{post.likes} likes</Likes>

            {/* 게시글 설명 */}
            <Caption>
              <strong>{post.user.name}</strong> {post.caption}
            </Caption>

            {/* 댓글 */}
            <Comments>
              {post.comments.map((comment, index) => (
                <Comment key={index}>
                  <strong>{comment.user}</strong> {comment.text}
                </Comment>
              ))}
            </Comments>

            {/* 댓글 입력 */}
            <CommentInputContainer>
              <CommentInput
                type="text"
                placeholder="댓글을 입력하세요..."
                value={commentInputs[post.id] || ""}
                onChange={(e) => handleCommentChange(post.id, e.target.value)}
              />
              <CommentButton onClick={() => handleAddComment(post.id)}>게시</CommentButton>
            </CommentInputContainer>
          </PostCard>
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
  height: calc(100vh - 160px); /* TopBar(60px) + Navbar(60px) */
  display: flex;
  justify-content: center;
  align-items: flex-start; /* ✅ 상단 정렬 */
  overflow-y: hidden; /* ✅ 부모가 스크롤을 가지지 않도록 */
`;

const FeedContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  overflow-y: auto;
  height: 83vh; /* ✅ 전체 높이 */
  max-height: 100vh; /* ✅ 스크롤이 가능하도록 */
  width: 100%;
`;

const PostCard = styled.div`
  width: 500px;
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  min-height: 20vh; /* ✅ 최소 높이 설정 */
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
`;

const ProfileImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
`;

const Username = styled.span`
  font-weight: bold;
`;

const PostImage = styled.img`
  width: 100%;
  height: auto;
`;

const Actions = styled.div`
  display: flex;
  gap: 10px;
  padding: 10px;
  font-size: 24px;
  cursor: pointer;
`;

const Likes = styled.div`
  font-weight: bold;
  padding: 0 10px;
`;

const Caption = styled.p`
  padding: 0 10px;
`;

const Comments = styled.div`
  padding: 0 10px;
`;

const Comment = styled.p`
  font-size: 14px;
  margin: 5px 0;
`;

const CommentInputContainer = styled.div`
  display: flex;
  padding: 10px;
  border-top: 1px solid #eee;
  background: white; /* ✅ 배경색 추가 */
  position: sticky; /* ✅ 댓글창 고정 */
  bottom: 0; /* ✅ 항상 하단에 유지 */
  width: 100%; /* ✅ 부모 요소 크기 맞춤 */
`;

const CommentInput = styled.input`
  flex: 1;
  border: none;
  padding: 10px;
  font-size: 14px;
`;

const CommentButton = styled.button`
  background: transparent;
  border: none;
  color: #0095f6;
  font-weight: bold;
  cursor: pointer;
`;
