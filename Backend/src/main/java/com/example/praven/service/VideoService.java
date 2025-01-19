package com.example.praven.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.ssafit.mapper.VideoMapper;
import com.example.ssafit.model.Video;

@Service
public class VideoService {

    @Autowired
    private VideoMapper videoMapper;
    
    public List<Video> getAllVideo() {
    	return videoMapper.getAllVideo();
    }
    public List<Video> getCategoryVideo(Video video) {
    	return videoMapper.getCategoryVideo(video);
    }
    public List<Video> getSearchVideo(String string){
    	return videoMapper.getSearchVideo(string);
    }
    
    @Transactional
	public Video addViews(Video video) {
		videoMapper.addViews(video);
		return videoMapper.getVideo(video);
	}
    
}
