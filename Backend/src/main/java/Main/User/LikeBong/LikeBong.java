package Main.User.LikeBong;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "LikeBong")
public class LikeBong {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // 기본 키 (Auto Increment)

    @Column(nullable = false)
    private Long bongId; // 공고 ID

    @Column(nullable = false)
    private Long userId; // 유저 ID (비로그인 시 처리 안함)

    @Column(nullable = false)
    private int selectionStatus; // 비트마스크 사용 (1: 좋아요, 2: 싫어요, 4: 신청하기)
    
    // 기본 생성자 (JPA용)
    public LikeBong() {
    }

    // 필요한 생성자 추가
    public LikeBong(Long id, Long bongId, Long userId, int selectionStatus) {
        this.id = id;
        this.bongId = bongId;
        this.userId = userId;
        this.selectionStatus = selectionStatus;
    }

    // 비트마스크 추가 기능
    public void addSelection(int status) {
        this.selectionStatus |= status; // OR 연산으로 추가
    }

    public void removeSelection(int status) {
        this.selectionStatus &= ~status; // AND 연산으로 제거
    }

    public boolean hasSelection(int status) {
        return (this.selectionStatus & status) != 0;
    }

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getBongId() {
		return bongId;
	}

	public void setBongId(Long bongId) {
		this.bongId = bongId;
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public int getSelectionStatus() {
		return selectionStatus;
	}

	public void setSelectionStatus(int selectionStatus) {
		this.selectionStatus = selectionStatus;
	}
    
    
}
