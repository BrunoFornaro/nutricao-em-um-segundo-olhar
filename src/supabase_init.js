// Importa o SDK do Supabase
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Importa as keys
import { SUPABASE_URL,  SUPABASE_KEY} from '../env.js'

// Configuração do Supabase
export const supabase = createClient(SUPABASE_URL,  SUPABASE_KEY);

export var user_id = localStorage.getItem("user")
