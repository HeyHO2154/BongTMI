package Main.Feed;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "${Front_URL}")
@RequestMapping("/api/feeds")
public class FeedController {

	@Autowired
    private FeedService feedService;

    // 전체 게시글 조회 API
    @GetMapping
    public List<Feed> getRandFeeds(@PathVariable int feedCount) {
        return feedService.getRandFeeds(feedCount);
    }
}
