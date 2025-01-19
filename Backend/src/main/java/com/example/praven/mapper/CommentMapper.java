package com.example.praven.mapper;

import java.util.List;

import javax.xml.stream.events.Comment;

import org.apache.ibatis.annotations.Mapper;

import com.example.ssafit.model.Video;

@Mapper
public interface CommentMapper {

    @Select("SELECT * FROM comment WHERE boardId = #{boardId}")
    List<Comment> selectCommentsByBoardId(int boardId);

    @Insert("INSERT INTO comment (boardId, userId, contents) VALUES (#{boardId}, #{userId}, #{contents})")
    void insertComment(Comment comment);
}
