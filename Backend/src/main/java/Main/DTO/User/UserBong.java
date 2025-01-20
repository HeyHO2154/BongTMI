package Main.DTO.User;

import lombok.Data;

@Data
public class UserBong {
    private int id;             // User 테이블의 ID (Primary Key, Foreign Key)
    private int bongID;         // Bong 테이블의 ID (Foreign Key)
    private int status;         // 상태 (다음: 0, 좋아요: 1, 신청하기: 2)
}
