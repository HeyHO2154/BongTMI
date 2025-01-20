package Main.DTO.User;

import lombok.Data;

@Data
public class UserFollow {
    private int id;             // User 테이블의 ID (Primary Key, Foreign Key)
    private int userID;         // 팔로워의 User 테이블 ID (Foreign Key)
}
