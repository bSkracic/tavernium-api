\connect tavernium_db

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

create table campaigns_image(
    id serial primary key,
    image text,
    is_active boolean
);

create type alignment_options as enum ('Lawful Good', 'Lawful Neutral', 'Lawful Evil', 'Neutral Good', 'True Neutral', 'Neutral Evil', 'Chaotic Good', 'Chaotic Neutral', 'Chaotic Evil');

create table if not exists sheets(
    id serial primary key,
    user_id varchar(36),
    class varchar(50),
    level int,
    background varchar(50),
    name varchar(50),
    race varchar(50),
    alignment alignment_options,
    experience_points int,
    strength int,
    dexterity int,
    constitution int,
    intelligence int,
    wisdom int,
    charisma int,
    bonus int,
    armor_class int,
    initiative int,
    speed int,
    hp int,
    constraint fk_campaign_user foreign key (user_id) references users(uuid)
);

create table if not exists campaigns_user(
    id serial primary key, 
    user_id varchar(36), 
    sheet_id int,
    campaign_id int, 
    constraint fk_campaign_user foreign key (user_id) references users(uuid),
    constraint fk_campaign_sheet foreign key (sheet_id) references sheets(id),
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

create or replace function set_avataruser(_userID varchar(36), _image text) 
returns integer
as
$$
    declare _userID text := $1;
    declare _image text := $2;
    declare target_user_id integer;
begin
    select count(*) into target_user_id from avatars where user_id = _userID;
    if target_user_id > 0 then 
        update avatars set image = _image where user_id = _userID;
        return 0;
    else
        insert into avatars(user_id, image) values(_userID, _image);
        return 0;
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
    where campaigns.title like concat(term, '%') and campaigns.user_starter_id != userId;
end;
$$
language plpgsql;

create or replace function save_refresh_token(_uuid varchar(36), _token text)
returns void
as 
$$
declare _uuid varchar(36) := $1;
declare _token text := $2;
declare cnt int;
begin
    cnt := (select count(*) from refresh_tokens where refresh_tokens.token = _token);
    if cnt = 0 then
        insert into refresh_tokens(uuid, token) values(_uuid, _token);
        return;
    else
        return;
    end if;
end;
$$
language plpgsql;