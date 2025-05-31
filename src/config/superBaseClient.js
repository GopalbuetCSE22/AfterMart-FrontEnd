import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_AFTERMART_PROJECT_URL
const supabaseKey = import.meta.env.VITE_AFTERMART_API
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase;