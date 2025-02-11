USE hsj;

DROP TABLE IF EXISTS Feed;
DROP TABLE IF EXISTS Comment;

-- 후기 테이블
CREATE TABLE Feed (
    FeedID VARCHAR(100) PRIMARY KEY,    -- 고유번호 (PK)
    title VARCHAR(255) NOT NULL,        -- 제목
    author VARCHAR(100) NOT NULL,       -- 작성자
    created_at DATETIME DEFAULT NOW(),  -- 작성시간
    content TEXT NOT NULL,              -- 내용
    likes INT DEFAULT 0,                -- 좋아요 수
    views INT DEFAULT 0,                -- 조회수
    category INT DEFAULT 0              -- 카테고리 (0:전체/미분류, 1:공지, 2:건의, 3:후기, 4:자유)
);

-- 댓글 테이블
CREATE TABLE Comment (
    CommentID BIGINT AUTO_INCREMENT PRIMARY KEY, -- ✅ 새로운 PK (자동 증가)
    FeedID VARCHAR(100) NOT NULL,               -- Feed 테이블의 고유번호 (FK)
    UserID VARCHAR(100) NOT NULL,               -- 작성자
    nickname VARCHAR(100),                      -- 사용자 닉네임
    content TEXT NOT NULL,                      -- 댓글 내용
    created_at DATETIME DEFAULT NOW()           -- 작성시간
);

SELECT COUNT(*) AS total_count FROM Feed;
SELECT * FROM Feed;
