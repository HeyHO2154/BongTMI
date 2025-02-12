import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { Avatar,   Button } from "antd";
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
            <Avatar size={80} icon={<UserOutlined />} className="user-avatar" />
            <UserDetails>
              <UserName>{user.nickname}</UserName>
              <UserEmail>{user.email}</UserEmail>
              <StatsRow>
                <StatItem>
                  <StatNumber>12</StatNumber>
                  <StatLabel>작성 봉사</StatLabel>
                </StatItem>
                <StatDivider />
                <StatItem>
                  <StatNumber>25</StatNumber>
                  <StatLabel>관심 봉사</StatLabel>
                </StatItem>
                <StatDivider />
                <StatItem>
                  <StatNumber>8</StatNumber>
                  <StatLabel>후기</StatLabel>
                </StatItem>
              </StatsRow>
            </UserDetails>
          </ProfileInfo>
          <ActionButtons>
            <StyledButton onClick={() => navigate("/user/report")} icon={<BarChartOutlined />}>
              통계
            </StyledButton>
            <StyledButton onClick={handleLogout} icon={<LogoutOutlined />}>
              로그아웃
            </StyledButton>
          </ActionButtons>
        </ProfileSection>

        <TabsContainer>
          {["작성 봉사", "관심 봉사", "작성 후기", "관심 후기"].map((tab) => (
            <TabButton
              key={tab}
              $active={activeTab === tab}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </TabButton>
          ))}
        </TabsContainer>
      </Header>

      <Content>
        <CardGrid>
          {dummyData.map((item, index) => (
            <ContentCard key={index}>
              <CardImage src={item.image} alt={item.title} />
              <CardContent>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardContent>
            </ContentCard>
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
  max-width: 600px;
  margin: 0 auto;
  min-height: calc(100vh - 120px);
  background: #f8f9fa;
`;

const Header = styled.div`
  background: white;
  padding: 24px 20px;
  border-bottom: 1px solid #eee;
`;

const ProfileSection = styled.div`
  margin-bottom: 20px;
`;

const ProfileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 20px;

  .user-avatar {
    background: linear-gradient(135deg, #3498db, #2980b9);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const UserDetails = styled.div`
  flex: 1;
`;

const UserName = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 4px 0;
`;

const UserEmail = styled.p`
  font-size: 14px;
  color: #7f8c8d;
  margin: 0 0 16px 0;
`;

const StatsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: #7f8c8d;
  margin-top: 4px;
`;

const StatDivider = styled.div`
  width: 1px;
  height: 24px;
  background: #eee;
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

const StyledButton = styled(Button)`
  border-radius: 8px;
  height: 36px;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const TabsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  padding: 0 4px;
`;

const TabButton = styled.button<{ $active: boolean }>`
  padding: 12px;
  border: none;
  border-radius: 8px;
  background: ${props => props.$active ? '#3498db' : '#f8f9fa'};
  color: ${props => props.$active ? 'white' : '#7f8c8d'};
  font-size: 14px;
  font-weight: ${props => props.$active ? '600' : '400'};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.$active ? '#3498db' : '#eee'};
  }
`;

const Content = styled.div`
  padding: 20px;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
`;

const ContentCard = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const CardImage = styled.img`
  width: 100%;
  height: 160px;
  object-fit: cover;
`;

const CardContent = styled.div`
  padding: 16px;
`;

const CardTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 8px 0;
`;

const CardDescription = styled.p`
  font-size: 14px;
  color: #7f8c8d;
  margin: 0;
  line-height: 1.4;
`;
