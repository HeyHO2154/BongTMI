package Main.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User registerUser(User user) {
        // 이메일 중복 체크
        if (userRepository.findById(user.getEmail()).isPresent()) {
            throw new RuntimeException("이미 등록된 이메일입니다.");
        }

        // ID를 이메일로 설정
        user.setId(user.getEmail());

        // 사용자 저장
        return userRepository.save(user);
    }

    public User login(String email, String password) {
        // 이메일로 사용자 찾기 (이메일이 ID로 사용됨)
        User user = userRepository.findById(email)
            .orElseThrow(() -> new RuntimeException("이메일 또는 비밀번호가 일치하지 않습니다."));

        // 비밀번호 검증
        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("이메일 또는 비밀번호가 일치하지 않습니다.");
        }

        // 민감한 정보 제거
        user.setPassword(null);  // 클라이언트에게 비밀번호 정보를 보내지 않음
        
        return user;
    }
}
