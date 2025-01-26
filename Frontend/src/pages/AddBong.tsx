import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";

const AddBong: React.FC = () => {
  const [formData, setFormData] = useState({
    progrmRegistNo: "",
    progrmSj: "",
    progrmSttusSe: "1",
    progrmBgnde: "",
    progrmEndde: "",
    actBeginTm: "",
    actEndTm: "",
    noticeBgnde: "",
    noticeEndde: "",
    rcritNmpr: "",
    actWkdy: "",
    srvcClCode: "",
    adultPosblAt: "Y",
    yngbgsPosblAt: "Y",
    grpPosblAt: "Y",
    mnnstNm: "",
    nanmmbyNm: "",
    actPlace: "",
    nanmmbyNmAdmn: "",
    telno: "",
    fxnum: "",
    postAdres: "",
    email: "",
    progrmCn: "",
    sidoCd: "",
    gugunCd: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://your-backend-url/api/bong", formData);
      console.log("Submission successful:", response.data);
      alert("봉사 공고 등록이 완료되었습니다!");
    } catch (error) {
      console.error("Submission error:", error);
      alert("등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <Wrapper>
      <Title>봉사 공고 등록</Title>
      <Form onSubmit={handleSubmit}>
        <Section>
          <SectionTitle>기본 정보</SectionTitle>
          <FormGrid>
            <FormGroup>
              <Label>프로그램 등록 번호</Label>
              <Input
                type="text"
                name="progrmRegistNo"
                placeholder="예: PR12345678"
                value={formData.progrmRegistNo}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label>봉사 제목</Label>
              <Input
                type="text"
                name="progrmSj"
                placeholder="봉사 제목을 입력하세요"
                value={formData.progrmSj}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label>모집 상태</Label>
              <Select name="progrmSttusSe" value={formData.progrmSttusSe} onChange={handleChange}>
                <option value="1">모집대기</option>
                <option value="2">모집중</option>
                <option value="3">모집완료</option>
              </Select>
            </FormGroup>
          </FormGrid>
        </Section>

        <Section>
          <SectionTitle>날짜 및 시간</SectionTitle>
          <FormGrid>
            <FormGroup>
              <Label>봉사 시작일</Label>
              <Input
                type="date"
                name="progrmBgnde"
                value={formData.progrmBgnde}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label>봉사 종료일</Label>
              <Input
                type="date"
                name="progrmEndde"
                value={formData.progrmEndde}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label>봉사 시작 시간</Label>
              <Input
                type="number"
                name="actBeginTm"
                placeholder="예: 9 (24시간 형식)"
                value={formData.actBeginTm}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label>봉사 종료 시간</Label>
              <Input
                type="number"
                name="actEndTm"
                placeholder="예: 18 (24시간 형식)"
                value={formData.actEndTm}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label>모집 시작일</Label>
              <Input
                type="date"
                name="noticeBgnde"
                value={formData.noticeBgnde}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label>모집 종료일</Label>
              <Input
                type="date"
                name="noticeEndde"
                value={formData.noticeEndde}
                onChange={handleChange}
              />
            </FormGroup>
          </FormGrid>
        </Section>

        <Section>
          <SectionTitle>인원 및 활동</SectionTitle>
          <FormGrid>
            <FormGroup>
              <Label>모집 인원</Label>
              <Input
                type="number"
                name="rcritNmpr"
                placeholder="예: 10"
                value={formData.rcritNmpr}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label>활동 요일</Label>
              <Input
                type="text"
                name="actWkdy"
                placeholder="예: 1111100 (월~일)"
                value={formData.actWkdy}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label>봉사 분야</Label>
              <Input
                type="text"
                name="srvcClCode"
                placeholder="봉사 분야를 입력하세요"
                value={formData.srvcClCode}
                onChange={handleChange}
              />
            </FormGroup>
          </FormGrid>
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
          <SectionTitle>기관 및 장소</SectionTitle>
          <FormGrid>
            <FormGroup>
              <Label>모집 기관명</Label>
              <Input
                type="text"
                name="mnnstNm"
                placeholder="모집 기관명을 입력하세요"
                value={formData.mnnstNm}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label>등록 기관명</Label>
              <Input
                type="text"
                name="nanmmbyNm"
                placeholder="등록 기관명을 입력하세요"
                value={formData.nanmmbyNm}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label>봉사 장소</Label>
              <Input
                type="text"
                name="actPlace"
                placeholder="봉사 장소를 입력하세요"
                value={formData.actPlace}
                onChange={handleChange}
              />
            </FormGroup>
          </FormGrid>
        </Section>

        <Section>
          <SectionTitle>담당자 정보</SectionTitle>
          <FormGrid>
            <FormGroup>
              <Label>담당자명</Label>
              <Input
                type="text"
                name="nanmmbyNmAdmn"
                placeholder="담당자명을 입력하세요"
                value={formData.nanmmbyNmAdmn}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label>전화번호</Label>
              <Input
                type="text"
                name="telno"
                placeholder="전화번호를 입력하세요"
                value={formData.telno}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label>FAX 번호</Label>
              <Input
                type="text"
                name="fxnum"
                placeholder="FAX 번호를 입력하세요"
                value={formData.fxnum}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label>담당자 주소</Label>
              <Input
                type="text"
                name="postAdres"
                placeholder="담당자 주소를 입력하세요"
                value={formData.postAdres}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label>이메일</Label>
              <Input
                type="email"
                name="email"
                placeholder="이메일을 입력하세요"
                value={formData.email}
                onChange={handleChange}
              />
            </FormGroup>
          </FormGrid>
        </Section>

        <Section>
          <SectionTitle>내용</SectionTitle>
          <Textarea
            name="progrmCn"
            placeholder="내용을 입력하세요"
            value={formData.progrmCn}
            onChange={handleChange}
          />
        </Section>

        <Button>
          <SubmitButton type="submit">등록</SubmitButton>
        </Button>
      </Form>
    </Wrapper>
  );
};

export default AddBong;

// --------------------
// 스타일 정의
// --------------------
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 154px); /* TopBar(60px) + NavBar(90px) 제외 */
  box-sizing: border-box;
  overflow-y: auto;
  background-color: #f9f9f9;
  padding: 16px;
  margin-bottom: 90px; /* 하단바 높이 */
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
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); /* 반응형 그리드 */
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
  height: 150px; /* 세로를 길게 */
  width: 100%; /* 가로를 전체 채움 */
`;

const Button = styled.div` /* <form>에서 <div>로 변경 */
  display: flex;
  flex-direction: column;
  align-items: center; /* 버튼과 폼 요소를 가로 중앙 정렬 */
  gap: 16px; /* 각 필드 간 간격 */
`;


const SubmitButton = styled.button`
  padding: 12px 16px; /* 패딩을 줄여 가로 길이를 조정 */
  background-color: #007bff;
  color: white;
  font-size: 1rem;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 150px; /* 버튼의 고정된 가로 길이 설정 */

  &:hover {
    background-color: #0056b3;
  }
`;

