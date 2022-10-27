/*
 * Upon submission, this file should contain the SQL script to initialize your database.
 * It should contain all DROP TABLE and CREATE TABLE statments, and any INSERT statements
 * required.
 */
drop table if exists articles;
drop table if exists test;
drop table if exists users;

create table test (
    id integer not null primary key,
    stuff text  
);

create table users (
    id integer not null primary key,
    username varchar(64) unique not null,
    password varchar(64) not null,
    name varchar(64),
    birthday date,
    email varchar(64),
    avatar varchar(32),
    introduction varchar(512)
);

create table articles (
	id integer not null primary key,
	title varchar(128) not null,
	content text not null,
	author varchar(64) not null,
	timestamp timestamp not null,
	FOREIGN key (author) REFERENCES users (name)
);

insert into test (stuff) values
    ('Things'),
    ('More things');
	
insert into articles (title, content, author, datePosted) VALUES
('Article 1', 'Content 1', 'Author 1', '2013');