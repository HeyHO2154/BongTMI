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
    <Container onSubmit={handleSubmit}>
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
        <FileInputLabel htmlFor="file-upload">사진 업로드 (최대 3장)</FileInputLabel>
        <FileInput type="file" id="file-upload" multiple accept="image/*" onChange={handleFileChange} />
        </FileInputWrapper>
      {images.length > 0 && (
        <PreviewContainer>
          {images.map((file, index) => (
            <PreviewImage key={index} src={URL.createObjectURL(file)} alt="preview" />
          ))}
        </PreviewContainer>
      )}
      <SubmitButton type="submit">등록</SubmitButton>
    </Container>
  );
};

export default FeedAdd;

// ✅ 스타일 정의 (업데이트됨)
const Container = styled.form`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 160px); /* TopBar 높이 제외 */
  padding: 20px;
  gap: 15px;
  overflow-y: auto;
  background-color: #f9f9f9;
`;

const Title = styled.h2`
  font-size: 28px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  max-width: 800px;
  padding: 14px 20px;
  font-size: 18px;
  border: 2px solid #ddd;
  border-radius: 8px;
  background: white;
  outline: none;
  transition: border 0.2s;

  &:focus {
    border-color: #007bff;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  max-width: 800px;
  height: 220px;
  padding: 14px 20px;
  font-size: 18px;
  border: 2px solid #ddd;
  border-radius: 8px;
  background: white;
  resize: none;
  outline: none;
  transition: border 0.2s;

  &:focus {
    border-color: #007bff;
  }
`;

const FileInputWrapper = styled.div`
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 18px;
  padding: 10px 0;
`;

const FileInputLabel = styled.label`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
`;

const FileInput = styled.input`
  font-size: 18px;
  cursor: pointer;
`;

const PreviewContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  max-width: 800px;
`;

const PreviewImage = styled.img`
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  border: 2px solid #ddd;
`;

const SubmitButton = styled.button`
  width: 100%;
  max-width: 800px;
  padding: 15px 20px;
  font-size: 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s, transform 0.2s;
  font-weight: bold;
  text-align: center;

  &:hover {
    background-color: #0056b3;
    transform: scale(1.02);
  }
`;
