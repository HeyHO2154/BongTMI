import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";

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
}

const DetailBong: React.FC = () => {
  const { progrmRegistNo } = useParams<{ progrmRegistNo: string }>();
  const [bongData, setBongData] = useState<Bong | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBongData = async () => {
      try {
        const response = await axios.get<Bong>(
          `http://localhost:8080/api/bong/info`,
          {
            params: { progrmRegistNo },
          }
        );
        setBongData(response.data);
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
      <Content>
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
    </Container>
  );
};

export default DetailBong;

// 스타일 정의
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: calc(100vh - 70px); /* TopBar(60px) + Navbar(60px) */
  overflow: hidden; /* 전체 화면 스크롤 방지 */
  padding: 0;

  /* 초기 상태: 약간 아래에서 시작 */
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

const Content = styled.div`
  width: 100%;
  max-width: 800px; /* 내용의 최대 너비 설정 */
  height: 90%; /* 본문 높이를 제한 */
  overflow-y: auto; /* 내부 스크롤 활성화 */
  padding: 20px;
  box-sizing: border-box;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
`;
