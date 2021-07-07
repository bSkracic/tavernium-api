\connect tavernium_db

create or replace function delete_sheet(_sheet_id int) 
returns void
as
$$
    declare _sheetID int := $1;
begin
   delete from campaigns_user where campaigns_user.sheet_id = _sheetID;
   delete from sheets where sheets.id = _sheetID;
end;
$$LANGUAGE plpgsql;