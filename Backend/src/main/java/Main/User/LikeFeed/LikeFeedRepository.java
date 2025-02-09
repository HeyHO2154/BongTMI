package Main.User.LikeFeed;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface LikeFeedRepository extends JpaRepository<LikeFeed, Long> {
    Optional<LikeFeed> findByUserIdAndFeedId(String userId, String feedId);

    // ✅ 특정 피드의 총 좋아요 개수를 반환하는 메서드
    int countByFeedId(String feedId);
}
