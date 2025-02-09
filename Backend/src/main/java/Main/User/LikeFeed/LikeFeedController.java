package Main.User.LikeFeed;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/feed")
@CrossOrigin(origins = "${Front_URL}")
public class LikeFeedController {
    @Autowired
    private LikeFeedService likeFeedService;

    // ✅ 피드에 대한 사용자 액션 추가 (좋아요, 싫어요, 신청하기)
    @PostMapping("/like")
    public ResponseEntity<?> likeFeed(@RequestParam String userId, @RequestParam String feedId, @RequestParam int action) {
        LikeFeed likeFeed = likeFeedService.updateSelection(userId, feedId, action);
        return ResponseEntity.ok(likeFeed);
    }
}
