USE hsj;

DROP TABLE IF EXISTS Feed;
DROP TABLE IF EXISTS Comment;

-- 후기기 테이블
CREATE TABLE Feed (
    FeedID INT AUTO_INCREMENT PRIMARY KEY,  -- 고유번호 (PK)
    title VARCHAR(255) NOT NULL,        -- 제목
    author VARCHAR(100) NOT NULL,       -- 작성자
    created_at DATETIME DEFAULT NOW(),  -- 작성시간
    content TEXT NOT NULL,              -- 내용
    likes INT DEFAULT 0,                -- 좋아요 수
    views INT DEFAULT 0                 -- 조회수
);

-- 댓글 테이블
CREATE TABLE Comment (
    id INT AUTO_INCREMENT PRIMARY KEY,  -- 고유번호 (PK)
    feed_id INT NOT NULL,               -- Feed 테이블의 고유번호 (FK)
    author VARCHAR(100) NOT NULL,       -- 작성자
    content TEXT NOT NULL,              -- 댓글 내용
    created_at DATETIME DEFAULT NOW(),  -- 작성시간
    FOREIGN KEY (feed_id) REFERENCES Feed(id) ON DELETE CASCADE
);

SELECT COUNT(*) AS total_count FROM Feed;
select * from Feed;
