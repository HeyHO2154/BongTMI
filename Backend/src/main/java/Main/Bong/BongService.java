package Main.Bong;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import Main.Bong.DTO.Bong;
import Main.Bong.Repo.BongRepository;

@Service
public class BongService {

    @Autowired
    private BongRepository bongRepository;

    public Bong getRandomBong() {
        Bong bong = bongRepository.findRandomBong();
        if (bong == null) {
            throw new RuntimeException("랜덤으로 선택된 공고가 없습니다.");
        }

        // 디버깅: 매핑된 데이터 출력
        System.out.println("Fetched Bong Data: " + bong.toString());

        return bong;
    }
}

