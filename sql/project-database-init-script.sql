/*
 * Upon submission, this file should contain the SQL script to initialize your database.
 * It should contain all DROP TABLE and CREATE TABLE statments, and any INSERT statements
 * required.
 */
drop table if exists tagmap;
drop table if exists tags;
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
	tags varchar (256),
    authorId integer not null,
    FOREIGN key (authorId) REFERENCES users(id)
    ON DELETE CASCADE
);

create table tags (

	id integer not null primary key,
	name varchar(32) not null
);

create table tagmap (

	id integer not null primary key,
	articleId integer not null,
	tagId integer not null,
	FOREIGN key (articleId) REFERENCES articles(id) 
	ON DELETE CASCADE,
	FOREIGN key (tagId) REFERENCES tags(id)
	ON DELETE CASCADE
);
