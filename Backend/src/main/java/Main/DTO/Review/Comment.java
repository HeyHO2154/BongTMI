package Main.DTO.Review;

import lombok.Data;

import java.sql.Timestamp;

@Data
public class Comment {
    private int id;             // Review 테이블의 ID (Primary Key, Foreign Key)
    private int reviewID;       // Review 테이블의 ID (Foreign Key)
    private int userID;         // User 테이블의 ID (Foreign Key)
    private String context;     // 댓글 내용
    private Timestamp createTime; // 댓글 작성 시간
}
