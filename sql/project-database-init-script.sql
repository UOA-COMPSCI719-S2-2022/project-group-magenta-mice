/*
 * Upon submission, this file should contain the SQL script to initialize your database.
 * It should contain all DROP TABLE and CREATE TABLE statments, and any INSERT statements
 * required.
 */

drop table if exists articles;
drop table if exists users;


create table users (

   id integer not null primary key,
   username varchar(64) unique not null,
   password varchar(64) not null,
   name varchar(64),
   birthday date,
   email varchar(64),
   introduction varchar(512),
   authToken varchar(128),
   avatar varchar(32)
);

create table articles (

    id integer not null primary key,
    title varchar(128) not null,
    content text not null,
    timestamp timestamp not null,
    rate integer not null default 0,
    authorId integer not null,
    FOREIGN key (authorId) REFERENCES users(id)
    ON DELETE CASCADE

);
	





