import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id: "",
    nickname: "",
    profile_image: "",
    age_range: "",
    gender: "",
    email: "",
    mobile: "",
    mobile_e164: "",
    name: "",
    birthday: "",
    birthyear: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  // 입력값 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 회원가입 요청
  const handleRegister = async () => {
    if (!formData.email || !formData.password || !formData.name || !formData.nickname) {
      setMessage("필수 정보를 입력해주세요.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/api/auth/register", formData);
      if (response.status === 201) {
        setMessage("회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (error) {
      setMessage("회원가입에 실패했습니다.");
    }
  };

  return (
    <Container>
        <Title>회원가입</Title>
        <Form>
            <Label>이름 *</Label>
            <Input type="text" name="name" value={formData.name} onChange={handleChange} required />

            <Label>닉네임 *</Label>
            <Input type="text" name="nickname" value={formData.nickname} onChange={handleChange} required />

            <Label>이메일 *</Label>
            <Input type="email" name="email" value={formData.email} onChange={handleChange} required />

            <Label>비밀번호 *</Label>
            <Input type="password" name="password" value={formData.password} onChange={handleChange} required />

            <Label>프로필 이미지 URL</Label>
            <Input type="text" name="profile_image" value={formData.profile_image} onChange={handleChange} />

            <Label>생년월일</Label>
            <DateContainer>
            <Input type="text" name="birthyear" placeholder="YYYY" value={formData.birthyear} onChange={handleChange} />
            <Input type="text" name="birthday" placeholder="MM-DD" value={formData.birthday} onChange={handleChange} />
            </DateContainer>

            <Label>성별</Label>
            <Select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="">선택</option>
            <option value="M">남성</option>
            <option value="F">여성</option>
            <option value="U">기타</option>
            </Select>

            <Label>연령대</Label>
            <Input type="text" name="age_range" value={formData.age_range} onChange={handleChange} />

            <Label>휴대폰 번호</Label>
            <Input type="text" name="mobile" placeholder="010-1234-5678" value={formData.mobile} onChange={handleChange} />

            <Label>국제표준화된 휴대폰 번호</Label>
            <Input type="text" name="mobile_e164" placeholder="+82 10-1234-5678" value={formData.mobile_e164} onChange={handleChange} />

            {message && <Message>{message}</Message>}

            <Button onClick={handleRegister}>회원가입</Button>
        </Form>
    </Container>
  );
};

export default Register;

// --------------------
// 스타일 정의
// --------------------

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 160px); /* TopBar(60px) + Navbar(60px) */
  background-color: #f8f9fa;
  overflow-y: auto; /* ✅ 스크롤 가능하게 */
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  margin-top: 15vh;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 40px;
`;

const Label = styled.label`
  font-size: 14px;
  margin-top: 12px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
`;

const DateContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  margin-top: 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;

  &:hover {
    background-color: #0056b3;
  }
`;

const Message = styled.p`
  margin-top: 15px;
  font-size: 14px;
  color: red;
  text-align: center;
`;
