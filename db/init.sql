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

create or replace function set_avataruser1(_uuid varchar(36),  _useriD varchar(36), _image text) 
returns integer
as
$$
    declare _uuid text := $1;
    declare _userID text := $2;
    declare _image text := $3;
    declare target_user_id integer;
begin
    select count(*) into target_user_id from images where user_id = _userID;
    if target_user_id > 0 then 
        update images set image = _image where user_id = _userID;
    else
        insert into images(uuid, user_id, image) values(_uuid, _userID, _image);
    end if;
end;
$$LANGUAGE plpgsql;

create or replace function get_campaignbyname(_term text, _user_id varchar(36))
returns table (id int, title varchar(50), thematics varchar(50), username varchar(50), joined boolean)
as
$$
declare term text := $1;
declare userId varchar(36) := $2;
begin
    return query
    select campaigns.id, campaigns.title, campaigns.thematics, users.username, 
        case when campaigns_user.id is not null then true else false end joined
    from campaigns  
    inner join users on users.uuid = campaigns.user_starter_id  
    full join campaigns_user on campaigns_user.user_id = userId and campaigns_user.campaign_id = campaigns.id
    where campaigns.title like concat(term, '%');
end;
$$
language plpgsql;