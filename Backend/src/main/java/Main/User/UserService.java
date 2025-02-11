package Main.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.Random;

import jakarta.mail.internet.MimeMessage;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JavaMailSender emailSender;

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

    public void resetPassword(String email) {
        User user = userRepository.findById(email)
            .orElseThrow(() -> new RuntimeException("해당 이메일로 등록된 계정을 찾을 수 없습니다."));

        // 임시 비밀번호 생성 (8자리)
        String temporaryPassword = generateTemporaryPassword();
        
        // 비밀번호 업데이트
        user.setPassword(temporaryPassword); // 실제 운영 시에는 암호화 필요
        userRepository.save(user);

        // 이메일 전송
        sendTemporaryPassword(email, temporaryPassword);
    }

    private String generateTemporaryPassword() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        StringBuilder sb = new StringBuilder();
        Random random = new Random();
        for (int i = 0; i < 8; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        return sb.toString();
    }

    private void sendTemporaryPassword(String email, String temporaryPassword) {
        try {
            MimeMessage message = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            
            helper.setFrom("noreply@praven.kro.kr", "봉틈이"); // 표시될 발신자 주소와 이름
            helper.setTo(email);
            helper.setSubject("[봉틈이] 임시 비밀번호가 발급되었습니다");
            helper.setText("안녕하세요.\n\n"
                + "요청하신 임시 비밀번호입니다: " + temporaryPassword + "\n\n"
                + "보안을 위해 로그인 후 반드시 비밀번호를 변경해주세요.\n\n"
                + "감사합니다.");
            
            emailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("이메일 전송에 실패했습니다: " + e.getMessage());
        }
    }
}
