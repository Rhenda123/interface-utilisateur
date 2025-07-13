
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const supabaseUrl = 'https://tmckzuvcbldhkewykikz.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRtY2t6dXZjYmxkaGtld3lraWt6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzNjA0NjksImV4cCI6MjA2NzkzNjQ2OX0.SYEF31zoZiPl3DO9ulTktFk20Zsg5gxYd7Yxel-BVvs'

export const supabase = createClient<Database>(supabaseUrl, supabaseKey)
