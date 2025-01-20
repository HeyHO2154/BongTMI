package Main.DTO.Review;

import lombok.Data;

import java.sql.Timestamp;

@Data
public class Review {
    private int id;
    private int userID;  // User 테이블의 외래키
    private int bongID;  // Bong 테이블의 외래키
    private String title;
    private byte[] image; // 이미지 데이터를 저장하는 BLOB
    private String context;
    private Timestamp createTime;
}
