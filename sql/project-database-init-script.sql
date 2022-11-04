/*
 * Upon submission, this file should contain the SQL script to initialize your database.
 * It should contain all DROP TABLE and CREATE TABLE statments, and any INSERT statements
 * required.
 */

drop table if exists tagmap;
drop table if exists tags;
drop table if exists comments;
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

create table comments (
	id integer not null primary key,
    userId integer not null,
	comments varchar(512) not null,
    timestamp timestamp not null,
	articleId integer not null,
	FOREIGN KEY (articleId) REFERENCES articles(id) ON DELETE CASCADE
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    
	
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

-- insert into users values(1,'ni','123','nini','1999/03/09','q@q','haha','autho','y.jeg');
-- insert into articles values(1,'article','write article','2000/10/10 10:10:10',3,'good',1);
-- insert into comments values(1,1,'god','2000/10/10 10:10:10',1);
-- insert into comments values(2,1,'oh','2000/10/11 10:10:10',1);
-- insert into comments values(3,1,'my','2000/10/12 10:10:10',1);
-- insert into users values(2,'s','123','nini','1999/03/09','s@s','haha','autho','y.jeg');
-- insert into comments values(4,2,'want','2000/10/20 10:10:10',1);
-- insert into comments values(5,2,'to','2000/10/21 10:10:10',1);
-- insert into comments values(6,2,'throw up','2000/10/22 10:10:10',1);

select c.comments as 'comments', c.timestamp as 'timestamp', c.articleId as 'articleId', u.name as 'name'
    from comments as c, users as u, articles as a
    where a.id = c.articleId and c.userId = u.id
    order by c.timestamp desc, a.timestamp desc;
	
select c.comments as 'comments', c.timestamp as 'timestamp', c.articleId as 'articleId', u.name as 'name'
    from comments as c, users as u, articles as a
    where  a.id = c.articleId and c.userId = u.id 
    order by c.timestamp desc, a.timestamp desc;
	
select c.comments as 'comments', c.timestamp as 'ctimestamp', c.articleId as 'articleId', u.name as 'name', 
    a.content as 'content', a.title as 'title', a.timestamp as 'timestamp'
    from comments as c, users as u, articles as a
    where a.id = c.articleId and a.authorId = u.id
    order by a.timestamp desc, c.timestamp desc

-- The above all work.-----------------------------------------------------------------------------------
