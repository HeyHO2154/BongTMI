import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import config from "../../config";

const FeedAdd: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !author || !content) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    try {
      const response = await axios.post(`${config.API_DEV}/api/feeds`, {
        title,
        author,
        content,
      });

      if (response.status === 201) {
        alert("피드가 성공적으로 등록되었습니다!");
        navigate("/"); // 피드 목록 페이지로 이동
      }
    } catch (error) {
      console.error("피드 등록 실패:", error);
      alert("피드 등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <Container>
      <FormWrapper onSubmit={handleSubmit}>
        <Title>후기 작성</Title>
        <Input
          type="text"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Input
          type="text"
          placeholder="작성자 이름"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <Textarea
          placeholder="내용을 입력하세요..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <SubmitButton type="submit">등록</SubmitButton>
      </FormWrapper>
    </Container>
  );
};

export default FeedAdd;

// ✅ 스타일 정의
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f8f9fa;
`;

const FormWrapper = styled.form`
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 400px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 10px;
`;

const Input = styled.input`
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 5px;
  width: 100%;
`;

const Textarea = styled.textarea`
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 5px;
  width: 100%;
  height: 120px;
  resize: none;
`;

const SubmitButton = styled.button`
  padding: 10px;
  font-size: 18px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;
