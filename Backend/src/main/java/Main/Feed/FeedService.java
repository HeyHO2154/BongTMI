package Main.Feed;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FeedService {

    private final FeedRepository feedRepository;

    // 생성자 주입 방식 사용
    @Autowired
    public FeedService(FeedRepository feedRepository) {
        this.feedRepository = feedRepository;
    }

    // 전체 게시글 조회
    public List<Feed> getAllFeeds() {
        return feedRepository.findAll();
    }

    // 특정 게시글 조회
    public Feed getFeedById(String feedID) {
        return feedRepository.findById(feedID)
                .orElseThrow(() -> new IllegalArgumentException("게시글이 존재하지 않습니다: " + feedID));
    }
}
