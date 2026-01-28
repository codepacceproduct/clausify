import dotenv from "dotenv";
import path from "path";

// Garante que o caminho é absoluto para a raiz do projeto
const envPath = path.resolve(process.cwd(), '.env');
const envLocalPath = path.resolve(process.cwd(), '.env.local');

console.log(`[ENV Loader] Loading env from: ${envLocalPath}`);

// Função auxiliar para forçar override
function loadEnv(filePath: string) {
    const result = dotenv.config({ path: filePath });
    if (result.error) {
        console.log(`[ENV Loader] Error loading ${path.basename(filePath)}: ${result.error.message}`);
        return;
    }
    
    // Forçar override manual para garantir que valores do arquivo prevaleçam
    // (especialmente útil se o Next.js carregou errado antes)
    if (result.parsed) {
        console.log(`[ENV Loader] Loaded ${Object.keys(result.parsed).length} keys from ${path.basename(filePath)}`);
        for (const k in result.parsed) {
            // Log discreto para chaves críticas
            if (k === 'ASAAS_API_KEY') {
                 const val = result.parsed[k];
                 console.log(`[ENV Loader] Overriding ${k}: Length=${val.length}, Starts=${val.substring(0,3)}...`);
            }
            process.env[k] = result.parsed[k];
        }
    }
}

// 1. Tenta carregar .env.local (prioridade máxima)
loadEnv(envLocalPath);

// 2. Carrega .env como fallback (mas nossa função loadEnv sobrescreve, então devemos checar?)
// O padrão do dotenv é NÃO sobrescrever. Minha função loadEnv SOBRESCREVE.
// Então se eu carregar .env DEPOIS, ele vai sobrescrever o .env.local? SIM.
// Errado! .env.local deve ganhar.

// Correção: Carregar .env primeiro, depois .env.local
// OU: Alterar loadEnv para só sobrescrever se não existir ou se quisermos forçar .env.local

// Vamos simplificar: Carregamos .env.local com override.
// O .env normal deixamos o dotenv padrão lidar (sem override), ou carregamos antes.

// Melhor abordagem:
// 1. Carrega .env (padrão, sem override)
dotenv.config({ path: envPath });

// 2. Carrega .env.local (com override manual para garantir prioridade)
loadEnv(envLocalPath);

export const ENV = {
  ASAAS_API_KEY: process.env.ASAAS_API_KEY,
  ASAAS_BASE_URL: process.env.ASAAS_BASE_URL ?? "https://api.asaas.com/v3",
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
};

// Log de verificação final
if (!process.env.ASAAS_API_KEY) {
    console.error("[ENV Loader] CRITICAL: ASAAS_API_KEY not found in process.env after loading!");
} else {
    console.log(`[ENV Loader] FINAL CHECK: ASAAS_API_KEY found (Length: ${process.env.ASAAS_API_KEY.length})`);
}
