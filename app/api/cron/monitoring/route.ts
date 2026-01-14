import { NextResponse } from "next/server"
import { runMonitoringJob } from "@/actions/monitoring"

export const dynamic = 'force-dynamic' // static by default, unless reading the request

export async function GET(request: Request) {
  try {
    // Security check: verify a secret token if needed
    // const authHeader = request.headers.get('authorization');
    // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    //   return new Response('Unauthorized', { status: 401 });
    // }

    const result = await runMonitoringJob()
    
    return NextResponse.json(result)
  } catch (error) {
    console.error("Cron job failed:", error)
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
  }
}
