import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Card, Avatar, Typography, Row, Col, Button, List } from "antd";
import { UserOutlined, BarChartOutlined, LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const dummyData = [
  {
    title: "2024-01-15 아름다운가게 봉사",
    description: "도움이 필요한 사람들에게 나눔을 실천할 수 있어 기뻤습니다.",
    image: "https://picsum.photos/300?random=1",
  },
  {
    title: "2024-01-10 지역사회 환경정화 활동",
    description: "쓰레기를 줍고 깨끗한 환경을 만드는 데 동참했습니다.",
    image: "https://picsum.photos/300?random=2",
  },
  {
    title: "2024-01-10 지역사회 환경정화 활동",
    description: "쓰레기를 줍고 깨끗한 환경을 만드는 데 동참했습니다.",
    image: "https://picsum.photos/300?random=3",
  },
];

const MyPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ nickname: string; email: string } | null>(null);

  useEffect(() => {
    // 로컬 스토리지에서 사용자 정보 가져오기
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // 사용자 정보 저장
    } else {
      navigate("/user/login"); // 로그인 페이지로 이동
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user"); // 사용자 정보 제거
    navigate("/user/login"); // 로그인 페이지로 리다이렉트
  };

  if (!user) {
    return null; // 로딩 중에는 아무것도 렌더링하지 않음
  }

  const [activeTab, setActiveTab] = useState(() => "작성한 봉사");

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
            <Button
              type="default"
              size="middle"
              icon={<LogoutOutlined />}
              onClick={handleLogout}
            >
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
        <List
          itemLayout="vertical"
          size="large"
          dataSource={dummyData}
          renderItem={(item) => (
            <List.Item>
              <VolunteerCard cover={<img alt={item.title} src={item.image} />}>
                <Card.Meta
                  title={item.title}
                  description={<Text type="secondary">{item.description}</Text>}
                />
              </VolunteerCard>
            </List.Item>
          )}
        />
      </Content>
    </Container>
  );
};

export default MyPage;

// --------------------
// 스타일 정의
// --------------------

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 160px); /* TopBar(60px) + Navbar(60px) */
`;

const Header = styled.div`
  flex: 0 0 auto;
  padding: 15px 20px;
  background-color: #fff;
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  border-radius: 0 0 0px 0px;
`;

const ProfileCard = styled(Card)`
  margin-bottom: 10px;
  padding: 0px 15px;
  border-radius: 10px;
  background-color: #f5f5f5;
  box-shadow: none;
`;

const ProfileInfo = styled.div`
  display: flex;
  align-items: center;

  .user-avatar {
    background-color: #f56a00;
    margin-right: 15px;
  }
`;

const UserDetails = styled.div`
  .user-name {
    margin: 0;
    font-size: 18px;
  }

  .user-email {
    font-size: 14px;
    color: #888;
  }
`;

const ButtonGroup = styled.div`
  display: flex; /* 버튼을 Flexbox로 배치 */
  justify-content: center; /* 버튼을 가로 중앙에 정렬 */
  gap: 10px; /* 버튼 간 간격 설정 */
  margin-top: 10px;

  button {
    font-size: 14px;
    padding: 10px 15px;
  }
`;

const Content = styled.div`
  flex: 1 1 auto;
  overflow-y: auto;
  padding: 20px;
`;

const VolunteerCard = styled(Card)`
  margin-bottom: 20px;
  border-radius: 10px;

  img {
    border-radius: 10px;
    height: 150px;
    object-fit: cover;
  }
`;
