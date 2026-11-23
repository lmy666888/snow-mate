-- Day 1 essential identity, social safety, resort catalog, and private session shell.
-- Run through Supabase migrations; never apply to a production project without approval.
begin;
create type public.riding_stance as enum ('Regular', 'Goofy');
create type public.riding_level as enum ('Beginner', 'Intermediate', 'Advanced', 'Expert');
create type public.data_origin as enum ('synthetic', 'real_unverified', 'real_verified');
create table public.profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 display_name text not null check (char_length(display_name) between 1 and 60),
 bio text not null default '' check (char_length(bio) <= 500),
 level public.riding_level not null default 'Beginner', stance public.riding_stance not null default 'Regular',
 home_region text, discovery_enabled boolean not null default true,
 created_at timestamptz not null default now()
);
comment on table public.profiles is 'Discovery-safe fields only. No email, precise location, date of birth, role, or administrative flags.';
create table public.user_preferences (
 id uuid primary key default gen_random_uuid(), user_id uuid not null unique references public.profiles on delete cascade,
 riding_styles text[] not null default '{}', favorite_resorts text[] not null default '{}',
 trip_distance_km integer check (trip_distance_km between 0 and 20000),
 matching_preferences jsonb not null default '{}'::jsonb check (jsonb_typeof(matching_preferences) = 'object')
);
create table public.swipe_actions (
 id uuid primary key default gen_random_uuid(), actor_id uuid not null references public.profiles on delete cascade,
 target_id uuid not null references public.profiles on delete cascade, action text not null check (action in ('like','pass')),
 created_at timestamptz not null default now(), unique(actor_id,target_id), check(actor_id <> target_id)
);
create table public.matches (
 id uuid primary key default gen_random_uuid(), user_a uuid not null references public.profiles on delete cascade,
 user_b uuid not null references public.profiles on delete cascade, created_at timestamptz not null default now(),
 unique(user_a,user_b), check(user_a < user_b)
);
create table public.conversations (
 id uuid primary key default gen_random_uuid(), match_id uuid not null unique references public.matches on delete cascade,
 created_at timestamptz not null default now()
);
create table public.conversation_members (
 id uuid primary key default gen_random_uuid(), conversation_id uuid not null references public.conversations on delete cascade,
 user_id uuid not null references public.profiles on delete cascade, unique(conversation_id,user_id)
);
create table public.messages (
 id uuid primary key default gen_random_uuid(), conversation_id uuid not null references public.conversations on delete cascade,
 sender_id uuid not null references public.profiles on delete cascade,
 body text not null check (char_length(body) between 1 and 4000), created_at timestamptz not null default now()
);
create table public.blocks (
 id uuid primary key default gen_random_uuid(), blocker_id uuid not null references public.profiles on delete cascade,
 blocked_id uuid not null references public.profiles on delete cascade, created_at timestamptz not null default now(),
 unique(blocker_id,blocked_id), check(blocker_id <> blocked_id)
);
create table public.reports (
 id uuid primary key default gen_random_uuid(), reporter_id uuid not null references public.profiles on delete cascade,
 target_id uuid references public.profiles on delete set null,
 reason text not null check (char_length(reason) between 1 and 1000), created_at timestamptz not null default now()
);
create table public.resorts (
 id uuid primary key default gen_random_uuid(), name text not null, region text not null,
 country_code char(2) not null, official_url text, unique(name,region,country_code)
);
-- Minimal private container, not ingestion or coaching implementation.
create table public.motion_sessions (
 id uuid primary key default gen_random_uuid(), owner_id uuid not null references public.profiles on delete cascade,
 origin public.data_origin not null default 'synthetic', protocol_version text not null default '1.0.0',
 started_at timestamptz not null default now(), ended_at timestamptz, check(ended_at is null or ended_at >= started_at)
);
create index profiles_discovery on public.profiles(level,stance) where discovery_enabled;
create index swipes_target on public.swipe_actions(target_id,actor_id) where action='like';
create index matches_b on public.matches(user_b);
create index members_user on public.conversation_members(user_id,conversation_id);
create index messages_timeline on public.messages(conversation_id,created_at,id);
create index blocks_reverse on public.blocks(blocked_id,blocker_id);
create index reports_target on public.reports(target_id);
create index motion_owner on public.motion_sessions(owner_id,started_at desc);
create index resorts_region on public.resorts(country_code,region);

-- Definer helpers avoid recursive membership RLS. Explicit schema names, no writable search path.
create function public.is_blocked(other_user uuid) returns boolean
language sql stable security definer set search_path = '' as $$
 select exists(select 1 from public.blocks b where
 (b.blocker_id = auth.uid() and b.blocked_id = other_user) or
 (b.blocked_id = auth.uid() and b.blocker_id = other_user));
$$;
create function public.can_access_conversation(conversation uuid) returns boolean
language sql stable security definer set search_path = '' as $$
 select exists(select 1 from public.conversation_members m where m.conversation_id=conversation and m.user_id=auth.uid())
 and not exists(select 1 from public.conversation_members m where m.conversation_id=conversation and public.is_blocked(m.user_id));
