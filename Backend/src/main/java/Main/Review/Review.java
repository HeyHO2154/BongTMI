package Main.Review;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "reviews")
@Getter
@Setter
@NoArgsConstructor
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String content; // 봉사 후기 내용

    @Column(nullable = false)
    private String author; // 작성자

    public Review(String content, String author) {
        this.content = content;
        this.author = author;
    }
}
