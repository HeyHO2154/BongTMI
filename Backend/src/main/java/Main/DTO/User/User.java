import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false, unique = true)
    private String userId;

    @Column(nullable = false)
    private String userPw;

    private String nickname;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createTime = LocalDateTime.now();
}
