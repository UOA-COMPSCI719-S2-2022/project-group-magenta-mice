/*
 * Upon submission, this file should contain the SQL script to initialize your database.
 * It should contain all DROP TABLE and CREATE TABLE statments, and any INSERT statements
 * required.
 */

-- Run this script to create or re-initialize the database.

drop table if exists messages;
drop table if exists users;

create table users (
                       id integer not null primary key,
                       username varchar(64) unique not null,
                       password varchar(64) not null,
                       name varchar(64),
                       birthday date,
                       email varchar(64),
                       introduction varchar(512),
                       authToken varchar(128)
                   );

create table messages (

                          id integer not null primary key,
                          senderId integer not null,
                          receiverId integer not null,
                          timestamp timestamp not null,
                          content varchar(256) not null,
                          foreign key (senderId) references users(id),
                          foreign key (receiverId) references users(id)
);

insert into users (id, username, password, name, birthday, email, introduction) values
                                                     (1, 'user1', 'pa55word', 'Alice', 1983-04-28, 'tianshu123@gmai.com','afiohsfnwao;asfawsf'),
                                                     (2, 'user2', 'pa55word', 'Bob', 1993-04-28, '123@gmai.com','fasgfaegrawrgeagdfds');

insert into messages (id, senderId, receiverId, timestamp, content) values
                                                                        (1, 1, 2, datetime('2021-05-15 15:00:00'), 'Hi, Bob!'),
                                                                        (2, 2, 1, datetime('2021-05-15 15:02:00'), 'Hi, Alice!'),
                                                                        (3, 1, 2, datetime('2021-05-15 15:04:00'), 'I like pie.'),
                                                                        (4, 2, 1, datetime('2021-05-15 15:10:00'), 'COMPSCI 719 is awesome! And I like pie also too.');