import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import config from "../../config";

const FeedAdd: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [category, setCategory] = useState(4); // 기본값은 자유게시판(4)

  const [user, setUser] = useState<{ nickname: string; email: string } | null>(null);

  // 카테고리 목록
  const categories = [
    { id: 1, label: '공지' },
    { id: 2, label: '건의' },
    { id: 3, label: '후기' },
    { id: 4, label: '자유' }
  ];

  useEffect(() => {
      const storedUser = localStorage.getItem("user");
  
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        navigate("/user/login");
      }
    }, [navigate]);
  
    if (!user) {
      return null;
    }

  // 이미지 업로드 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).slice(0, 3); // 최대 3장 제한
      setImages(files);
    }
  };

  // USR 고유번호 생성
  const generateFeedID = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    return `FEED${year}${month}${day}${hours}${minutes}${seconds}`;
  };

  // 폼 제출 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const feedID = generateFeedID();

    if (!title || !content) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    const jsonData = {
      feedID: feedID,
      title: title,
      author: user.nickname,
      createdAt: new Date().toISOString(),
      content: content,
      likes: 0,
      views: 0,
      category: category // 카테고리 추가
    };

    try {
      // 1️⃣ JSON 데이터 먼저 전송
      await axios.post(`${config.API_DEV}/api/feed/add`, JSON.stringify(jsonData), {
        headers: { "Content-Type": "application/json" },
      });

        // 2. 이미지 업로드 처리
        if (images && images.length > 0) {
            const imageFormData = new FormData();
            images.forEach((image, index) => {
                index;  //노란경고 방지
                imageFormData.append("images", image);
            });
        
            await axios.post(`${config.API_DEV}/api/bong/upload/${feedID}`, imageFormData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
        }

      alert("후기가 성공적으로 등록되었습니다!");
      navigate("/"); // 피드 목록으로 이동
    } catch (error) {
      console.error("후기 등록 실패:", error);
      alert("후기 등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <Container onSubmit={handleSubmit}>
      <Title>글 작성</Title>
      <FormGroup>
        <Label>카테고리</Label>
        <CategorySelect
          value={category}
          onChange={(e) => setCategory(Number(e.target.value))}
        >
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.label}
            </option>
          ))}
        </CategorySelect>
      </FormGroup>
      <FormGroup>
        <Label>제목</Label>
        <Input
          type="text"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </FormGroup>
      <FormGroup>
        <Label>내용</Label>
        <Textarea
          placeholder="내용을 입력하세요..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </FormGroup>
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
  align-items: center;
  height: calc(100vh - 160px);
  padding: 20px;
  gap: 20px;
  overflow-y: auto;
  background-color: #f9f9f9;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 10px;
  color: #333;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 3px;
    background-color: #007bff;
    border-radius: 2px;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  max-width: 600px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #555;
  margin-left: 4px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  font-size: 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  outline: none;
  transition: all 0.2s ease;

  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.1);
  }

  &::placeholder {
    color: #aaa;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  height: 200px;
  padding: 12px 16px;
  font-size: 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  resize: none;
  outline: none;
  transition: all 0.2s ease;

  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.1);
  }

  &::placeholder {
    color: #aaa;
  }
`;

const FileInputWrapper = styled.div`
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FileInputLabel = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #555;
  margin-left: 4px;
`;

const FileInput = styled.input`
  font-size: 14px;
  cursor: pointer;
`;

const PreviewContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  max-width: 600px;
`;

const PreviewImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #ddd;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  max-width: 600px;
  padding: 14px 20px;
  font-size: 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 600;
  text-align: center;
  margin-top: 10px;

  &:hover {
    background-color: #0056b3;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
  }
`;

// 새로운 스타일 컴포넌트 추가
const CategorySelect = styled.select`
  width: 200px;
  padding: 8px 12px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  outline: none;
  transition: all 0.2s ease;
  cursor: pointer;

  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.1);
  }

  option {
    padding: 8px;
  }
`;
