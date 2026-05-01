-- Add complexity and tags columns to cards table for AI features
alter table cards add column if not exists complexity text check (complexity in ('simple', 'medium', 'complex'));
alter table cards add column if not exists tags text[];