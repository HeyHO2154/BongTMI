package Main.User;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, String> {
    // 필요한 경우 커스텀 쿼리 추가 가능
}
