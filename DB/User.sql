USE hsj;

DROP TABLE IF EXISTS User;

CREATE TABLE User (
    id VARCHAR(255) PRIMARY KEY,
    nickname VARCHAR(255),
    email VARCHAR(255),
    token VARCHAR(255)
);

select * from User;