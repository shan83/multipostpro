import { supabase } from '../lib/supabase';

export const testAuthSetup = async () => {
  console.log('🔍 Testing authentication setup...');
  
  // Test 1: Check if Supabase client is configured
  if (!supabase) {
    console.error('❌ Supabase client is not initialized');
    return false;
  }
  
  // Test 2: Check if we can connect to Supabase
  try {
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    if (error) {
      console.error('❌ Cannot connect to Supabase:', error.message);
      return false;
    }
    console.log('✅ Successfully connected to Supabase');
  } catch (err) {
    console.error('❌ Connection test failed:', err);
    return false;
  }
  
  // Test 3: Check if auth is enabled
  try {
    const { data: { session } } = await supabase.auth.getSession();
    console.log('✅ Auth service is accessible');
  } catch (err) {
    console.error('❌ Auth service test failed:', err);
    return false;
  }
  
  console.log('✅ All authentication tests passed');
  return true;
};

export const testSignUp = async (email: string, password: string, name: string) => {
  console.log('🧪 Testing sign up functionality...');
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }
      }
    });
    
    if (error) {
      console.error('❌ Sign up failed:', error.message);
      return { success: false, error: error.message };
    }
    
    console.log('✅ Sign up test completed');
    return { success: true, data };
  } catch (err) {
    console.error('❌ Sign up test error:', err);
    return { success: false, error: 'Unexpected error' };
  }
}; 