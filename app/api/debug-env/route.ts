import { NextResponse } from 'next/server';
import { ENV } from "@/lib/env";

export const runtime = "nodejs";

export async function GET() {
  const envVars = {
    ASAAS_BASE_URL: ENV.ASAAS_BASE_URL,
    ASAAS_API_KEY_EXISTS: !!ENV.ASAAS_API_KEY,
    ASAAS_API_KEY_LENGTH: ENV.ASAAS_API_KEY?.length || 0,
    ASAAS_API_KEY_PREFIX: ENV.ASAAS_API_KEY?.substring(0, 5) || 'N/A',
    NODE_ENV: process.env.NODE_ENV,
    NEXT_RUNTIME: process.env.NEXT_RUNTIME,
    DOTENV_FORCED: true
  };

  console.log('--- DEBUG ENV ---');
  console.log(JSON.stringify(envVars, null, 2));
  console.log('-----------------');

  return NextResponse.json({
    message: "Ambiente Debug (Dotenv Forced)",
    env: envVars,
    tip: "Se ASAAS_API_KEY_EXISTS for true, o sistema está pronto."
  });
}
