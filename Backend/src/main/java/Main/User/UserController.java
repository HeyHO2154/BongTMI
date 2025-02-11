package Main.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {
            // 필수 필드 검증
            if (user.getEmail() == null || user.getPassword() == null || 
                user.getName() == null || user.getNickname() == null) {
                return new ResponseEntity<>("필수 정보가 누락되었습니다.", HttpStatus.BAD_REQUEST);
            }

            // 이메일을 ID로 사용
            user.setId(user.getEmail());
            
            User savedUser = userService.registerUser(user);
            return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("회원가입 처리 중 오류가 발생했습니다: " + e.getMessage(), 
                                     HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
