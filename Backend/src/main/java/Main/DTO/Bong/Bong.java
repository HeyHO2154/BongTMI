package Main.DTO.Bong;

import lombok.Data;

import java.sql.Timestamp;

@Data
public class Bong {
    private int id;
    private int userID; // User 테이블의 ID 또는 외부 기관명
    private String context;
    private Timestamp endDate;
    private Timestamp createTime;
    private String link;
}
