import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

// const supabaseUrl = process.env.SUPABASE_URL as string;
// const supabaseKey = process.env.SUPABASE_KEY as string;

// export const supabase = createClient(supabaseUrl, supabaseKey);

export const supabase = createClient(process.env.SUPABASE_URL!,process.env.SUPABASE_KEY!);