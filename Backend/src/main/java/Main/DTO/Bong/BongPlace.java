package Main.DTO.Bong;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class BongPlace {
    private int id;             // Bong 테이블의 ID (Primary Key, Foreign Key)
    private String name;        // 봉사 장소 이름
    private BigDecimal latitude;  // 위도 (DECIMAL)
    private BigDecimal longitude; // 경도 (DECIMAL)
}
