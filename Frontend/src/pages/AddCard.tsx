import React from "react";
import styled from "styled-components";

const AddCard: React.FC = () => {
  return (
    <Wrapper>
      <Title>봉사 공고 등록</Title>
      <Form>
        <Section>
          <SectionTitle>기본 정보</SectionTitle>
          <FormGrid>
            <FormGroup>
              <Label>프로그램 등록 번호</Label>
              <Input type="text" placeholder="예: PR12345678" />
            </FormGroup>

            <FormGroup>
              <Label>봉사 제목</Label>
              <Input type="text" placeholder="봉사 제목을 입력하세요" />
            </FormGroup>

            <FormGroup>
              <Label>모집 상태</Label>
              <Select>
                <option value="1">모집대기</option>
                <option value="2">모집중</option>
                <option value="3">모집완료</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>모집 인원</Label>
              <Input type="number" placeholder="예: 10" />
            </FormGroup>
          </FormGrid>
        </Section>

        <Section>
          <SectionTitle>날짜 및 시간</SectionTitle>
          <FormGrid>
            <FormGroup>
              <Label>봉사 시작일</Label>
              <Input type="date" />
            </FormGroup>

            <FormGroup>
              <Label>봉사 종료일</Label>
              <Input type="date" />
            </FormGroup>

            <FormGroup>
              <Label>봉사 시작 시간</Label>
              <Input type="number" placeholder="예: 9 (24시간 형식)" />
            </FormGroup>

            <FormGroup>
              <Label>봉사 종료 시간</Label>
              <Input type="number" placeholder="예: 18 (24시간 형식)" />
            </FormGroup>

            <FormGroup>
              <Label>모집 시작일</Label>
              <Input type="date" />
            </FormGroup>

            <FormGroup>
              <Label>모집 종료일</Label>
              <Input type="date" />
            </FormGroup>
          </FormGrid>
        </Section>

        <Section>
          <SectionTitle>기타 정보</SectionTitle>
          <FormGrid>
            <FormGroup>
              <Label>활동 요일</Label>
              <Input type="text" placeholder="예: 1111100 (월~일)" />
            </FormGroup>

            <FormGroup>
              <Label>봉사 분야</Label>
              <Input type="text" placeholder="봉사 분야를 입력하세요" />
            </FormGroup>

            <FormGroup>
              <Label>성인 가능 여부</Label>
              <Select>
                <option value="Y">Y</option>
                <option value="N">N</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>청소년 가능 여부</Label>
              <Select>
                <option value="Y">Y</option>
                <option value="N">N</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>단체 가능 여부</Label>
              <Select>
                <option value="Y">Y</option>
                <option value="N">N</option>
              </Select>
            </FormGroup>
          </FormGrid>
        </Section>

        <Section>
          <SectionTitle>연락처 및 기타</SectionTitle>
          <FormGrid>
            <FormGroup>
              <Label>모집 기관명</Label>
              <Input type="text" placeholder="기관명을 입력하세요" />
            </FormGroup>

            <FormGroup>
              <Label>등록 기관명</Label>
              <Input type="text" placeholder="등록 기관명을 입력하세요" />
            </FormGroup>

            <FormGroup>
              <Label>봉사 장소</Label>
              <Input type="text" placeholder="봉사 장소를 입력하세요" />
            </FormGroup>

            <FormGroup>
              <Label>담당자명</Label>
              <Input type="text" placeholder="담당자명을 입력하세요" />
            </FormGroup>

            <FormGroup>
              <Label>전화번호</Label>
              <Input type="text" placeholder="전화번호를 입력하세요" />
            </FormGroup>

            <FormGroup>
              <Label>FAX 번호</Label>
              <Input type="text" placeholder="FAX 번호를 입력하세요" />
            </FormGroup>

            <FormGroup>
              <Label>담당자 주소</Label>
              <Input type="text" placeholder="담당자 주소를 입력하세요" />
            </FormGroup>

            <FormGroup>
              <Label>이메일</Label>
              <Input type="email" placeholder="이메일을 입력하세요" />
            </FormGroup>
          </FormGrid>
        </Section>

        <Section>
          <SectionTitle>내용</SectionTitle>
          <Textarea placeholder="내용을 입력하세요"></Textarea>
        </Section>

        <SubmitButton>등록</SubmitButton>
      </Form>
    </Wrapper>
  );
};

export default AddCard;

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

const SubmitButton = styled.button`
  padding: 12px 20px;
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
