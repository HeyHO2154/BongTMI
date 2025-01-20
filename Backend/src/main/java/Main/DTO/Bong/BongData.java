package Main.DTO.Bong;

import lombok.Data;

@Data
public class BongData {
    private int id;            // Bong 테이블의 ID (Primary Key, Foreign Key)
    private String title;      // 공고 제목
    private int startHour;     // 시작 시간
    private int endHour;       // 종료 시간
    private String bongPlaceID; // 봉사 장소 ID
    private boolean verified;  // 검증 여부
}
