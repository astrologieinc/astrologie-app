// Test Supabase connection
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testConnection() {
  try {
    // Test 1: Check tables exist
    const { data: tables, error } = await supabase
      .from('users')
      .select('*')
      .limit(1);
    
    if (error) throw error;
    console.log('✅ Connected to Supabase!');
    console.log('✅ Tables are accessible!');
    
    // Test 2: Try to insert a test user
    const testUser = {
      email: 'test@astrologie.com',
      full_name: 'Test User',
      birth_date: '1990-01-01',
      birth_time: '12:00:00',
      birth_place: 'New York, NY'
    };
    
    const { data, error: insertError } = await supabase
      .from('users')
      .insert([testUser])
      .select();
    
    if (insertError) throw insertError;
    console.log('✅ Test user created:', data[0].id);
    
    // Clean up
    await supabase
      .from('users')
      .delete()
      .eq('email', 'test@astrologie.com');
    
    console.log('✅ Test cleanup complete!');
    console.log('\n🎉 Supabase is fully configured!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testConnection();# Open the success page
open -a TextEdit app/success/page.tsx
