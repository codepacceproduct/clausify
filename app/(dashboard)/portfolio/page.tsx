import { LayoutWrapper } from "@/components/layout-wrapper"
import { PortfolioOverview } from "@/components/portfolio-overview"
import { PortfolioTable } from "@/components/portfolio-table"
import { PortfolioFilters } from "@/components/portfolio-filters"

export default function PortfolioPage() {
  return (
    <LayoutWrapper>
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Portfólio de Contratos</h1>
        <p className="text-muted-foreground mt-1">Visão consolidada de todos os contratos da empresa</p>
      </div>

      {/* Overview Stats */}
      <PortfolioOverview />

      {/* Filters */}
      <PortfolioFilters />

      {/* Contract Table */}
      <PortfolioTable />
    </LayoutWrapper>
  )
}
