import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import config from "../config";

const AddBong: React.FC = () => {
  const navigate = useNavigate(); // ✅ 네비게이션 훅 사용

  const [formData, setFormData] = useState<{
    progrmRegistNo: string;
    progrmSj: string;
    progrmSttusSe: string;
    progrmBgnde: string;
    progrmEndde: string;
    actBeginTm: string;
    actEndTm: string;
    noticeBgnde: string;
    noticeEndde: string;
    rcritNmpr: string;
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
    images: File[];  // <-- 추가됨
  }>({
    progrmRegistNo: "",
    progrmSj: "",
    progrmSttusSe: "1",
    progrmBgnde: "2025-01-01",
    progrmEndde: "2025-12-31",
    actBeginTm: "",
    actEndTm: "",
    noticeBgnde: "2025-01-01",
    noticeEndde: "2025-12-31",
    rcritNmpr: "",
    actWkdy: "",
    srvcClCode: "",
    adultPosblAt: "Y",
    yngbgsPosblAt: "Y",
    grpPosblAt: "Y",
    mnnstNm: "",
    nanmmbyNm: "",
    actPlace: "",
    nanmmbyNmAdmn: "미등록 사용자",
    telno: "",
    fxnum: "",
    postAdres: "",
    email: "",
    progrmCn: "",
    sidoCd: "00",
    gugunCd: "00",
    images: [],  // <-- 추가됨
  });

  const [user, setUser] = useState<{ nickname: string; email: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate("/user/login");
    }
  }, [navigate]);
  

  // 입력값 변경 시 처리
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
  
    let newValue = value;
  
    // 날짜 필드 처리 (연도 4자리 제한)
    if (["progrmBgnde", "progrmEndde", "noticeBgnde", "noticeEndde"].includes(name)) {
      const dateParts = value.split("-");
      if (dateParts.length === 3) {
        dateParts[0] = dateParts[0].slice(0, 4); // 연도 부분 4자리 제한
        newValue = dateParts.join("-");
      }
    }
  
    setFormData((prev) => ({
      ...prev,
      [name]: ["actBeginTm", "actEndTm", "rcritNmpr"].includes(name) 
        ? parseInt(newValue, 10) || 0
        : newValue,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).slice(0, 3); // 최대 3개 제한
      setFormData((prev) => ({
        ...prev,
        images: files,
      }));
    }
  };
  
  
  //USR 고유번호 생성
  const generateProgrmRegistNo = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
  
    return `USR${year}${month}${day}${hours}${minutes}${seconds}`;
  };

  // 폼 제출 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    formData.progrmRegistNo = generateProgrmRegistNo();
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      formData.nanmmbyNmAdmn = JSON.parse(storedUser).nickname;
    }
  
    if (!formData.progrmRegistNo || !formData.progrmSj) {
      alert("필수 항목을 입력해주세요.");
      return;
    }
  
    try {
      // 1. JSON 데이터 먼저 전송
      await axios.post(`${config.API_DEV}/api/bong/add`, JSON.stringify(formData), {
        headers: { "Content-Type": "application/json" },
      });
  
      // 2. 이미지 업로드 처리
      if (formData.images && formData.images.length > 0) {
        const imageFormData = new FormData();
        formData.images.forEach((image, index) => {
          index;  //노란경고 방지
          imageFormData.append("images", image);
        });
  
        await axios.post(`${config.API_DEV}/api/bong/upload/${formData.progrmRegistNo}`, imageFormData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
  
      alert("봉사 공고 등록이 완료되었습니다!");
      navigate(`/detail/${formData.progrmRegistNo}`);
    } catch (error) {
      alert("등록 중 오류가 발생했습니다.");
    }
  };


  const [selectedWeekdays, setSelectedWeekdays] = useState<boolean[]>([false, false, false, false, false, false, false]);
  // 체크박스 클릭 시 `1011110` 형식으로 변환
  const toggleWeekday = (index: number) => {
    const updatedWeekdays = [...selectedWeekdays];
    updatedWeekdays[index] = !updatedWeekdays[index];
  
    // 0 또는 1로 변환한 문자열 생성
    const actWkdyValue = updatedWeekdays.map((checked) => (checked ? "1" : "0")).join("");
  
    setSelectedWeekdays(updatedWeekdays);
    setFormData((prev) => ({ ...prev, actWkdy: actWkdyValue }));
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // 사용자 정보 저장
    }
  }, []);

  if (!user) {
    return null; // 로그인 상태가 아니면 아무것도 렌더링하지 않음
  }

  return (
    <Wrapper>
      <Title>봉사 공고 등록</Title>
      <NoticeBox>
        <NoticeTitle>📢 필독 공지!!</NoticeTitle>
        <NoticeContent>
          공고 등록은 봉사와 관련된 공고를 등록하는 곳입니다.<br />
          악용, 남용 적발 시 계정 정지 조치합니다.
        </NoticeContent>
      </NoticeBox>
      <InfoBox>
          <InfoBoxTitle>✅ 계정 확인됨</InfoBoxTitle>
          <InfoBoxContent>
            <strong>{user.nickname}</strong>님으로 로그인이 되어있습니다. 공고 등록 시 반영됩니다.
          </InfoBoxContent>
      </InfoBox>
      <Form onSubmit={handleSubmit}>
        <Section>
          <SectionTitle>기본 정보</SectionTitle>
          <FormGrid>
            <FormGroup>
              <Label>봉사 제목</Label>
              <Input type="text" name="progrmSj" placeholder="봉사 제목을 입력하세요" value={formData.progrmSj} onChange={handleChange}/>
            </FormGroup>
            <FormGroup>
              <Label>봉사 분야</Label>
              <Input type="text" name="srvcClCode" placeholder="예: 시설봉사 > 업무보조" value={formData.srvcClCode} onChange={handleChange}/>
            </FormGroup>
            <FormGroup>
              <Label>모집 인원</Label>
              <Input type="number" name="rcritNmpr" value={formData.rcritNmpr} onChange={handleChange} placeholder="예: 12" min="0"/>
            </FormGroup>
            <FormGroup>
              <Label>모집 상태</Label>
              <Select name="progrmSttusSe" value={formData.progrmSttusSe} onChange={handleChange}>
                <option value="1">모집대기</option>
                <option value="2">모집중</option>
                <option value="3">모집완료</option>
              </Select>
            </FormGroup>
            <FormGroup>
              <Label>모집 장소</Label>
              <Input type="text" name="actPlace" value={formData.actPlace} onChange={handleChange} placeholder="예: 비대면 온라인 / 강남역 2번 출구" min="0"/>
            </FormGroup>
          </FormGrid>
        </Section>

        <Section>
          <SectionTitle>날짜 및 시간</SectionTitle>
          <FormGrid>
            <FormGroup>
              <Label>봉사 시작일</Label>
              <Input type="date" name="progrmBgnde" value={formData.progrmBgnde} onChange={handleChange} />
            </FormGroup>
            <FormGroup>
              <Label>봉사 종료일</Label>
              <Input type="date" name="progrmEndde" value={formData.progrmEndde} onChange={handleChange} />
            </FormGroup>
            <FormGroup>
              <Label>모집 시작일</Label>
              <Input type="date" name="noticeBgnde" value={formData.noticeBgnde} onChange={handleChange} />
            </FormGroup>
            <FormGroup>
              <Label>모집 종료일</Label>
              <Input type="date" name="noticeEndde" value={formData.noticeEndde} onChange={handleChange} />
            </FormGroup>
            <FormGroup>
              <Label>봉사 시작 시간</Label>
              <Input type="number" name="actBeginTm" value={formData.actBeginTm} onChange={handleChange} placeholder="(0~23)" min="0" max="23"/>
            </FormGroup>
            <FormGroup>
              <Label>봉사 종료 시간</Label>
              <Input type="number" name="actEndTm" value={formData.actEndTm} onChange={handleChange} placeholder="(0~23)" min="0" max="23"/>
            </FormGroup>
            <FormGroup>
              <Label>봉사 활동 요일</Label>
            </FormGroup>
          </FormGrid>
            <WeekdayContainer>
              {["월", "화", "수", "목", "금", "토", "일"].map((day, index) => (
                <WeekdayLabel key={day}>
                  <WeekdayCheckbox
                    type="checkbox"
                    checked={selectedWeekdays[index]}
                    onChange={() => toggleWeekday(index)}
                  />
                  {day}
                </WeekdayLabel>
              ))}
            </WeekdayContainer>
        </Section>

        <Section>
          <SectionTitle>참여 조건</SectionTitle>
          <FormGrid>
            <FormGroup>
              <Label>성인 가능 여부</Label>
              <Select name="adultPosblAt" value={formData.adultPosblAt} onChange={handleChange}>
                <option value="Y">Y</option>
                <option value="N">N</option>
              </Select>
            </FormGroup>
            <FormGroup>
              <Label>청소년 가능 여부</Label>
              <Select name="yngbgsPosblAt" value={formData.yngbgsPosblAt} onChange={handleChange}>
                <option value="Y">Y</option>
                <option value="N">N</option>
              </Select>
            </FormGroup>
            <FormGroup>
              <Label>단체 가능 여부</Label>
              <Select name="grpPosblAt" value={formData.grpPosblAt} onChange={handleChange}>
                <option value="Y">Y</option>
                <option value="N">N</option>
              </Select>
            </FormGroup>
          </FormGrid>
        </Section>

        <Section>
          <SectionTitle>기관 정보</SectionTitle>
          <FormGrid>
            <FormGroup>
              <Label>모집기관명</Label>
              <Input type="text" name="mnnstNm" placeholder="모집기관명을 입력하세요" value={formData.mnnstNm} onChange={handleChange}/>
            </FormGroup>
            <FormGroup>
              <Label>등록기관명</Label>
              <Input type="text" name="nanmmbyNm" placeholder="등록기관명을 입력하세요" value={formData.nanmmbyNm} onChange={handleChange}/>
            </FormGroup>
            <FormGroup>
              <Label>전화번호</Label>
              <Input type="text" name="telno" placeholder="전화번호를 입력하세요" value={formData.telno} onChange={handleChange}/>
            </FormGroup>
            <FormGroup>
              <Label>이메일</Label>
              <Input type="text" name="email" placeholder="이메일을 입력하세요" value={formData.email} onChange={handleChange}/>
            </FormGroup>
            <FormGroup>
              <Label>담당자 주소</Label>
              <Input type="text" name="postAdres" placeholder="담당자 주소를 입력하세요" value={formData.postAdres} onChange={handleChange}/>
            </FormGroup>
            <FormGroup>
              <Label>모집 사이트 입력</Label>
              <Input type="text" name="fxnum" placeholder="예: 모집 사이트 또는 오픈카톡방 등" value={formData.fxnum} onChange={handleChange}/>
            </FormGroup>
          </FormGrid>
          <FormGroup>
              <Label>이미지 업로드 (최대 3장)</Label>
              <Input type="file" multiple accept="image/*" onChange={handleFileChange} />
            </FormGroup>
        </Section>

        <Section>
          <SectionTitle>내용</SectionTitle>
          <Textarea name="progrmCn" placeholder="내용을 입력하세요" value={formData.progrmCn} onChange={handleChange} />
        </Section>

        <Button>
          <SubmitButton type="submit">등록</SubmitButton>
        </Button>
      </Form>
    </Wrapper>
  );
};

