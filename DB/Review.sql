USE hsj;

DROP TABLE IF EXISTS Review;
DROP TABLE IF EXISTS Comment;

-- 봉사 후기 테이블
CREATE TABLE IF NOT EXISTS Review (
    id INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT NOT NULL,
    BongID INT NOT NULL,
    title VARCHAR(255),
    image LONGBLOB COMMENT '이미지 저장 BLOB',
    context VARCHAR(255),
    createTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 봉사 후기 댓글 테이블
CREATE TABLE Comment (
    id INT PRIMARY KEY,
    ReviewID INT NOT NULL,
    UserID INT NOT NULL,
    context VARCHAR(255),
    createTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

SELECT COUNT(*) AS total_count FROM Review;
select * from Review;