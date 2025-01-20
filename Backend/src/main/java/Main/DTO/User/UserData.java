package Main.DTO.User;

import lombok.Data;

@Data
public class UserData {
    private int id;             // User 테이블의 ID (Primary Key, Foreign Key)
    private int age;            // 나이
    private boolean gender;     // 성별 (남성/여성)
    private String residence;   // 거주지
}
