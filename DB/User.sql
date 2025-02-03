USE hsj;

DROP TABLE IF EXISTS User;

CREATE TABLE User (
    id VARCHAR(100) PRIMARY KEY,      -- OAuth에서 제공하는 고유 ID
    nickname VARCHAR(100),           -- 사용자 닉네임
    profile_image TEXT,              -- 프로필 이미지 URL
    age_range VARCHAR(10),           -- 연령대 (예: "20-29")
    gender VARCHAR(10),      -- 성별 (M: 남성, F: 여성, U: 기타)
    email VARCHAR(255),       -- 이메일 (중복 방지)
    mobile VARCHAR(20),              -- 휴대폰 번호
    mobile_e164 VARCHAR(20),         -- 국제 표준화된 휴대폰 번호 (+82)
    name VARCHAR(100),               -- 실명
    birthday VARCHAR(10),            -- 생일 (월-일, 예: "10-13")
    birthyear VARCHAR(4)            -- 태어난 연도 (예: "1997")
);

-- 공고 히스토리 (1+4=5, 좋아요+신청하기기)
CREATE TABLE LikeBong (
    id INT AUTO_INCREMENT PRIMARY KEY,
    BongID INT NOT NULL,
    selection_status TINYINT NOT NULL, -- 비트마스크 사용 (1: 좋아요, 2: 싫어요, 4: 신청하기)
    FOREIGN KEY (BongID) REFERENCES Bong(progrmRegistNo) ON DELETE CASCADE
);

-- 후기 히스토리
CREATE TABLE LikeFeed (
    id INT AUTO_INCREMENT PRIMARY KEY,
    FeedID INT NOT NULL,
    selection_status TINYINT NOT NULL,
    FOREIGN KEY (FeedID) REFERENCES Feed(id) ON DELETE CASCADE
);

SELECT COUNT(*) AS total_count FROM User;
select * from User;