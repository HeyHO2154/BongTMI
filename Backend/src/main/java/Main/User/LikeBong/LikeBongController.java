package Main.User.LikeBong;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "${Front_URL}")
public class LikeBongController {
	
	@Autowired
    private LikeBongService userService;

    // ✅ 공고에 대한 사용자 액션 추가 (좋아요, 싫어요, 신청하기)
    @PostMapping("/like")
    public ResponseEntity<?> likeBong(@RequestParam Long userId, @RequestParam Long bongId, @RequestParam int action) {
        LikeBong likeBong = userService.updateSelection(userId, bongId, action);
        return ResponseEntity.ok(likeBong);
    }

    // ✅ 공고에 대한 사용자 액션 제거
    @PostMapping("/unlike")
    public ResponseEntity<?> unlikeBong(@RequestParam Long userId, @RequestParam Long bongId, @RequestParam int action) {
        LikeBong likeBong = userService.removeSelection(userId, bongId, action);
        return likeBong != null ? ResponseEntity.ok(likeBong) : ResponseEntity.badRequest().body("No data found.");
    }

    // ✅ 특정 공고에 대한 사용자 상태 조회
    @GetMapping("/status")
    public ResponseEntity<?> getLikeStatus(@RequestParam Long userId, @RequestParam Long bongId) {
        int status = userService.getSelectionStatus(userId, bongId);
        return ResponseEntity.ok(status);
    }
}
