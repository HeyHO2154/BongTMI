package Main.User.LikeBong;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LikeBongService {
	
	@Autowired
    private LikeBongRepository likeBongRepository;

    // ✅ 공고에 대한 사용자 액션 추가 (좋아요, 싫어요, 신청하기)
    public LikeBong updateSelection(Long userId, Long bongId, int action) {
        Optional<LikeBong> existingLike = likeBongRepository.findByUserIdAndBongId(userId, bongId);
        LikeBong likeBong;

        if (existingLike.isPresent()) {
            likeBong = existingLike.get();
            likeBong.addSelection(action); // 비트마스크로 상태 추가
        } else {
            likeBong = new LikeBong(null, bongId, userId, action);
        }

        return likeBongRepository.save(likeBong);
    }

    // ✅ 공고에 대한 사용자 액션 제거
    public LikeBong removeSelection(Long userId, Long bongId, int action) {
        Optional<LikeBong> existingLike = likeBongRepository.findByUserIdAndBongId(userId, bongId);
        if (existingLike.isPresent()) {
            LikeBong likeBong = existingLike.get();
            likeBong.removeSelection(action);
            return likeBongRepository.save(likeBong);
        }
        return null;
    }

    // ✅ 특정 공고에 대한 사용자의 선택 상태 조회
    public Integer getSelectionStatus(Long userId, Long bongId) {
        return likeBongRepository.findByUserIdAndBongId(userId, bongId)
                .map(LikeBong::getSelectionStatus)
                .orElse(0);
    }
}
