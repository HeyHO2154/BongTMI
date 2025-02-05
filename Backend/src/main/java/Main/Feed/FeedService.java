package Main.Feed;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import Main.Bong.Bong;

@Service
public class FeedService {

	@Autowired
    private FeedRepository feedRepository;

    // 전체 게시글 조회
    public List<Feed> getRandFeeds(int feedCount) {
    	List<Feed> Feeds = new ArrayList<>();
    	for (int i = 0; i < feedCount; i++) {
    		Feeds.add(feedRepository.findRandomFeed());
		}
        return Feeds;
    }
    
    public Feed saveFeed(Feed feedDto) {
    	Feed feed = new Feed();
    	feed.setAuthor(feedDto.getAuthor());
    	feed.setContent(feed.getContent());
    	feed.setFeedID(feedDto.getFeedID());
    	feed.setTitle(feedDto.getTitle());
        return feedRepository.save(feed);
    }


}
