\set a '00000000-0000-0000-0000-000000000001'
\set b '00000000-0000-0000-0000-000000000002'
\set outsider '00000000-0000-0000-0000-000000000003'
insert into auth.users values (:'a'),(:'b'),(:'outsider');
insert into public.profiles(id,display_name) values(:'a','A'),(:'b','B'),(:'outsider','C');
-- Test helpers are in a separate schema and never shipped to Supabase.
create schema test;
grant usage on schema test to authenticated,anon;
create function test.ok(value boolean,label text) returns void language plpgsql as $$begin if value is distinct from true then raise exception 'FAIL: %',label; end if; raise notice 'PASS: %',label; end$$;
create function test.denied(statement text,label text) returns void language plpgsql as $$begin
 begin execute statement; exception when insufficient_privilege then raise notice 'PASS: %',label; return; end;
 raise exception 'FAIL: % was permitted',label;
end$$;
grant execute on all functions in schema test to authenticated,anon;
set role anon;
select test.denied('select * from public.profiles','anonymous profile access denied');
select test.denied('select public.record_swipe(''00000000-0000-0000-0000-000000000002'',''like'')','anonymous match RPC denied');
reset role;
set role authenticated;
select set_config('request.jwt.claim.sub', :'a', false);
select test.denied('insert into public.matches(user_a,user_b) values(''00000000-0000-0000-0000-000000000001'',''00000000-0000-0000-0000-000000000002'')','unilateral match insert denied');
select test.denied('insert into public.conversation_members(conversation_id,user_id) values(gen_random_uuid(),''00000000-0000-0000-0000-000000000001'')','client membership creation denied');
select test.denied('insert into public.profiles(id,display_name) values(gen_random_uuid(),''spoof'')','profile identity spoof denied');
select test.ok(public.record_swipe(:'b','like') is null,'first like cannot match');
select test.ok((select count(*)=0 from public.matches),'no match exists after first like');
insert into public.user_preferences(user_id,riding_styles) values(:'a',array['Freeride']);
insert into public.motion_sessions(owner_id,origin) values(:'a','synthetic');
select test.denied('insert into public.motion_sessions(owner_id,origin) values(''00000000-0000-0000-0000-000000000001'',''real_verified'')','client verified origin denied');
select set_config('request.jwt.claim.sub', :'b', false);
select test.ok((select count(*)=0 from public.user_preferences),'other preferences private');
select test.ok((select count(*)=0 from public.motion_sessions),'other motion sessions private');
select test.ok((select count(*)=0 from public.swipe_actions),'incoming likes are private');
select test.ok(public.record_swipe(:'a','like') is not null,'reciprocal like creates match');
select test.ok((select count(*)=1 from public.matches),'one canonical match');
select test.ok((select count(*)=2 from public.conversation_members),'two authorized members');
select id as chat from public.conversations \gset
insert into public.messages(conversation_id,sender_id,body) values(:'chat',:'b','Hello');
select test.ok((select count(*)=1 from public.messages),'member can send and read');
select test.denied(format('insert into public.messages(conversation_id,sender_id,body) values(%L,%L,''spoof'')',:'chat',:'a'),'sender spoof denied');
select public.record_swipe(:'a','like');
select test.ok((select count(*)=1 from public.matches),'repeated like is idempotent');
select set_config('request.jwt.claim.sub', :'outsider', false);
select test.ok((select count(*)=0 from public.conversations),'outsider cannot read conversation');
select test.ok((select count(*)=0 from public.messages),'outsider cannot read messages');
select test.ok((select count(*)=0 from public.conversation_members),'outsider cannot enumerate members');
select test.denied(format('insert into public.messages(conversation_id,sender_id,body) values(%L,%L,''intrude'')',:'chat',:'outsider'),'outsider cannot send');
select set_config('request.jwt.claim.sub', :'a', false);
insert into public.blocks(blocker_id,blocked_id) values(:'a',:'b');
select test.ok((select count(*)=0 from public.messages),'blocking hides existing messages');
select test.ok((select count(*)=0 from public.matches),'blocking hides match');
select test.ok((select count(*)=0 from public.profiles where id=:'b'),'blocking hides rider');
select set_config('request.jwt.claim.sub', :'b', false);
select test.ok((select count(*)=0 from public.profiles where id=:'a'),'reverse blocking hides rider');
select test.denied(format('insert into public.messages(conversation_id,sender_id,body) values(%L,%L,''blocked'')',:'chat',:'b'),'blocked member cannot send');
insert into public.reports(reporter_id,target_id,reason) values(:'b',:'a','Test report');
select set_config('request.jwt.claim.sub', :'a', false);
select test.ok((select count(*)=0 from public.reports),'reports private to reporter');
reset role;
select test.ok((select count(*)=11 from pg_tables where schemaname='public' and rowsecurity),'all 11 essential tables have RLS');
select test.ok(not exists(select 1 from information_schema.columns where table_schema='public' and table_name='profiles' and column_name in ('role','is_admin','email','latitude','longitude')),'no sensitive profile or admin fields');
select 'All local PostgreSQL policy checks passed.' as result;
