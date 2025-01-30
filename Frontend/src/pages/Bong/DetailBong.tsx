import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom"; // React Router 사용
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
  fxnum: string;
  postAdres: string;
  email: string;
  progrmCn: string;
  sidoCd: string;
  gugunCd: string;
  imageUrls: string[]; // 이미지 배열 추가
}

const DetailBong: React.FC = () => {
  const { progrmRegistNo } = useParams<{ progrmRegistNo: string }>();
  const navigate = useNavigate(); // useNavigate 추가
  const [bongData, setBongData] = useState<Bong | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // 현재 보이는 이미지 인덱스

  const handleViewMore = () => {
    navigate(`/?progrmRegistNo=${progrmRegistNo}`); // Swipe.tsx로 progrmRegistNo 전달
  };

  const handleImageSlide = (direction: "left" | "right") => {
    if (direction === "left") {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? 2 : prevIndex - 1
      );
    } else {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 2 ? 0 : prevIndex + 1
      );
    }
  };

  useEffect(() => {
    const fetchBongData = async () => {
      try {
        const response = await axios.get<Bong>(
          `${config.API_DEV}/api/bong/info`,
          {
            params: { progrmRegistNo },
          }
        );
        setBongData({
          ...response.data,
          imageUrls: [
            `http://localhost:8080/api/bong/image/${response.data.progrmRegistNo}/1`,
            `http://localhost:8080/api/bong/image/${response.data.progrmRegistNo}/2`,
            `http://localhost:8080/api/bong/image/${response.data.progrmRegistNo}/3`,
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

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;
  if (!bongData) return <div>progrmRegistNo: {progrmRegistNo}, 데이터가 없습니다.</div>;

  return (
    <Container>
      <Header>
        <ViewMoreButton onClick={handleViewMore}>
          <FontAwesomeIcon icon={faArrowLeft} />
          봉사 더 보기
        </ViewMoreButton>
      </Header>

      <Content>
        {/* 이미지 슬라이드 */}
        <ImageContainer>
          <SlideButtonLeft onClick={() => handleImageSlide("left")}>{"<"}</SlideButtonLeft>
          <Image
            src={bongData.imageUrls[currentImageIndex]}
            alt={`Image ${currentImageIndex + 1}`}
          />
          <SlideButtonRight onClick={() => handleImageSlide("right")}>{">"}</SlideButtonRight>
        </ImageContainer>

        <h1>{bongData.progrmSj}</h1>
        <p><strong>프로그램 등록번호:</strong> {bongData.progrmRegistNo}</p>
        <p><strong>봉사 상태:</strong> {bongData.progrmSttusSe}</p>
        <p><strong>봉사 시작일자:</strong> {bongData.progrmBgnde}</p>
        <p><strong>봉사 종료일자:</strong> {bongData.progrmEndde}</p>
        <p><strong>활동 시작 시간:</strong> {bongData.actBeginTm}</p>
        <p><strong>활동 종료 시간:</strong> {bongData.actEndTm}</p>
        <p><strong>모집 시작일자:</strong> {bongData.noticeBgnde}</p>
        <p><strong>모집 종료일자:</strong> {bongData.noticeEndde}</p>
        <p><strong>모집 인원:</strong> {bongData.rcritNmpr}</p>
        <p><strong>활동 요일:</strong> {bongData.actWkdy}</p>
        <p><strong>봉사 분야:</strong> {bongData.srvcClCode}</p>
        <p><strong>성인 가능 여부:</strong> {bongData.adultPosblAt}</p>
        <p><strong>청소년 가능 여부:</strong> {bongData.yngbgsPosblAt}</p>
        <p><strong>단체 가능 여부:</strong> {bongData.grpPosblAt}</p>
        <p><strong>모집 기관명:</strong> {bongData.mnnstNm}</p>
        <p><strong>등록 기관명:</strong> {bongData.nanmmbyNm}</p>
        <p><strong>봉사 장소:</strong> {bongData.actPlace}</p>
        <p><strong>담당자명:</strong> {bongData.nanmmbyNmAdmn}</p>
        <p><strong>전화번호:</strong> {bongData.telno}</p>
        <p><strong>FAX 번호:</strong> {bongData.fxnum}</p>
        <p><strong>담당자 주소:</strong> {bongData.postAdres}</p>
        <p><strong>이메일:</strong> {bongData.email}</p>
        <p><strong>내용:</strong> {bongData.progrmCn}</p>
        <p><strong>시도 코드:</strong> {bongData.sidoCd}</p>
        <p><strong>시군구 코드:</strong> {bongData.gugunCd}</p>
      
      </Content>

      <Footer>
        <ApplyButton
          onClick={() => {
            const baseUrl =
              bongData.progrmRegistNo.startsWith("SYO")
                ? `https://www.1365.go.kr/vols/P9210/partcptn/timeCptn.do?type=show&progrmRegistNo=`
                : bongData.progrmRegistNo.startsWith("VMS")
                ? `https://www.vms.or.kr/partspace/recruitView.do?seq=`
                : null;

            if (baseUrl) {
              window.location.href = `${baseUrl}${bongData.progrmRegistNo.slice(3)}`;
            } else {
              window.location.href = `${bongData.fxnum}`;
            }
          }}
        >
          신청하기
        </ApplyButton>
      </Footer>
    </Container>
  );
};

export default DetailBong;

// 스타일 정의
const ViewMoreButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: bold;
  color: #007bff;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.3s;

  &:hover {
    color: #0056b3;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: calc(100vh - 140px); /* TopBar(60px) + Navbar(60px) */
  overflow: hidden; /* 전체 화면 스크롤 방지 */
  padding: 0;

  transform: translateY(20px);
  opacity: 0;
  animation: fadeIn 0.5s ease-out forwards; /* 0.5초 동안 페이드인 효과 */

  @keyframes fadeIn {
    to {
      transform: translateY(0); /* 제자리로 이동 */
      opacity: 1; /* 완전히 보이게 */
    }
  }
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  padding: 12px 20px 10px 12px;
  background-color: #fff;
  z-index: 10;
  position: relative;
`;

const Content = styled.div`
  width: 100%;
  max-width: 800px;
  height: 90%;
  overflow-y: auto;
  padding: 0px 20px 20px 20px;
  box-sizing: border-box;
  background-color: #fff;
  border-radius: 8px;
  z-index: 1;
  position: relative;
`;

const Footer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;
  margin-bottom: 40px;
  background-color: #fff;
  z-index: 10;
  position: relative;
`;

const ApplyButton = styled.button`
  padding: 12px 20px;
  font-size: 16px;
  font-weight: bold;
  color: white;
  background-color: #007bff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

// 슬라이드 관련 스타일
const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 20px; /* 하단 패딩 추가 */
`;

const Image = styled.img`
  width: 100%;
  height: auto;
  max-height: 100%;
  object-fit: cover;
`;

const SlideButtonLeft = styled.button`
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  z-index: 10;
`;

const SlideButtonRight = styled.button`
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  z-index: 10;
`;
