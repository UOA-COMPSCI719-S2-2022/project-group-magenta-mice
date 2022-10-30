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
	authorId integer not null,
	timestamp timestamp not null,
	FOREIGN key (authorId) REFERENCES users(id)
);

insert into test (stuff) values
    ('Things'),
    ('More things');

insert into users (id, username, password, name, birthday, email, introduction) values
                                                     (1, 'user1', 'pa55word', 'Alice', 1983-04-28, 'tianshu123@gmai.com','afiohsfnwao;asfawsf'),
                                                     (2, 'user2', 'pa55word', 'Bob', 1993-04-28, '123@gmai.com','fasgfaegrawrgeagdfds');


insert into articles (title, content, authorId, timestamp) VALUES
('Article 1', 'Content 1', '1', '2013');
