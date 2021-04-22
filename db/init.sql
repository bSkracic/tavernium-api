create database if not exists tavernium_testdb;

create table if not exists users(
    uuid varchar(36) primary key,
    email varchar(50) unique,
    username varchar(50),
    password varchar(50)
);

create table if not exists refresh_tokens(uuid varchar(36) primary key, token text);

create table if not exists avatars(id serial primary key, user_id varchar(36), image text, constraint fk_user_image foreign key (user_id) references users(uuid));

create table if not exists campaigns(id serial primary key, user_starter_id varchar(36), title varchar(50), thematics varchar(50));

create function set_avataruser(_uuid text,  _useriD text, _image text) 
returns type integer
as$$
declare
    _uuid text := $1
    _userID text := $2
    _image text := $3
    target_user_id integer;
begin
    select count(*) into target_user_id from images where user_id = _userID;
    if target_user_id > 0 then 
        update images set image = _image where user_id = _userID
    else
        insert into images(uuid, user_id, image) values(_uuid, _userID, _image)
    end if;
end;
$$cd 