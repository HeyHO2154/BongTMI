package Main.Repository.Bong;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import Main.DTO.Bong.Bong;

@Repository
public interface BongRepository extends JpaRepository<Bong, Integer> {
    // 필요한 경우 커스텀 메서드 정의
}
