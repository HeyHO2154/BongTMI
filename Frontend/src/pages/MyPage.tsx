import React, { useState } from "react";
import styled from "styled-components";
import { Card, Avatar, Typography, Row, Col, Button, List } from "antd";
import { UserOutlined, LogoutOutlined, BarChartOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

interface FeedData {
  feedID: string;
  title: string;
  author: string;
  createdAt: string;
  content: string;
  likes: number;
  comments: number;
  imageUrl: string;
}

interface BongData {
  id: string;
  label: string;
  region: string;
  type: string;
  date: string;
  imageUrl: string;
  from: string;
}

const dummyFeeds: FeedData[] = [
  {
    feedID: "feed1",
    title: "봉사활동 후기 - 따뜻한 나눔",
    author: "김철수",
    createdAt: "2024-02-01 10:00",
    content: "오늘 봉사활동을 다녀왔어요. 너무 의미 있는 시간이었습니다!",
    likes: 15,
    comments: 5,
    imageUrl: "https://via.placeholder.com/300",
  },
  {
    feedID: "feed2",
    title: "환경보호 캠페인 참여 후기",
    author: "이영희",
    createdAt: "2024-01-28 14:30",
    content: "환경 보호 캠페인에 참여하고 왔습니다. 많은 걸 배우고 왔어요!",
    likes: 30,
    comments: 10,
    imageUrl: "https://via.placeholder.com/300",
  },
];

const dummyBongs: BongData[] = [
  {
    id: "bong1",
    label: "노인 복지 봉사",
    region: "서울",
    type: "복지",
    date: "2024-02-10",
    imageUrl: "https://via.placeholder.com/300",
    from: "서울 복지 센터",
  },
  {
    id: "bong2",
    label: "환경 보호 봉사",
    region: "부산",
    type: "환경",
    date: "2024-02-15",
    imageUrl: "https://via.placeholder.com/300",
    from: "부산 환경 단체",
  },
];

const MyPage: React.FC = () => {
  const navigate = useNavigate();
  const [user] = useState<{ nickname: string; email: string }>({
    nickname: "테스트 유저2",
    email: "test@example.com",
  });

  const [activeTab, setActiveTab] = useState<"작성한 봉사" | "관심 봉사" | "작성한 피드" | "관심 피드">("작성한 봉사");

  return (
    <Container>
      <Header>
        <ProfileCard>
          <Row align="middle" justify="space-between">
            <Col span={16}>
              <ProfileInfo>
                <Avatar size={64} icon={<UserOutlined />} className="user-avatar" />
                <UserDetails>
                  <Title level={4} className="user-name">{user.nickname}</Title>
                  <Text className="user-email" type="secondary">{user.email}</Text>
                </UserDetails>
              </ProfileInfo>
            </Col>

            <Col span={8} className="user-actions">
              <Button type="default" icon={<BarChartOutlined />} onClick={() => navigate("/user/report")}>
                통계
              </Button>
              <Button type="default" icon={<LogoutOutlined />} onClick={() => navigate("/user/login")}>
                로그아웃
              </Button>
            </Col>
          </Row>
        </ProfileCard>

        {/* 버튼 4개 유지 & 선택된 버튼만 파란색 */}
        <ButtonGroup>
          <Button type={activeTab === "작성한 봉사" ? "primary" : "default"} onClick={() => setActiveTab("작성한 봉사")}>
            작성한 봉사
          </Button>
          <Button type={activeTab === "관심 봉사" ? "primary" : "default"} onClick={() => setActiveTab("관심 봉사")}>
            관심 봉사
          </Button>
          <Button type={activeTab === "작성한 피드" ? "primary" : "default"} onClick={() => setActiveTab("작성한 피드")}>
            작성한 피드
          </Button>
          <Button type={activeTab === "관심 피드" ? "primary" : "default"} onClick={() => setActiveTab("관심 피드")}>
            관심 피드
          </Button>
        </ButtonGroup>
      </Header>

      <Content>
        <SectionTitle>{activeTab}</SectionTitle>

        {activeTab.includes("봉사") ? (
          <List
            itemLayout="vertical"
            size="large"
            dataSource={dummyBongs}
            renderItem={(item) => (
              <List.Item key={item.id}>
                <BongCard cover={<img alt={item.label} src={item.imageUrl} />}>
                  <Card.Meta
                    title={item.label}
                    description={<Text type="secondary">{item.region} | {item.type} | {item.date}</Text>}
                  />
                </BongCard>
              </List.Item>
            )}
          />
        ) : (
          <List
            itemLayout="vertical"
            size="large"
            dataSource={dummyFeeds}
            renderItem={(item) => (
              <List.Item key={item.feedID}>
                <FeedCard>
                  <Card.Meta
                    title={item.title}
                    description={
                      <>
                        <Text strong>{item.author}</Text> <br />
                        <Text type="secondary">{item.createdAt} | 좋아요 {item.likes} | 댓글 {item.comments}</Text>
                        <p>{item.content}</p>
                      </>
                    }
                  />
                  <FeedImage src={item.imageUrl} alt={item.title} />
                </FeedCard>
              </List.Item>
            )}
          />
        )}
      </Content>
    </Container>
  );
};

export default MyPage;

// --------------------
// 스타일 정의
// --------------------

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 160px); /* TopBar + NavBar 높이 제외 */
  position: relative;
`;

const Header = styled.div`
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 10;
`;

const ProfileCard = styled(Card)`
  border-radius: 10px;
  background-color: #f5f5f5;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 10px;
`;

const Content = styled.div`
  padding: 20px;
`;

const SectionTitle = styled(Title).attrs({ level: 4 })`
  margin-top: 20px;
`;

const BongCard = styled(Card)`
  border-radius: 10px;
`;

const FeedCard = styled(Card)`
  border-radius: 10px;
`;

const FeedImage = styled.img`
  width: 100%;
  border-radius: 10px;
  margin-top: 10px;
`;

const ProfileInfo = styled.div`
  display: flex;
  align-items: center;
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 10px;

  .user-name {
    font-size: 18px;
    font-weight: bold;
  }

  .user-email {
    font-size: 14px;
    color: #888;
  }
`;