$$;
revoke all on function public.is_blocked(uuid), public.can_access_conversation(uuid) from public, anon;
grant execute on function public.is_blocked(uuid), public.can_access_conversation(uuid) to authenticated;

alter table public.profiles enable row level security;
alter table public.user_preferences enable row level security;
alter table public.swipe_actions enable row level security;
alter table public.matches enable row level security;
alter table public.conversations enable row level security;
alter table public.conversation_members enable row level security;
alter table public.messages enable row level security;
alter table public.blocks enable row level security;
alter table public.reports enable row level security;
alter table public.resorts enable row level security;
alter table public.motion_sessions enable row level security;

create policy profile_read on public.profiles for select to authenticated using (id=auth.uid() or (discovery_enabled and not public.is_blocked(id)));
create policy profile_create on public.profiles for insert to authenticated with check(id=auth.uid());
create policy profile_update on public.profiles for update to authenticated using(id=auth.uid()) with check(id=auth.uid());
create policy preference_owner on public.user_preferences for all to authenticated using(user_id=auth.uid()) with check(user_id=auth.uid());
create policy swipe_read on public.swipe_actions for select to authenticated using(actor_id=auth.uid());
create policy match_read on public.matches for select to authenticated using ((user_a=auth.uid() or user_b=auth.uid()) and not public.is_blocked(case when user_a=auth.uid() then user_b else user_a end));
create policy conversation_read on public.conversations for select to authenticated using(public.can_access_conversation(id));
create policy member_read on public.conversation_members for select to authenticated using(public.can_access_conversation(conversation_id));
create policy message_read on public.messages for select to authenticated using(public.can_access_conversation(conversation_id));
create policy message_send on public.messages for insert to authenticated with check(sender_id=auth.uid() and public.can_access_conversation(conversation_id));
create policy block_read on public.blocks for select to authenticated using(blocker_id=auth.uid());
create policy block_create on public.blocks for insert to authenticated with check(blocker_id=auth.uid());
create policy block_delete on public.blocks for delete to authenticated using(blocker_id=auth.uid());
create policy report_create on public.reports for insert to authenticated with check(reporter_id=auth.uid());
create policy report_read on public.reports for select to authenticated using(reporter_id=auth.uid());
create policy resort_read on public.resorts for select to authenticated using(true);
create policy motion_read on public.motion_sessions for select to authenticated using(owner_id=auth.uid());
create policy motion_create_synthetic on public.motion_sessions for insert to authenticated with check(owner_id=auth.uid() and origin='synthetic');
create policy motion_delete on public.motion_sessions for delete to authenticated using(owner_id=auth.uid());
-- Clients cannot promote motion origin or overwrite session metadata. Validated ingestion is a later server boundary.

create function public.record_swipe(target uuid, decision text) returns uuid
language plpgsql security definer set search_path = '' as $$
declare actor uuid := auth.uid(); found_match uuid; chat uuid;
begin
 if actor is null then raise exception 'Authentication required'; end if;
 if actor=target or decision is null or decision not in ('like','pass') then raise exception 'Invalid swipe'; end if;
 -- Serialize reciprocal swipes, including concurrent transactions.
 perform pg_advisory_xact_lock(hashtextextended(least(actor,target)::text || greatest(actor,target)::text,0));
 if public.is_blocked(target) then raise exception 'Rider unavailable'; end if;
 if not exists(select 1 from public.profiles where id=target and discovery_enabled) then raise exception 'Rider unavailable'; end if;
 insert into public.swipe_actions(actor_id,target_id,action) values(actor,target,decision)
 on conflict(actor_id,target_id) do update set action=excluded.action,created_at=now();
 if decision='like' and exists(select 1 from public.swipe_actions where actor_id=target and target_id=actor and action='like') then
  insert into public.matches(user_a,user_b) values(least(actor,target),greatest(actor,target)) on conflict(user_a,user_b) do nothing;
  select id into found_match from public.matches where user_a=least(actor,target) and user_b=greatest(actor,target);
  insert into public.conversations(match_id) values(found_match) on conflict(match_id) do nothing;
  select id into chat from public.conversations where match_id=found_match;
  insert into public.conversation_members(conversation_id,user_id) values(chat,actor),(chat,target) on conflict(conversation_id,user_id) do nothing;
 end if;
 return found_match;
end;
$$;
revoke all on function public.record_swipe(uuid,text) from public, anon;
grant execute on function public.record_swipe(uuid,text) to authenticated;

-- Explicit grants: absent RLS policies are deny-by-default; no client writes to server-controlled tables.
revoke all on public.profiles,public.user_preferences,public.swipe_actions,public.matches,public.conversations,public.conversation_members,public.messages,public.blocks,public.reports,public.resorts,public.motion_sessions from anon, authenticated;
grant select,insert,update on public.profiles to authenticated;
grant select,insert,update,delete on public.user_preferences to authenticated;
grant select on public.swipe_actions,public.matches,public.conversations,public.conversation_members,public.resorts to authenticated;
grant select,insert on public.messages,public.reports to authenticated;
grant select,insert,delete on public.blocks,public.motion_sessions to authenticated;
commit;
