CREATE DATABASE hsj;

USE hsj;

-- 유저 테이블
CREATE TABLE User (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId VARCHAR(255) NOT NULL,
    userPw VARCHAR(255) NOT NULL,
    nickname VARCHAR(255),
    createTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AI 유저 학습 데이터
CREATE TABLE UserData (
    id INT AUTO_INCREMENT PRIMARY KEY,
    age INT,
    gender BOOLEAN,
    residence VARCHAR(255)
);

-- 유저 - 공고 테이블
CREATE TABLE UserBong (
    id INT AUTO_INCREMENT PRIMARY KEY,
    BongID INT NOT NULL,
    status INT COMMENT '싫어요 0, 좋아요 1, 신청 2'
);

-- 유저 - 유저 테이블 (팔로워 관계)
CREATE TABLE UserFollow (
    id INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT NOT NULL COMMENT '팔로워'
);