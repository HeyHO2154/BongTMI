import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { Avatar } from "antd";
import { UserOutlined, BarChartOutlined, LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";


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
  const [activeTab, setActiveTab] = useState(() => "작성 봉사"); // ✅ 초기값 보장
  const hasNavigated = useRef(false); // ✅ navigate 중복 실행 방지

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else if (!hasNavigated.current) {
      hasNavigated.current = true;
      navigate("/user/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/user/login");
  };

  if (!user) {
    return null;
  }

  return (
    <Container>
      <Header>
        <ProfileSection>
          <ProfileInfo>
            <Avatar size={86} icon={<UserOutlined />} className="user-avatar" />
            <UserDetails>
              <UserName>{user.nickname}</UserName>
              <UserEmail>{user.email}</UserEmail>
              <ActionButtons>
                <IconButton onClick={() => navigate("/user/report")}>
                  <BarChartOutlined />
                  <ButtonLabel>통계</ButtonLabel>
                </IconButton>
                <IconButton onClick={handleLogout}>
                  <LogoutOutlined />
                  <ButtonLabel>로그아웃</ButtonLabel>
                </IconButton>
              </ActionButtons>
            </UserDetails>
          </ProfileInfo>
        </ProfileSection>

        <TabsContainer>
          <TabButton $active={activeTab === "작성 봉사"} onClick={() => setActiveTab("작성 봉사")}>
            작성 봉사
          </TabButton>
          <TabButton $active={activeTab === "관심 봉사"} onClick={() => setActiveTab("관심 봉사")}>
            관심 봉사
          </TabButton>
          <TabButton $active={activeTab === "작성 후기"} onClick={() => setActiveTab("작성 후기")}>
            작성 후기
          </TabButton>
          <TabButton $active={activeTab === "관심 후기"} onClick={() => setActiveTab("관심 후기")}>
            관심 후기
          </TabButton>
        </TabsContainer>
      </Header>

      <Content>
        <CardGrid>
          {dummyData.map((item, index) => (
            <Card key={index}>
              <CardImage src={item.image} alt={item.title} />
              <CardContent>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </CardGrid>
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
  height: calc(100vh - 120px);
  overflow-y: auto;
  background: #f8f9fa;
`;

const Header = styled.div`
  background: white;
  padding: 20px;
  border-bottom: 1px solid #eee;
  position: sticky;
  top: 0;
  z-index: 10;
`;

const ProfileSection = styled.div`
  margin-bottom: 20px;
`;

const ProfileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;

  .user-avatar {
    background: linear-gradient(135deg, #ff6b6b, #ff8787);
    box-shadow: 0 4px 12px rgba(255, 107, 107, 0.2);
  }
`;

const UserDetails = styled.div`
  flex: 1;
`;

const UserName = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #343a40;
  margin: 0 0 4px 0;
`;

const UserEmail = styled.p`
  font-size: 0.9rem;
  color: #868e96;
  margin: 0;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 12px;
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  color: #495057;
  font-size: 0.9rem;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: #f1f3f5;
    color: #ff6b6b;
  }
`;

const ButtonLabel = styled.span`
  font-size: 0.9rem;
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 20px;
`;

const TabButton = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 12px;
  background: ${props => props.$active ? '#ff6b6b' : '#f1f3f5'};
  color: ${props => props.$active ? 'white' : '#495057'};
  font-size: 0.9rem;
  font-weight: ${props => props.$active ? '600' : '400'};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.$active ? '#ff6b6b' : '#e9ecef'};
    transform: translateY(-1px);
  }
`;

const Content = styled.div`
  padding: 20px;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
`;

const Card = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  }
`;

const CardImage = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
`;

const CardContent = styled.div`
  padding: 16px;
`;

const CardTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #343a40;
  margin: 0 0 8px 0;
`;

const CardDescription = styled.p`
  font-size: 0.9rem;
  color: #868e96;
  margin: 0;
  line-height: 1.5;
`;