export default AddBong;

// 스타일 정의
const Wrapper = styled.div`
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 160px);
  box-sizing: border-box;
  overflow-y: auto;
  background: linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%);
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 2.2rem;
  text-align: center;
  margin-bottom: 20px;
  color: #2c3e50;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  font-size: 1.6rem;
  font-weight: bold;
  margin-bottom: 10px;
  color: #34495e;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 1rem;
  margin-bottom: 6px;
  color: #7f8c8d;
`;

const Input = styled.input`
  padding: 12px;
  border: 2px solid #dcdde1;
  border-radius: 8px;
  font-size: 1rem;
  transition: 0.3s;
  &:focus {
    border-color: #3498db;
    outline: none;
    box-shadow: 0 0 8px rgba(52, 152, 219, 0.3);
  }
`;

const Select = styled.select`
  padding: 12px;
  border: 2px solid #dcdde1;
  border-radius: 8px;
  font-size: 1rem;
  transition: 0.3s;
  &:focus {
    border-color: #3498db;
    outline: none;
    box-shadow: 0 0 8px rgba(52, 152, 219, 0.3);
  }
`;

const Textarea = styled.textarea`
  padding: 12px;
  border: 2px solid #dcdde1;
  border-radius: 8px;
  font-size: 1rem;
  height: 150px;
  resize: none;
  transition: 0.3s;
  &:focus {
    border-color: #3498db;
    outline: none;
    box-shadow: 0 0 8px rgba(52, 152, 219, 0.3);
  }
`;

