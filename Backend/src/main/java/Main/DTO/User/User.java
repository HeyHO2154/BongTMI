package Main.DTO.User;

import lombok.Data;

import java.sql.Timestamp;

@Data
public class User {
    private int id;
    private String userId;
    private String userPw;
    private String nickname;
    private Timestamp createTime;
}
