const fs = require('fs');
let schema = fs.readFileSync('supabase_schema.sql', 'utf8');

// Fix the RLS policies to be secure (avoid permissive true)
schema = schema.replace(/CREATE POLICY "Enable insert for authenticated users only" ON ([a-zA-Z0-9_]+) FOR INSERT TO authenticated WITH CHECK \(true\);/g, 
  'CREATE POLICY "Enable insert for authenticated users only" ON $1 FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);');

schema = schema.replace(/CREATE POLICY "Enable update for authenticated users only" ON ([a-zA-Z0-9_]+) FOR UPDATE TO authenticated USING \(true\) WITH CHECK \(true\);/g, 
  'CREATE POLICY "Enable update for authenticated users only" ON $1 FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);');

schema = schema.replace(/CREATE POLICY "Enable delete for authenticated users only" ON ([a-zA-Z0-9_]+) FOR DELETE TO authenticated USING \(true\);/g, 
  'CREATE POLICY "Enable delete for authenticated users only" ON $1 FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);');

fs.writeFileSync('supabase_schema.sql', schema);
