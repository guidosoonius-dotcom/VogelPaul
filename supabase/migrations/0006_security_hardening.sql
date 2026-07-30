-- VogelPaul: security hardening naar aanleiding van Supabase security advisors
--
-- 1. Zet een expliciete search_path op alle functies zonder deze instelling
--    (voorkomt search_path-hijacking-aanvallen).
-- 2. Beperkt wie handle_new_user() rechtstreeks via de REST/RPC-API mag
--    aanroepen — deze functie hoort alleen via de auth.users-trigger te
--    lopen, niet publiek aanroepbaar te zijn.

alter function set_updated_at() set search_path = public;
alter function check_bird_references_same_owner() set search_path = public;
alter function check_pair_birds_same_owner() set search_path = public;
alter function check_brood_pair_same_owner() set search_path = public;
alter function check_competition_bird_same_owner() set search_path = public;
alter function get_ancestors(uuid, integer) set search_path = public;
alter function get_descendants(uuid, integer) set search_path = public;

revoke execute on function handle_new_user() from public;
revoke execute on function handle_new_user() from anon;
revoke execute on function handle_new_user() from authenticated;
