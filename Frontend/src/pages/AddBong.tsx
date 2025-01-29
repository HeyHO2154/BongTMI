import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

  //사용자 정보
  const [user, setUser] = useState<{ nickname: string; email: string } | null>(null);
  user;  //노란경고 방지

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
      await axios.post("http://localhost:8080/api/bong/add", JSON.stringify(formData), {
        headers: { "Content-Type": "application/json" },
      });
  
      // 2. 이미지 업로드 처리
      if (formData.images && formData.images.length > 0) {
        const imageFormData = new FormData();
        formData.images.forEach((image, index) => {
          index;  //노란경고 방지
          imageFormData.append("images", image);
        });
  
        await axios.post(`http://localhost:8080/api/bong/upload/${formData.progrmRegistNo}`, imageFormData, {
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

  return (
    <Wrapper>
      <Title>봉사 공고 등록</Title>
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
  display: flex;
  flex-direction: column;
  height: calc(100vh - 157px);
  box-sizing: border-box;
  overflow-y: auto;
  background-color: #f9f9f9;
  padding: 16px;
  margin-bottom: 90px;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  text-align: center;
  margin-bottom: 16px;
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
`;

const SectionTitle = styled.h2`
  font-size: 1.4rem;
  font-weight: bold;
  margin-bottom: 8px;
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
  margin-bottom: 8px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Select = styled.select`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Textarea = styled.textarea`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: none;
  height: 150px;
  width: 100%;
`;

const Button = styled.div`
  display: flex;
  justify-content: center;
`;

const SubmitButton = styled.button`
  padding: 12px 16px;
  background-color: #007bff;
  color: white;
  font-size: 1rem;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const WeekdayContainer = styled.div`
  display: flex;
  justify-content: space-between; /* 항목 간격을 균등 배분 */
  flex-wrap: wrap;
  width: 80%; /* 부모 크기 맞춤 */
  max-width: 500px; /* 최대 너비 제한 */
  padding: 0px 0px 0px 10px
`;

const WeekdayLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 1rem;
  cursor: pointer;
`;

const WeekdayCheckbox = styled.input`
  width: 16px;
  height: 16px;
  cursor: pointer;
`;
