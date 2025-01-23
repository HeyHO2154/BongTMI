DROP DATABASE hsj;

CREATE DATABASE hsj;

USE hsj;

-- 유저 테이블
CREATE TABLE IF NOT EXISTS User (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId VARCHAR(255) NOT NULL,
    userPw VARCHAR(255) NOT NULL,
    nickname VARCHAR(255),
    createTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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

SELECT * FROM Bong ORDER BY RAND() LIMIT 1;

select * from Bong;