package Main.Bong.DTO;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "bong_place") // 데이터베이스 테이블 이름
public class BongPlace {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Primary Key 자동 증가
    private int id;             // Bong 테이블의 ID (Primary Key)

    private String name;        // 봉사 장소 이름
    private double latitude;    // 위도
    private double longitude;   // 경도
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public double getLatitude() {
		return latitude;
	}
	public void setLatitude(double latitude) {
		this.latitude = latitude;
	}
	public double getLongitude() {
		return longitude;
	}
	public void setLongitude(double longitude) {
		this.longitude = longitude;
	}

    // Getter, Setter는 Lombok(@Data)로 자동 생성
}
