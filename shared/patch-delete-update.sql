-- Выполнить в Supabase → SQL Editor (удаление и правка пациентов и их данных)
do $$
declare t text;
begin
  foreach t in array array['patients','diagnostics','messages','therapy_sessions','payments'] loop
    execute format('drop policy if exists "%s public delete" on %I', t, t);
    execute format('create policy "%s public delete" on %I for delete to anon using (true)', t, t);
    execute format('drop policy if exists "%s public update" on %I', t, t);
    execute format('create policy "%s public update" on %I for update to anon using (true)', t, t);
  end loop;
end $$;
