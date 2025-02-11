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

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  max-width: 800px;
`;

const Label = styled.label`
  font-size: 16px;
  font-weight: bold;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 20px;
  font-size: 16px;
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
  height: 220px;
  padding: 14px 20px;
  font-size: 16px;
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

// 새로운 스타일 컴포넌트 추가
const CategorySelect = styled.select`
  width: 100%;
  padding: 14px 20px;
  font-size: 16px;
  border: 2px solid #ddd;
  border-radius: 8px;
  background: white;
  outline: none;
  transition: border 0.2s;
  cursor: pointer;

  &:focus {
    border-color: #007bff;
  }

  option {
    padding: 10px;
  }
`;
