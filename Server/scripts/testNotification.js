import { supabase } from '../config/supabaseClient.js'

const { data, error } = await supabase
  .from('notifications')
  .insert({
    user_id: 'ca3c15e1-2fd0-4fd4-bb14-e600e221d504',
    title: 'Test',
    message: 'Test message',
    type: 'test',
    is_read: false
  })
  .select()

console.log('data:', data)
console.log('error:', error)