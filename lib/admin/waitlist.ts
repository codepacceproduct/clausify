import { createClient } from "@/lib/supabase/server"

export interface WaitlistLead {
  id: string
  name: string
  email: string
  company: string | null
  position: number
  status: "pending" | "contacted" | "converted"
  createdAt: string
  source: string
}

export interface WaitlistStats {
  total: number
  pending: number
  contacted: number
  converted: number
  todaySignups: number
  conversionRate: number // Percentage (0-100)
  
  // Advanced metrics
  totalLeadsTrend: number // % change vs last month
  conversionRateTrend: number // % change vs last month
  monthlyGoalProgress: number // % of goal
  monthlyGoalTarget: number
  leadsThisMonth: number
  leadsLastMonth: number
  inProcessRate: number // % of total leads in 'contacted' status
  weeklyLeads: number // Leads in last 7 days
  dailyAverage: number // Average leads per day (based on last 7 days or month)
}

const MONTHLY_GOAL = 100 // Configurable goal

export async function getWaitlistLeads(): Promise<WaitlistLead[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("waitlist")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching waitlist leads:", error)
    return []
  }

  return data.map((lead, index) => ({
    id: lead.id,
    name: lead.name,
    email: lead.email,
    company: lead.company,
    position: data.length - index,
    status: (lead.status as "pending" | "contacted" | "converted") || "pending",
    createdAt: lead.created_at,
    source: "Site",
  }))
}

export async function getWaitlistStats(): Promise<WaitlistStats> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("waitlist")
    .select("status, created_at")

  if (error || !data) {
    console.error("Error fetching waitlist stats:", error)
    return {
      total: 0,
      pending: 0,
      contacted: 0,
      converted: 0,
      todaySignups: 0,
      conversionRate: 0,
      totalLeadsTrend: 0,
      conversionRateTrend: 0,
      monthlyGoalProgress: 0,
      monthlyGoalTarget: MONTHLY_GOAL,
      leadsThisMonth: 0,
      leadsLastMonth: 0,
      inProcessRate: 0,
      weeklyLeads: 0,
      dailyAverage: 0,
    }
  }

  const total = data.length
  const pending = data.filter((l) => l.status === "pending").length
  const contacted = data.filter((l) => l.status === "contacted").length
  const converted = data.filter((l) => l.status === "converted").length

  // Date calculations
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() // 0-11
  
  const lastMonthDate = new Date(currentYear, currentMonth - 1, 1)
  const lastMonthYear = lastMonthDate.getFullYear()
  const lastMonth = lastMonthDate.getMonth()

  const todayStr = now.toISOString().split("T")[0]
  
  // Filter data by periods
  const thisMonthLeads = data.filter(l => {
    const d = new Date(l.created_at)
    return d.getFullYear() === currentYear && d.getMonth() === currentMonth
  })

  const lastMonthLeads = data.filter(l => {
    const d = new Date(l.created_at)
    return d.getFullYear() === lastMonthYear && d.getMonth() === lastMonth
  })

  const leadsThisMonth = thisMonthLeads.length
  const leadsLastMonth = lastMonthLeads.length
  const todaySignups = data.filter((l) => l.created_at.startsWith(todayStr)).length

  // Last 7 days
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(now.getDate() - 7)
  const weeklyLeads = data.filter(l => new Date(l.created_at) >= sevenDaysAgo).length

  // Trends
  let totalLeadsTrend = 0
  if (leadsLastMonth > 0) {
    totalLeadsTrend = ((leadsThisMonth - leadsLastMonth) / leadsLastMonth) * 100
  } else if (leadsThisMonth > 0) {
    totalLeadsTrend = 100 // 100% growth if from 0 to something
  }

  // Conversion Rates
  const conversionRate = total > 0 ? (converted / total) * 100 : 0
  
  // Conversion Rate Trend (This Month vs Last Month)
  // Calculate CR for leads created last month (assumes they converted eventually)
  // This is tricky. Let's stick to "Current Global CR" vs "Last Month Global CR" is hard to know without history.
  // Alternative: CR of leads *created* this month vs *created* last month.
  const convertedThisMonth = thisMonthLeads.filter(l => l.status === "converted").length
  const convertedLastMonth = lastMonthLeads.filter(l => l.status === "converted").length
  
  const crThisMonth = leadsThisMonth > 0 ? (convertedThisMonth / leadsThisMonth) * 100 : 0
  const crLastMonth = leadsLastMonth > 0 ? (convertedLastMonth / leadsLastMonth) * 100 : 0
  
  const conversionRateTrend = crThisMonth - crLastMonth // Absolute percentage point difference

  // Monthly Goal
  const monthlyGoalProgress = Math.min((leadsThisMonth / MONTHLY_GOAL) * 100, 100)

  // In Process Rate
  const inProcessRate = total > 0 ? (contacted / total) * 100 : 0

  return {
    total,
    pending,
    contacted,
    converted,
    todaySignups,
    conversionRate: parseFloat(conversionRate.toFixed(1)),
    totalLeadsTrend: parseFloat(totalLeadsTrend.toFixed(1)),
    conversionRateTrend: parseFloat(conversionRateTrend.toFixed(1)),
    monthlyGoalProgress: Math.round(monthlyGoalProgress),
    monthlyGoalTarget: MONTHLY_GOAL,
    leadsThisMonth,
    leadsLastMonth,
    inProcessRate: Math.round(inProcessRate),
    weeklyLeads,
    dailyAverage: parseFloat((weeklyLeads / 7).toFixed(1))
  }
}
