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
  region: string;
  type: string;
  date: string;
  imageUrl: string;
  from: string;
  postAdress: string;
  progrmSttusSe: number;
  adultPosblAt: string;
  yngbgsPosblAt: string;
  grpPosblAt: string;
  startDate: string;
  endDate: string;
  days: string;
  remainingDays: number;
}

interface FeedData {
  feedID: string;
  title: string;
  author: string;
  createdAt: string;
  content: string;
  likes: number;
  comments: number;
  imageUrl: string;
  isLiked: boolean;
  category: number;
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
      
      const formattedData = response.data.map((item: any) => {
        if ('progrmRegistNo' in item) {
          // Search.tsx 스타일의 봉사 데이터 포맷팅
          const endDate = new Date(item.progrmEndde);
          const today = new Date();
          const timeDiff = endDate.getTime() - today.getTime();
          const remainingDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

          const source = item.progrmRegistNo.substring(0, 3);
          let fromValue = item.nanmmbyNmAdmn || "봉틈이";
          let typeValue = "USER";
          if (source === "SYO") {
            fromValue = "1365자원봉사";
            typeValue = "1365자원봉사";
          } else if (source === "VMS") {
            fromValue = "VMS사회복지";
            typeValue = "VMS사회복지";
          }

          return {
            ...item,
            region: item.postAdres || "지역 없음",
            type: typeValue,
            date: `모집마감일: ${new Date(item.progrmEndde).toLocaleDateString()}`,
            imageUrl: `${config.API_DEV}/api/bong/image/${item.progrmRegistNo}/1`,
            from: fromValue,
            remainingDays: remainingDays > 0 ? remainingDays : 0,
            days: item.actWkdy || "0000000"
          };
        } else {
          // Feed.tsx 스타일의 피드 데이터 포맷팅
          return {
            ...item,
            imageUrl: `${config.API_DEV}/api/bong/image/0/Bong.png`,
            comments: 0, // 댓글 수는 백엔드에서 받아와야 함
            isLiked: false // 좋아요 상태는 백엔드에서 받아와야 함
          };
        }
      });

      setData(formattedData);
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
        {data.map((item: any, index) => (
          <Card key={index} onClick={() => {
            if ('progrmRegistNo' in item) {
              navigate(`/detail/${item.progrmRegistNo}`);
            } else if ('feedID' in item) {
              navigate(`/feed/${item.feedID}`);
            }
          }}>
            <CardImage style={{ backgroundImage: `url(${item.imageUrl})` }} />
            <CardContent>
              {'progrmRegistNo' in item ? (
                // 봉사 카드 내용 (Search.tsx 스타일)
                <>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                    <Badge from={item.from}>{item.from}</Badge>
                    <div style={{
                      backgroundColor: "rgb(204, 16, 16)",
                      color: "white",
                      padding: "4px 10px",
                      borderRadius: "6px",
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}>
                      {`D-${item.remainingDays}`}
                    </div>
                  </div>
                  <CardTitle>{item.progrmSj}</CardTitle>
                  <CardDescription>
                    {item.postAdres.split(' ').slice(0, 2).join(' ')}
                  </CardDescription>
                  <DateText>{item.date}</DateText>
                </>
              ) : (
                // 피드 카드 내용 (Feed.tsx 스타일)
                <>
                  <UserInfo>
                    <ProfileImage src="/assets/DC.png" alt="프로필" />
                    <UserInfoText>
                      <UserName>{item.author}</UserName>
                      <PostDate>{timeAgo(item.createdAt)}</PostDate>
                    </UserInfoText>
                    <CategoryBadge category={item.category}>
                      {getCategoryLabel(item.category)}
                    </CategoryBadge>
                  </UserInfo>
                  <ContentTitle>{item.title}</ContentTitle>
                  <Actions>
                    <ActionItem>
                      <ThumbsUp />
                      <span>{item.likes}</span>
                    </ActionItem>
                    <ActionItem>
                      <MessageCircle />
                      <span>{item.comments}</span>
                    </ActionItem>
                  </Actions>
                </>
              )}
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

const CardImage = styled.div`
  width: 100%;
  height: 180px;
  background-image: url(${props => props.style?.backgroundImage});
  background-size: cover;
  background-position: center;
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

const Badge = styled.div<{ from: string }>`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  background-color: ${props => 
    props.from === "1365자원봉사" ? "#4CAF50" :
    props.from === "VMS사회복지" ? "#2196F3" :
    "#FF9800"};
  color: white;
`;

// 피드 카테고리 라벨 함수
const getCategoryLabel = (categoryId: number) => {
  switch (categoryId) {
    case 0: return '미분류';
    case 1: return '공지';
    case 2: return '건의';
    case 3: return '후기';
    case 4: return '자유';
    default: return '기타';
  }
};

// 피드 스타일 컴포넌트 추가
const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
`;

const ProfileImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;

const UserInfoText = styled.div`
  flex: 1;
`;

const PostDate = styled.div`
  font-size: 12px;
  color: #666;
`;

const CategoryBadge = styled.span<{ category: number }>`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  ${props => {
    switch (props.category) {
      case 1: return 'background-color: #ff4444; color: white;';
      case 2: return 'background-color: #ffbb33; color: white;';
      case 3: return 'background-color: #00C851; color: white;';
      case 4: return 'background-color: #33b5e5; color: white;';
      default: return 'background-color: #999; color: white;';
    }
  }}
`;

const Actions = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 12px;
`;

const ActionItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #666;
`;

const DateText = styled.div`
  font-size: 14px;
  color: #666;
  margin-top: 8px;
`;

const ContentTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #343a40;
  margin: 0 0 8px 0;
`;
