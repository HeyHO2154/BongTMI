USE hsj;

DROP TABLE IF EXISTS Chat;
DROP TABLE IF EXISTS ChatRoom;

-- 채팅방 테이블
CREATE TABLE ChatRoom (
    id INT AUTO_INCREMENT PRIMARY KEY,  -- 채팅방 고유번호 (PK)
    created_at DATETIME DEFAULT NOW()  -- 채팅방 생성 시간
);

-- 채팅 메시지 테이블
CREATE TABLE Chat (
    id INT AUTO_INCREMENT PRIMARY KEY,  -- 채팅 메시지 고유번호 (PK)
    chatroom_id INT NOT NULL,           -- ChatRoom 테이블의 외래키
    author VARCHAR(100) NOT NULL,       -- 작성자
    content TEXT NOT NULL,              -- 메시지 내용
    created_at DATETIME DEFAULT NOW(),  -- 메시지 전송 시간
    FOREIGN KEY (chatroom_id) REFERENCES ChatRoom(id) ON DELETE CASCADE
);

SELECT COUNT(*) AS total_count FROM ChatRoom;
select * from ChatRoom;