\connect tavernium_db

create or replace function delete_campaign(_campaign_id int) 
returns void
as
$$
    declare _campaignID int := $1;
begin
   delete from messages where messages.campaign_id = _campaignID;
   delete from campaigns_user where campaigns_user.campaign_id = _campaignID;
   delete from campaigns where campaigns.id = _campaignID;
end;
$$LANGUAGE plpgsql;