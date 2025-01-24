DROP DATABASE hsj;
CREATE DATABASE hsj;

USE hsj;

-- 봉사 공고 테이블
CREATE TABLE Bong (
    progrmRegistNo VARCHAR(10) PRIMARY KEY, -- 프로그램등록번호 (PK)
    progrmSj VARCHAR(100) NOT NULL, -- 봉사제목
    progrmSttusSe TINYINT NOT NULL, -- 모집상태 (1: 모집대기, 2: 모집중, 3: 모집완료)
    progrmBgnde DATE NOT NULL, -- 봉사시작일자
    progrmEndde DATE NOT NULL, -- 봉사종료일자
    actBeginTm TINYINT NOT NULL, -- 봉사시작시간
    actEndTm TINYINT NOT NULL, -- 봉사종료시간
    noticeBgnde DATE NOT NULL, -- 모집시작일
    noticeEndde DATE NOT NULL, -- 모집종료일
    rcritNmpr INT NOT NULL, -- 모집인원
    actWkdy VARCHAR(7) NOT NULL, -- 활동요일 (1111100: 월~일)
    srvcClCode VARCHAR(50) NOT NULL, -- 봉사분야
    adultPosblAt CHAR(1) NOT NULL, -- 성인가능여부 ('Y' or 'N')
    yngbgsPosblAt CHAR(1) NOT NULL, -- 청소년가능여부 ('Y' or 'N')
    grpPosblAt CHAR(1) NOT NULL, -- 단체가능여부 ('Y' or 'N')
    mnnstNm VARCHAR(50) NOT NULL, -- 모집기관명
    nanmmbyNm VARCHAR(50) NOT NULL, -- 등록기관명
    actPlace VARCHAR(100) NOT NULL, -- 봉사장소
    nanmmbyNmAdmn VARCHAR(50) NOT NULL, -- 담당자명
    telno VARCHAR(20) NOT NULL, -- 전화번호
    fxnum VARCHAR(14), -- FAX번호 (NULL 허용)
    postAdres VARCHAR(100) NOT NULL, -- 담당자 주소
    email VARCHAR(100) NOT NULL, -- 이메일
    progrmCn TEXT NOT NULL, -- 내용
    sidoCd VARCHAR(7) NOT NULL, -- 시도코드
    gugunCd VARCHAR(7) NOT NULL -- 시군구코드
);

select * from Bong;