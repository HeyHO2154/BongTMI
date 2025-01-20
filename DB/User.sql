-- AI 유저 학습 데이터
CREATE TABLE UserData (
    id INT PRIMARY KEY,
    age INT,
    gender BOOLEAN,
    residence VARCHAR(255),
    FOREIGN KEY (id) REFERENCES User(id) ON DELETE CASCADE
);

-- 유저 - 공고 테이블
CREATE TABLE UserBong (
    id INT PRIMARY KEY,
    BongID INT NOT NULL,
    status INT COMMENT '다음에 0, 좋아요 1, 신청하기 2',
    FOREIGN KEY (id) REFERENCES User(id) ON DELETE CASCADE,
    FOREIGN KEY (BongID) REFERENCES Bong(id) ON DELETE CASCADE
);

-- 유저 - 유저 테이블 (팔로워 관계)
CREATE TABLE UserFollow (
    id INT PRIMARY KEY,
    UserID INT NOT NULL COMMENT '팔로워',
    FOREIGN KEY (id) REFERENCES User(id) ON DELETE CASCADE,
    FOREIGN KEY (UserID) REFERENCES User(id) ON DELETE CASCADE
);
