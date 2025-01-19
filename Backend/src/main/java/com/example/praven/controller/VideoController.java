package com.example.praven.controller;

import java.util.List;

import javax.xml.stream.events.Comment;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.ssafit.model.Video;
import com.example.ssafit.service.CommentService;
import com.example.ssafit.service.VideoService;

@CrossOrigin(origins = "http://70.12.50.104:3000") // 프론트엔드 포트를 지정	
@RestController
@RequestMapping("/videos")
public class VideoController {

    @Autowired
    private VideoService videoService;
    
    @Autowired
    private CommentService commentService;

    @PostMapping("/getAllVideos")
    public ResponseEntity<List<Video>> getAllVideo() {
        List<Video> videos = videoService.getAllVideo(); // 여러 비디오를 반환한다고 가정
        return ResponseEntity.ok(videos); // ResponseEntity로 감싸서 반환
    }
    @PostMapping("/getCategoryVideo")
    public ResponseEntity<List<Video>> getCategoryVideo(@RequestBody Video video) {
        List<Video> videos = videoService.getCategoryVideo(video); // 여러 비디오를 반환한다고 가정
        return ResponseEntity.ok(videos); // ResponseEntity로 감싸서 반환
    }
    @PostMapping("/getSearchVideo")
    public ResponseEntity<List<Video>> getSearchVideo(@RequestBody String searchString) {
    	System.out.println(searchString);
        List<Video> videos = videoService.getSearchVideo(searchString);
        System.out.println(videos);
        return ResponseEntity.ok(videos);
    }

    @PostMapping("/getAllComments")
    public ResponseEntity<List<Comment>> getAllComments(@RequestBody Video video) {
        List<Comment> comments = commentService.getAllComments(video);
        return ResponseEntity.ok(comments);
    }
   
    @PostMapping("/addViews")
    public ResponseEntity<Video> addViews(@RequestBody Video video) {
    	Video videos = videoService.addViews(video);
        return ResponseEntity.ok(videos);
    }
    
    
    
}
