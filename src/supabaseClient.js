import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ykoassycleirqjmsqwkk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlrb2Fzc3ljbGVpcnFqbXNxd2trIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTUzOTgwODYsImV4cCI6MjAzMDk3NDA4Nn0.rnXfX8QAu3h7EDKJTcS8djTbG2We1UadraJqEsCkMGU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
