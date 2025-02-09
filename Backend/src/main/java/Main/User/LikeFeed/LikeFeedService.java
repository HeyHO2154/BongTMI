package Main.User.LikeFeed;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LikeFeedService {

    @Autowired
    private LikeFeedRepository likeFeedRepository;

    // ✅ 좋아요 추가 또는 취소 (비트마스크 사용)
    public LikeFeed updateSelection(String userId, String feedId, int action) {
        Optional<LikeFeed> existingLike = likeFeedRepository.findByUserIdAndFeedId(userId, feedId);
        LikeFeed likeFeed;

        if (existingLike.isPresent()) {
            likeFeed = existingLike.get();
            if (action == 0) {
                // ✅ action == 0 이면 좋아요 취소 (DB에서 삭제)
                likeFeedRepository.delete(likeFeed);
                return null;
            } else {
                // ✅ 기존 좋아요 값 업데이트
                likeFeed.setSelectionStatus(action);
            }
        } else {
            if (action == 0) return null; // 이미 좋아요가 없는 상태에서 취소 요청이 오면 무시
            likeFeed = new LikeFeed(userId, feedId, action);
        }

        return likeFeedRepository.save(likeFeed);
    }

    // ✅ 피드의 총 좋아요 개수를 가져오는 메서드 추가
    public int getTotalLikes(String feedId) {
        return likeFeedRepository.countByFeedId(feedId); // ✅ 해당 피드의 총 좋아요 개수 반환
    }

    
    // ✅ 사용자가 특정 피드에 좋아요를 눌렀는지 확인
    public boolean isUserLikedFeed(String userId, String feedId) {
        return likeFeedRepository.findByUserIdAndFeedId(userId, feedId).isPresent();
    }
}
