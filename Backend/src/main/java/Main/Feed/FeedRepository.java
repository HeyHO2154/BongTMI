package Main.Feed;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface FeedRepository extends JpaRepository<Feed, String> {

	@Query(value = "SELECT * FROM Feed ORDER BY RAND() LIMIT 1", nativeQuery = true)
	Feed findRandomFeed();
}
