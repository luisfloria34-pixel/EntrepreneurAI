-- Run via Supabase migrations before deploying the ai-coach Edge Function.
create table if not exists public.ai_daily_usage (
  user_id uuid not null references auth.users(id) on delete cascade,
  usage_date date not null,
  message_count integer not null default 0 check (message_count >= 0),
  primary key (user_id, usage_date)
);
alter table public.ai_daily_usage enable row level security;
-- No client policies: only the service role can consume quota.
create or replace function public.consume_ai_message(p_user_id uuid, p_is_pro boolean)
returns boolean language plpgsql security definer set search_path = public
as $$
declare n integer;
begin
  insert into public.ai_daily_usage(user_id, usage_date, message_count)
  values (p_user_id, (now() at time zone 'UTC')::date, 0)
  on conflict do nothing;
  select message_count into n from public.ai_daily_usage
  where user_id = p_user_id and usage_date = (now() at time zone 'UTC')::date
  for update;
  if not p_is_pro and n >= 5 then return false; end if;
  update public.ai_daily_usage set message_count = message_count + 1
  where user_id = p_user_id and usage_date = (now() at time zone 'UTC')::date;
  return true;
end; $$;
revoke all on function public.consume_ai_message(uuid, boolean) from public, anon, authenticated;
grant execute on function public.consume_ai_message(uuid, boolean) to service_role;
