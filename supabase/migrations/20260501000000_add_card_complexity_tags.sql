-- Add complexity and tags columns to cards table for AI features
do $$
begin
    if not exists (select 1 from information_schema.columns where table_name = 'cards' and column_name = 'complexity') then
        alter table cards add column complexity text check (complexity in ('simple', 'medium', 'complex'));
    end if;
end $$;

do $$
begin
    if not exists (select 1 from information_schema.columns where table_name = 'cards' and column_name = 'tags') then
        alter table cards add column tags text[];
    end if;
end $$;