package Main.User.LikeBong;

import jakarta.persistence.*;

@Entity
@Table(name = "LikeBong")
public class LikeBong {
    @Id
    @Column(length = 100, nullable = false)
    private String userId; // ✅ VARCHAR(100) → String 타입 변경 (OAuth ID 지원)

    @Column(length = 100, nullable = false)
    private String bongId; // ✅ VARCHAR(100) → String 타입 변경

    @Column(nullable = false)
    private int selectionStatus; // ✅ 기본값 0 설정

    public LikeBong() {
        this.selectionStatus = 0; // ✅ 기본값 0
    }

    // ✅ 모든 필드를 포함하는 생성자 추가
    public LikeBong(String userId, String bongId, int selectionStatus) {
        this.userId = userId;
        this.bongId = bongId;
        this.selectionStatus = selectionStatus;
    }

    // ✅ Getter & Setter 추가
    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getBongId() {
        return bongId;
    }

    public void setBongId(String bongId) {
        this.bongId = bongId;
    }

    public int getSelectionStatus() {
        return selectionStatus;
    }

    public void setSelectionStatus(int selectionStatus) {
        this.selectionStatus = selectionStatus;
    }

    // ✅ 비트마스크 추가 기능
    public void addSelection(int status) {
        this.selectionStatus |= status; // OR 연산으로 추가
    }

    public void removeSelection(int status) {
        this.selectionStatus &= ~status; // AND 연산으로 제거
    }

    public boolean hasSelection(int status) {
        return (this.selectionStatus & status) != 0;
    }
}
