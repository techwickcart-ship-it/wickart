const fs = require('fs');
let schema = fs.readFileSync('supabase_schema.sql', 'utf8');

// Replace CREATE TABLE with CREATE TABLE IF NOT EXISTS
schema = schema.replace(/CREATE TABLE /g, 'CREATE TABLE IF NOT EXISTS ');

// Add DROP POLICY IF EXISTS before CREATE POLICY
schema = schema.replace(/CREATE POLICY "([^"]+)" ON ([a-zA-Z0-9_]+)/g, 'DROP POLICY IF EXISTS "$1" ON $2;\nCREATE POLICY "$1" ON $2');

// Fix the RLS policies to be secure (avoid permissive ALL)
schema = schema.replace(/CREATE POLICY "Enable all operations for all users" ON ([a-zA-Z0-9_]+) FOR ALL USING \(auth\.role\(\) IN \('anon', 'authenticated'\)\) WITH CHECK \(auth\.role\(\) IN \('anon', 'authenticated'\)\);/g, 
  'CREATE POLICY "Enable insert for authenticated users only" ON $1 FOR INSERT TO authenticated WITH CHECK (true);\n' +
  'CREATE POLICY "Enable update for authenticated users only" ON $1 FOR UPDATE TO authenticated USING (true) WITH CHECK (true);\n' +
  'CREATE POLICY "Enable delete for authenticated users only" ON $1 FOR DELETE TO authenticated USING (true);');

fs.writeFileSync('supabase_schema.sql', schema);
