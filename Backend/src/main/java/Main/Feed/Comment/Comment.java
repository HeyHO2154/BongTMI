package Main.Feed.Comment;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "Comment")
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // ✅ 자동 증가 ID
    private Long commentId;

    @Column(name = "FeedID", nullable = false)
    private String feedId;

    @Column(name = "UserID", nullable = false)
    private String userId;

    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Comment() {} // 기본 생성자 필수

    public Comment(String feedId, String userId, String content) {
        this.feedId = feedId;
        this.userId = userId;
        this.content = content;
        this.createdAt = LocalDateTime.now();
    }

    // ✅ Getter & Setter
    public Long getCommentId() {
        return commentId;
    }

    public String getFeedId() {
        return feedId;
    }

    public String getUserId() {
        return userId;
    }

    public String getContent() {
        return content;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
