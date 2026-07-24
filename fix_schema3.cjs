const fs = require('fs');
let schema = fs.readFileSync('supabase_schema.sql', 'utf8');

// Replace all those policies with proper ones
const tables = [
  'platform_settings', 'homepage_categories', 'homepage_custom_sections', 'homepage_sliders',
  'coupons', 'campaigns', 'stores', 'sellers', 'customers', 'customer_addresses',
  'referral_settings', 'brands', 'variant_types', 'variant_values', 'categories',
  'subcategories', 'reasons_for_return', 'return_requests', 'delivery_partners',
  'dispatch_tasks', 'pos_orders', 'vendor_registrations'
];

let rlsBlock = `
-- ==========================================
-- Enable Row Level Security (RLS)
-- ==========================================
`;

tables.forEach(t => {
  rlsBlock += `ALTER TABLE ${t} ENABLE ROW LEVEL SECURITY;\n`;
});

rlsBlock += `
-- ==========================================
-- Basic RLS Policies (Development Mode)
-- ==========================================
-- Note: These policies currently allow public access for demonstration and development. 
-- In a production environment, you should restrict these using auth.uid() or specific roles.
`;

tables.forEach(t => {
  rlsBlock += `
CREATE POLICY "Enable read access for all users" ON ${t} FOR SELECT USING (true);
CREATE POLICY "Enable all operations for all users" ON ${t} FOR ALL USING (auth.role() IN ('anon', 'authenticated')) WITH CHECK (auth.role() IN ('anon', 'authenticated'));
`;
});

rlsBlock += `
-- Fix for anon/authenticated SECURITY DEFINER functions
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'rls_auto_enable') THEN
        ALTER FUNCTION public.rls_auto_enable() SECURITY INVOKER;
    END IF;
END $$;
`;

let parts = schema.split('-- ==========================================\n-- Enable Row Level Security (RLS)');
if (parts.length > 1) {
  schema = parts[0] + rlsBlock;
}

fs.writeFileSync('supabase_schema.sql', schema);
