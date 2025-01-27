package Main.Bong;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class BongService {

    @Autowired
    private BongRepository bongRepository;

    public Bong getRandomBong() {
        Bong bong = bongRepository.findRandomBong();
        if (bong == null) {
            throw new RuntimeException("랜덤으로 선택된 공고가 없습니다.");
        }

        return bong;
    }

	public ResponseEntity<Bong> getInfoBong(String progrmRegistNo) {
		Optional<Bong> bong = bongRepository.findById(progrmRegistNo);
        if (bong.isPresent()) {
            return ResponseEntity.ok(bong.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
	}
}

