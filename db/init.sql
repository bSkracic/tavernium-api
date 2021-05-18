create database if not exists tavernium_testdb;

create table if not exists users(
    uuid varchar(36) primary key,
    email varchar(50) unique,
    username varchar(50),
    password varchar(50)
);

create table if not exists refresh_tokens(
    uuid varchar(36) primary key, 
    token text
);

create table if not exists avatars(
    id serial primary key, 
    user_id varchar(36), 
    image text, 
    constraint fk_user_image foreign key (user_id) references users(uuid)
);

create table if not exists campaigns(
    id serial primary key,
    user_starter_id varchar(36), 
    title varchar(50), 
    thematics varchar(50)
);

create table if not exists campaigns_user(
    id serial primary key, 
    user_id varchar(36), 
    campaign_id int, 
    constraint fk_campaign_user foreign key (user_id) references users(uuid),
    constraint fk_campaign_campaign foreign key (campaign_id) references campaigns(id)
);

create table if not exists messages(
    id serial primary key,
    sender varchar(50),
    campaign_id int,
    content text,
    created_at timestamptz not null default now(),
    constraint fk_message_campaign foreign key (campaign_id) references campaigns(id)
);

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
$$

select campaigns.id, campaigns.title, campaigns.thematics, users.username, count(campaigns_user.id) as joined
from campaigns  
inner join users on users.uuid = campaigns.user_starter_id 
inner join campaigns_user on campaigns_user.user_id = '11885ffa-0a3e-46b3-82cf-2f18065629fc' and campaigns_user.campaign_id = campaigns.id
where campaigns.title like 'dwa%'
group by campaigns_user.id