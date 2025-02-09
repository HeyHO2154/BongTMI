import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaClock } from "react-icons/fa"; // 아이콘 추가
import config from "../../config";

interface Bong {
  progrmRegistNo: string;
  progrmSj: string;
  progrmSttusSe: number;
  progrmBgnde: string;
  progrmEndde: string;
  actBeginTm: number;
  actEndTm: number;
  noticeBgnde: string;
  noticeEndde: string;
  rcritNmpr: number;
  actWkdy: string;
  srvcClCode: string;
  adultPosblAt: string;
  yngbgsPosblAt: string;
  grpPosblAt: string;
  mnnstNm: string;
  nanmmbyNm: string;
  actPlace: string;
  nanmmbyNmAdmn: string;
  telno: string;
  postAdres: string;
  email: string;
  progrmCn: string;
  imageUrls: string[];
}

const DetailBong: React.FC = () => {
  const { progrmRegistNo } = useParams<{ progrmRegistNo: string }>();
  const [bongData, setBongData] = useState<Bong | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchBongData = async () => {
      try {
        const response = await axios.get<Bong>(`${config.API_DEV}/api/bong/info`, {
          params: { progrmRegistNo },
        });

        setBongData({
          ...response.data,
          imageUrls: [
            `${config.API_DEV}/api/bong/image/${response.data.progrmRegistNo}/1`,
            `${config.API_DEV}/api/bong/image/${response.data.progrmRegistNo}/2`,
            `${config.API_DEV}/api/bong/image/${response.data.progrmRegistNo}/3`,
          ],
        });
      } catch (err) {
        setError("데이터를 가져오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    if (progrmRegistNo) fetchBongData();
  }, [progrmRegistNo]);

  if (loading) return <LoadingMessage>로딩 중...</LoadingMessage>;
  if (error) return <ErrorMessage>{error}</ErrorMessage>;
  if (!bongData) return <ErrorMessage>데이터가 없습니다.</ErrorMessage>;

  return (
    <Container>
      {/* 📸 이미지 슬라이드 */}
      <ImageContainer>
        <SlideButton onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? 2 : prev - 1))}>{"<"}</SlideButton>
        <Image style={{ backgroundImage: `url(${bongData.imageUrls[currentImageIndex]})` }} />
        <SlideButton onClick={() => setCurrentImageIndex((prev) => (prev === 2 ? 0 : prev + 1))}>{">"}</SlideButton>
      </ImageContainer>

      {/* 📌 봉사 상세 정보 */}
      <InfoContainer>
        <Title>{bongData.progrmSj}</Title>

        <Details>
          <DetailItem><FaCalendarAlt /> 시작일: {bongData.progrmBgnde} ~ {bongData.progrmEndde}</DetailItem>
          <DetailItem><FaClock /> 활동 시간: {bongData.actBeginTm}시 ~ {bongData.actEndTm}시</DetailItem>
          <DetailItem><FaUsers /> 모집 인원: {bongData.rcritNmpr}명</DetailItem>
          <DetailItem><FaMapMarkerAlt /> 장소: {bongData.actPlace} ({bongData.postAdres})</DetailItem>
        </Details>

        <Description>{bongData.progrmCn}</Description>

      </InfoContainer>


      <Footer>
        <ApplyButton>📩 신청하기</ApplyButton>
      </Footer>

    </Container>
  );
};

export default DetailBong;

/* 스타일 */
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: calc(100vh - 160px); /* TopBar + NavBar 높이 제외 */
  overflow-y: auto; /* 스크롤 가능 */
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  overflow: hidden;
`;

const Image = styled.div`
  width: 100%;
  height: 300px;
  background-size: cover;
  background-position: center;
`;

const SlideButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.3);
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
`;

const InfoContainer = styled.div`
  padding: 20px;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 24px;
  color: #333;
  margin-bottom: 10px;
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: left;
`;

const DetailItem = styled.p`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  color: #555;
`;

const Description = styled.p`
  margin-top: 15px;
  font-size: 16px;
  color: #444;
  line-height: 1.5;
`;

const LoadingMessage = styled.div`
  text-align: center;
  font-size: 18px;
`;

const ErrorMessage = styled.div`
  color: red;
  text-align: center;
`;

const ApplyButton = styled.button`
  padding: 12px 20px;
  font-size: 16px;
  font-weight: bold;
  color: white;
  background-color: #ff6f61;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color:rgba(255, 110, 97, 0.73);
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;
  margin-bottom: 10px;
  background-color: #fff;
  z-index: 10;
  position: relative;
`;