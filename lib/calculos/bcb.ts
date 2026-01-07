
export interface BCBSeriesData {
  data: string
  valor: string
}

export const INDICES = {
  INPC: 188,
  IGPM: 189,
  IPCA: 433,
  SELIC: 11, // Taxa diária
  TR: 226,
}

export async function fetchBCBSeries(
  code: number,
  startDate: string,
  endDate: string
): Promise<BCBSeriesData[]> {
  // Format dates from YYYY-MM-DD to DD/MM/YYYY
  const [startYear, startMonth, startDay] = startDate.split("-")
  const [endYear, endMonth, endDay] = endDate.split("-")
  
  const formattedStart = `${startDay}/${startMonth}/${startYear}`
  const formattedEnd = `${endDay}/${endMonth}/${endYear}`

  const url = `https://api.bcb.gov.br/dados/serie/bcdata.sgs.${code}/dados?formato=json&dataInicial=${formattedStart}&dataFinal=${formattedEnd}`

  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch BCB data: ${response.statusText}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching BCB series:", error)
    return []
  }
}

export function calculateCorrection(
  value: number,
  seriesData: BCBSeriesData[],
  isDaily: boolean = false
): { correctedValue: number; correctionFactor: number } {
  let correctionFactor = 1.0

  for (const item of seriesData) {
    const rate = parseFloat(item.valor)
    if (!isNaN(rate)) {
      // Rates are usually in %, so divide by 100
      // For daily rates (SELIC), it's compound interest
      // For monthly indices, it's also compound
      correctionFactor *= (1 + rate / 100)
    }
  }

  const correctedValue = value * correctionFactor
  return { correctedValue, correctionFactor }
}
