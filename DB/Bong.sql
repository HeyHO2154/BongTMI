CREATE DATABASE hsj;

USE hsj;

-- 봉사 공고 테이블
CREATE TABLE Bong (
    id INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT COMMENT '유저 외 <크롤링 기관명>',
    context VARCHAR(255),
    EndDate TIMESTAMP COMMENT '모집 마감일',
    createTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    link VARCHAR(255)
);

-- AI 공고 학습 데이터
CREATE TABLE BongData (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    StartHour INT,
    EndHour INT,
    BongPlaceID VARCHAR(255),
    verified BOOLEAN
);

-- 봉사 장소 테이블
CREATE TABLE BongPlace (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    latitude DECIMAL(9, 6) COMMENT '위도',
    longitude DECIMAL(9, 6) COMMENT '경도'
);