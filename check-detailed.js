const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkData() {
  console.log('\n📊 Checking Supabase data...\n');
  
  // Get latest user
  const { data: users } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1);
  
  if (users && users.length > 0) {
    console.log('👤 Latest User:');
    console.log(`   Name: ${users[0].full_name}`);
    console.log(`   Email: ${users[0].email}`);
    console.log(`   ID: ${users[0].id}\n`);
    
    // Get their purchases
    const { data: purchases } = await supabase
      .from('purchases')
      .select('*')
      .eq('user_id', users[0].id);
    
    if (purchases && purchases.length > 0) {
      console.log('💳 Purchases:', purchases.length);
      console.log(`   Latest: ${purchases[0].status} - $${purchases[0].amount}`);
      console.log(`   Session: ${purchases[0].stripe_session_id}\n`);
    }
  }
}

checkData();
