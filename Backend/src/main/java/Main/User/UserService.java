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

        // 비밀번호 암호화 (실제 구현 시 추가 필요)
        // user.setPassword(passwordEncoder.encode(user.getPassword()));

        // 사용자 저장
        return userRepository.save(user);
    }

    public User login(String email, String password) {
        User user = userRepository.findById(email)
            .orElseThrow(() -> new RuntimeException("이메일 또는 비밀번호가 일치하지 않습니다."));

        // 비밀번호 검증 (실제 운영 시에는 암호화된 비밀번호 비교 필요)
        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("이메일 또는 비밀번호가 일치하지 않습니다.");
        }

        return user;
    }
}
