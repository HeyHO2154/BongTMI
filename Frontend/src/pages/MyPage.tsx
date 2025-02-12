import React, { useEffect, useState, } from "react";
import styled from "styled-components";
import { Avatar } from "antd";
import { UserOutlined, BarChartOutlined, LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../config";
import Loading from "../components/Lodaing";

interface BongData {
  progrmRegistNo: string;
  progrmSj: string;
  actPlace: string;
}

interface FeedData {
  feedID: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  category: number;
  likes: number;
  views: number;
}

const MyPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ nickname: string; email: string } | null>(null);
  const [activeTab, setActiveTab] = useState("작성 봉사");
  const [data, setData] = useState<Array<BongData | FeedData>>([]);
  const [loading, setLoading] = useState(false);

  // 데이터 로드
  const loadData = async (tab: string) => {
    if (!user) return;
    setLoading(true);
    try {
      let endpoint = '';
      switch(tab) {
        case "작성 봉사":
          endpoint = `/api/auth/my-bongs?userId=${user.email}`;
          break;
        case "관심 봉사":
          endpoint = `/api/auth/liked-bongs?userId=${user.email}`;
          break;
        case "작성 후기":
          endpoint = `/api/auth/my-feeds?userId=${user.email}`;
          break;
        case "관심 후기":
          endpoint = `/api/auth/liked-feeds?userId=${user.email}`;
          break;
      }
      
      const response = await axios.get(`${config.API_DEV}${endpoint}`);
      setData(response.data);
    } catch (error) {
      console.error('데이터 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate("/user/login");
    }
  }, [navigate]);

  useEffect(() => {
    loadData(activeTab);
  }, [activeTab, user]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/user/login");
  };

  if (!user) {
    return null;
  }

  const renderContent = () => {
    if (loading) return <Loading />;

    return (
      <CardGrid>
        {data.map((item, index) => (
          <Card key={index} onClick={() => {
            if ('progrmRegistNo' in item) {
              navigate(`/bong/${item.progrmRegistNo}`);
            } else if ('feedID' in item) {
              navigate(`/feed/${item.feedID}`);
            }
          }}>
            <CardImage 
              src={
                'progrmRegistNo' in item
                  ? `${config.API_DEV}/api/bong/image/${item.progrmRegistNo}/1`
                  : `${config.API_DEV}/api/feed/image/${item.feedID}/1`
              } 
              alt={
                'progrmRegistNo' in item
                  ? item.progrmSj
                  : item.title
              }
            />
            <CardContent>
              <CardTitle>
                {'progrmRegistNo' in item ? item.progrmSj : item.title}
              </CardTitle>
              <CardDescription>
                {'progrmRegistNo' in item ? item.actPlace : item.content}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </CardGrid>
    );
  };

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
        {renderContent()}
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
