package com.example.praven;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.example.praven.mapper") // 매퍼 패키지 경로를 정확히 지정
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
