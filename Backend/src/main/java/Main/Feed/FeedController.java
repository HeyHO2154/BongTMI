package Main.Feed;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "${Front_URL}")
@RequestMapping("/api/feeds")
public class FeedController {

    private final FeedService feedService;

    @Autowired
    public FeedController(FeedService feedService) {
        this.feedService = feedService;
    }

    // 전체 게시글 조회 API
    @GetMapping
    public List<Feed> getAllFeeds() {
        return feedService.getAllFeeds();
    }

    // 특정 게시글 조회 API
    @GetMapping("/{feedID}")
    public Feed getFeedById(@PathVariable String feedID) {
        return feedService.getFeedById(feedID);
    }
}
