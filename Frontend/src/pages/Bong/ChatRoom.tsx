import React from "react";
import styled from "styled-components";
import { MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ChatRoom: React.FC = () => {
  const navigate = useNavigate();

  // 더미 데이터
  const chatRooms = [
    {
      id: 1,
      name: "서울시 봉사단",
      lastMessage: "다음 주 토요일에 봉사활동 있습니다!",
      time: "방금 전",
      unreadCount: 2,
      profileImage: "/assets/DC.png"
    },
    {
      id: 2,
      name: "동물보호소 봉사",
      lastMessage: "오늘 수고 많으셨습니다~",
      time: "1시간 전",
      unreadCount: 0,
      profileImage: "/assets/DC.png"
    },
    {
      id: 3,
      name: "환경지킴이",
      lastMessage: "내일 날씨가 좋을 것 같아요!",
      time: "어제",
      unreadCount: 5,
      profileImage: "/assets/DC.png"
    }
  ];

  return (
    <Container>
      <Title>
        <MessageCircle size={24} />
        채팅
      </Title>

      {chatRooms.length > 0 ? (
        <ChatList>
          {chatRooms.map(room => (
            <ChatItem key={room.id} onClick={() => navigate(`/chat/${room.id}`)}>
              <ProfileImage src={room.profileImage} alt={room.name} />
              <ChatInfo>
                <ChatHeader>
                  <ChatName>{room.name}</ChatName>
                  <ChatTime>{room.time}</ChatTime>
                </ChatHeader>
                <ChatPreview>
                  <LastMessage>{room.lastMessage}</LastMessage>
                  {room.unreadCount > 0 && (
                    <UnreadBadge>{room.unreadCount}</UnreadBadge>
                  )}
                </ChatPreview>
              </ChatInfo>
            </ChatItem>
          ))}
        </ChatList>
      ) : (
        <EmptyState>
          <EmptyMessage>아직 채팅방이 없습니다</EmptyMessage>
        </EmptyState>
      )}
    </Container>
  );
};

export default ChatRoom;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  height: calc(100vh - 120px);
  padding: 20px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }
`;

const Title = styled.h1`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 22px;
  margin-bottom: 24px;
  color: #333;
  padding: 0 4px;
`;

const ChatList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ChatItem = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ProfileImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  margin-right: 16px;
  object-fit: cover;
`;

const ChatInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const ChatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
`;

const ChatName = styled.span`
  font-weight: 600;
  font-size: 16px;
  color: #333;
`;

const ChatTime = styled.span`
  font-size: 13px;
  color: #999;
`;

const ChatPreview = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LastMessage = styled.p`
  color: #666;
  font-size: 14px;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
`;

const UnreadBadge = styled.span`
  background: #ff4444;
  color: white;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 12px;
  margin-left: 8px;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 32px 16px;
`;

const EmptyMessage = styled.p`
  font-size: 15px;
  color: #999;
  text-align: center;
`;
