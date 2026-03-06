import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { GroupInsight } from "@/lib/expense-analysis/compute-group-insights"
import { TrendingDown, Zap, Search, Bell } from "lucide-react"

export const SavingsSummaryCards = ({
    insights,
    totalSavingsPotential,
    totalAlerts
}: {
    insights: GroupInsight[];
    totalSavingsPotential: number;
    totalAlerts: number;
}) => {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-border/40 bg-card/50 backdrop-blur-sm relative overflow-hidden group hover:border-primary/50 transition-colors">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all">
                    <Search className="w-12 h-12 text-primary" />
                </div>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Grupos Analizados</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold font-outfit">{insights.length}</div>
                    <p className="text-xs text-muted-foreground mt-1">productos clasificados</p>
                </CardContent>
            </Card>

            <Card className="border-border/40 bg-emerald-500/10 border-emerald-500/30 backdrop-blur-sm relative overflow-hidden group hover:bg-emerald-500/20 transition-colors">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all">
                    <Zap className="w-12 h-12 text-emerald-500" />
                </div>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-emerald-600/80">Ahorro Potencial Total</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold font-outfit text-emerald-500">${Math.round(totalSavingsPotential).toLocaleString()}</div>
                    <p className="text-xs text-emerald-600/60 mt-1">comprando en el lugar más barato</p>
                </CardContent>
            </Card>

            <Card className="border-border/40 bg-card/50 backdrop-blur-sm relative overflow-hidden group hover:border-amber-500/50 transition-colors">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all">
                    <TrendingDown className="w-12 h-12 text-amber-500" />
                </div>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Mayor Variación</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold font-outfit text-amber-500">
                        {insights.filter(i => i.priceDispersionPercentage).length > 0
                            ? Math.round(Math.max(...insights.filter(i => i.priceDispersionPercentage).map(i => i.priceDispersionPercentage!))) + '%'
                            : 'N/A'
                        }
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">diferencia máx de precios</p>
                </CardContent>
            </Card>

            <Card className="border-border/40 bg-card/50 backdrop-blur-sm relative overflow-hidden group hover:border-blue-500/50 transition-colors">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all">
                    <Bell className="w-12 h-12 text-blue-500" />
                </div>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Alertas de Gasto</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold font-outfit text-blue-500">{totalAlerts}</div>
                    <p className="text-xs text-muted-foreground mt-1">acciones recomendadas</p>
                </CardContent>
            </Card>
        </div>
    )
}
