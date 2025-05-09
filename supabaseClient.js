// supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://neucezwnjijackkaatxk.supabase.co/'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ldWNlenduamlqYWNra2FhdHhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAwMTYzMzgsImV4cCI6MjA1NTU5MjMzOH0.1ZEkkgcOwSZrCT4lXyB1TW8enwZRFeYSgOLDV1YNdO0'
export const supabase = createClient(supabaseUrl, supabaseKey)
