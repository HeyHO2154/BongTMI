package Main.Feed;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "${Front_URL}")
@RequestMapping("/api/feeds")
public class FeedController {

	@Autowired
    private FeedService feedService;

    // 전체 게시글 조회 API
    @GetMapping
    public List<Feed> getRandFeeds(@RequestParam int feedCount) {
        return feedService.getRandFeeds(feedCount);
    }
    
    @PostMapping("/add")
    public Feed saveBong(@RequestBody Feed feedDto) {
        return feedService.saveFeed(feedDto);
    }
}
