import React from "react";
import styled from "styled-components";
import { Card, Avatar, Typography, Row, Col, Button, List } from "antd";
import { UserOutlined, HeartOutlined } from "@ant-design/icons";

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
    image: "https://picsum.photos/300?random=2",
  },
];

const MyPage: React.FC = () => {
  return (
    <Container>
      <Header>
        <ProfileCard>
          <Row align="middle" justify="space-between">
            <Col span={16}>
              <ProfileInfo>
                <Avatar size={64} icon={<UserOutlined />} className="user-avatar" />
                <UserDetails>
                  <Title level={4} className="user-name">김도희</Title>
                  <Text className="user-email" type="secondary">dorosy@naver.com</Text>
                </UserDetails>
              </ProfileInfo>
            </Col>
            <Col span={8} className="volunteer-stats">
              <Text type="secondary" className="stats-label">봉사 시간</Text>
              <Title level={3} className="stats-value">1,724시간</Title>
            </Col>
          </Row>
        </ProfileCard>
        <ButtonGroup>
          <Button type="primary" size="middle">봉사 내역 관리</Button>
          <Button type="default" size="middle" icon={<HeartOutlined />}>
            좋아요 한 공고
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
  height: 83.5vh;
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
  text-align: center;
  margin-top: 10px;

  button:first-child {
    margin-right: 10px;
  }

  button {
    font-size: 14px;
    padding: 5px 15px;
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
