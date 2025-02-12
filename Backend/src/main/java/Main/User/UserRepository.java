package Main.User;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import Main.Bong.Bong;
import Main.Feed.Feed;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    // 필요한 경우 커스텀 쿼리 추가 가능

    @Query("SELECT b FROM Bong b WHERE b.progrmRegistNo IN " +
           "(SELECT lb.bongId FROM LikeBong lb WHERE lb.userId = :userId AND lb.selectionStatus IN (1, 4))")
    List<Bong> findLikedBongs(@Param("userId") String userId);

    @Query("SELECT f FROM Feed f WHERE f.userId = :userId")
    List<Feed> findFeedsByUserId(@Param("userId") String userId);

    @Query("SELECT f FROM Feed f WHERE f.feedId IN " +
           "(SELECT lf.feedId FROM LikeFeed lf WHERE lf.userId = :userId)")
    List<Feed> findLikedFeeds(@Param("userId") String userId);
}
