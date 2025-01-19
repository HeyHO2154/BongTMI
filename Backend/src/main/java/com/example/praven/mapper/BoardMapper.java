package com.example.praven.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.example.ssafit.model.Video;

@Mapper
public interface BoardMapper {

    @Select("SELECT * FROM board")
    List<Board> selectAllBoards();

    @Insert("INSERT INTO board (category, title, user, contents) VALUES (#{category}, #{title}, #{user}, #{contents})")
    void insertBoard(Board board);

    @Select("SELECT * FROM board WHERE boardId = #{boardId}")
    Board selectBoardById(int boardId);
}
