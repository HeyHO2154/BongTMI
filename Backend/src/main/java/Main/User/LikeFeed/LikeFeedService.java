package Main.User.LikeFeed;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LikeFeedService {
	
	@Autowired
    private LikeFeedRepository likeFeedRepository;

	// ✅ 기존 데이터가 있으면 업데이트, 없으면 새로 생성
    public LikeFeed updateSelection(String userId, String feedId, int action) {
        Optional<LikeFeed> existingLike = likeFeedRepository.findByUserIdAndFeedId(userId, feedId);
        LikeFeed likeFeed;

        if (existingLike.isPresent()) {
            likeFeed = existingLike.get();
            likeFeed.setSelectionStatus(action); // ✅ 기존 값 덮어쓰기
        } else {
            likeFeed = new LikeFeed(userId, feedId, action); // ✅ 새로 생성
        }

        return likeFeedRepository.save(likeFeed);
    }

}