const Button = styled.div`
  display: flex;
  justify-content: center;
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #6a89cc 0%, #4a69bd 100%);
  color: white;
  font-size: 1.2rem;
  padding: 14px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.3s;
  font-weight: bold;
  &:hover {
    background: linear-gradient(135deg, #4a69bd 0%, #6a89cc 100%);
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  }
`;

const NoticeBox = styled.div`
  background: #fffae3;
  border-left: 6px solid #ffbe76;
  padding: 18px;
  border-radius: 12px;
  max-width: 600px;
  margin-bottom: 20px;
  box-shadow: 2px 4px 8px rgba(0, 0, 0, 0.1);
`;

const InfoBox = styled.div`
  background: #eafaf1;
  border-left: 6px solid #28a745;
  padding: 16px;
  margin-bottom: 20px;
  border-radius: 10px;
  box-shadow: 2px 4px 8px rgba(0, 0, 0, 0.1);
`;

const WeekdayContainer = styled.div`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  width: 100%;
  padding: 10px 0;
`;

const WeekdayLabel = styled.label`
  display: flex;
  align-items: center;
  font-size: 1rem;
  cursor: pointer;
  color: #2c3e50;
`;

const WeekdayCheckbox = styled.input`
  margin-right: 8px;
  width: 16px;
  height: 16px;
  cursor: pointer;
`;

const NoticeTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: bold;
  color: #d35400;
  padding-bottom: 12px;
`;

const NoticeContent = styled.p`
  font-size: 1rem;
  color: #333;
  line-height: 1.5;
`;


const InfoBoxTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: bold;
  color: #155724; /* 어두운 초록색 */
  padding-bottom: 12px;
`;

const InfoBoxContent = styled.p`
  font-size: 1rem;
  color: #155724; /* 어두운 초록색 */
  line-height: 1.5;
`;
