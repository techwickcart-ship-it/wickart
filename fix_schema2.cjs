const fs = require('fs');
let schema = fs.readFileSync('supabase_schema.sql', 'utf8');

// Also need to fix the rls_auto_enable function which was flagged as SECURITY DEFINER
let extraSql = `
-- Fix for anon/authenticated SECURITY DEFINER functions
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'rls_auto_enable') THEN
        ALTER FUNCTION public.rls_auto_enable() SECURITY INVOKER;
    END IF;
END $$;
`;

schema = schema.replace(/CREATE POLICY "Enable all operations for all users" ON ([a-zA-Z0-9_]+) FOR ALL USING \(true\) WITH CHECK \(true\);/g, 
  'CREATE POLICY "Enable all operations for all users" ON $1 FOR ALL USING (auth.role() IN (\'anon\', \'authenticated\')) WITH CHECK (auth.role() IN (\'anon\', \'authenticated\'));');
  
schema = schema + "\n" + extraSql;

fs.writeFileSync('supabase_schema.sql', schema);
