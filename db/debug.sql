create or replace function set_avataruser(_useriD varchar(36), _image text) 
returns integer
language plpgsql
as
$$
declare
    target_user_id integer;
begin
    select COUNT(*) into target_user_id from avatars where user_id = $1;
    if target_user_id > 0 then 
        update avatars set image = $2 where user_id = $1;
        return 1;
    else
        insert into avatars(user_id, image) values($1, $2);
        return 0;
    end if; 
end;
$$