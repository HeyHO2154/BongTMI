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
  const [images, setImages] = useState<File[]>([]);

  // 이미지 업로드 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).slice(0, 3); // 최대 3장 제한
      setImages(files);
    }
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !author || !content) {
      alert("제목, 작성자, 내용을 입력해주세요.");
      return;
    }

    try {
      // 1️⃣ 피드 데이터 먼저 전송
      const response = await axios.post(`${config.API_DEV}/api/feeds`, {
        title,
        author,
        content,
      });

      if (response.status === 201) {
        const feedID = response.data.feedID; // 새로 생성된 피드 ID

        // 2️⃣ 이미지 업로드 처리 (선택 사항)
        if (images.length > 0) {
          const formData = new FormData();
          images.forEach((image) => formData.append("images", image));

          await axios.post(`${config.API_DEV}/api/feeds/upload/${feedID}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        }

        alert("후기가 성공적으로 등록되었습니다!");
        navigate("/"); // 피드 목록으로 이동
      }
    } catch (error) {
      console.error("후기 등록 실패:", error);
      alert("후기 등록 중 오류가 발생했습니다.");
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
        <FileInputWrapper>
          <label htmlFor="file-upload">사진 업로드 (최대 3장)</label>
          <FileInput
            type="file"
            id="file-upload"
            multiple
            accept="image/*"
            onChange={handleFileChange}
          />
        </FileInputWrapper>
        {images.length > 0 && (
          <PreviewContainer>
            {images.map((file, index) => (
              <PreviewImage key={index} src={URL.createObjectURL(file)} alt="preview" />
            ))}
          </PreviewContainer>
        )}
        <SubmitButton type="submit">등록</SubmitButton>
      </FormWrapper>
    </Container>
  );
};

export default FeedAdd;

// ✅ 스타일 정의
const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9f9f9;
`;

const FormWrapper = styled.form`
  background: #fff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 80%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Title = styled.h2`
  text-align: center;
  font-size: 24px;
  font-weight: bold;
`;

const Input = styled.input`
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 5px;
  width: 100%;
`;

const Textarea = styled.textarea`
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 5px;
  width: 100%;
  height: 150px;
  resize: none;
`;

const FileInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FileInput = styled.input`
  font-size: 16px;
`;

const PreviewContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const PreviewImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 5px;
`;

const SubmitButton = styled.button`
  padding: 12px;
  font-size: 18px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;
