package com.example.praven.service;

import java.util.List;
import javax.xml.stream.events.Comment;
import org.springframework.stereotype.Service;

import com.example.ssafit.mapper.CommentMapper;
import com.example.ssafit.model.Video;

@Service
public class CommentService {
	
	private CommentMapper commentMapper;
	

	public List<Comment> getAllComments(Video video) {
		return commentMapper.getAllComments(video);
	}

}
