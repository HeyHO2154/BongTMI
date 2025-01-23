DROP DATABASE hsj;
CREATE DATABASE hsj;

USE hsj;

-- 봉사 공고 테이블
CREATE TABLE IF NOT EXISTS Bong (
    progrmRegistNo VARCHAR(20) PRIMARY KEY,
    progrmSj VARCHAR(100),
    nanmmbyNm VARCHAR(50),
    progrmBgnde DATE,
    progrmEndde DATE,
    progrmSttusSe INT,
    actPlace VARCHAR(100),
    telno VARCHAR(20),
    email VARCHAR(100),
    progrmCn TEXT
);

-- AI 공고 학습 데이터
CREATE TABLE BongData (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    StartHour INT,
    EndHour INT,
    region VARCHAR(255),
    verified BOOLEAN,
    FOREIGN KEY (id) REFERENCES Bong(id) ON DELETE CASCADE
);

-- 봉사 장소 테이블
CREATE TABLE BongPlace (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    latitude DOUBLE COMMENT '위도',
    longitude DOUBLE COMMENT '경도',
    FOREIGN KEY (id) REFERENCES Bong(id) ON DELETE CASCADE
);