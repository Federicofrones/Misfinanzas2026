import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { GroupInsight } from "@/lib/expense-analysis/compute-group-insights"
import { TrendingDown, Coins } from "lucide-react"

export const SavingsOpportunities = ({ insights }: { insights: GroupInsight[] }) => {
    // Only show insights where savings potential is > 0
    const savingsInsights = insights.filter(i => i.savingsPotential && i.savingsPotential > 0);

    return (
        <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center gap-4">
                <div className="p-2 bg-emerald-500/10 rounded-full">
                    <Coins className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                    <CardTitle className="font-outfit text-xl">Ahorro Potencial</CardTitle>
                    <CardDescription>Dinero que podrías ahorrar optimizando tus lugares de compra.</CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {savingsInsights.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">No se detectaron oportunidades notables de ahorro.</p>
                    ) : (
                        savingsInsights.map((insight, idx) => (
                            <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border border-border/20 rounded-lg hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all">
                                <div className="space-y-1 mb-2 sm:mb-0">
                                    <h4 className="font-bold capitalize">{insight.normalizedGroup.replace(/_/g, " ")}</h4>
                                    <p className="text-xs text-muted-foreground w-full max-w-sm">
                                        Gastaste ${Math.round(insight.totalSpent)} en total. Si hubieras comprado todo al precio más bajo en <strong>{insight.cheapestMerchant}</strong> originaría un gasto ideal de solo ${Math.round(insight.idealSpent!)}.
                                    </p>
                                </div>
                                <div className="text-left sm:text-right">
                                    <div className="text-lg font-bold font-outfit text-emerald-500 flex items-center sm:justify-end gap-1">
                                        +${Math.round(insight.savingsPotential!)}
                                        <TrendingDown className="w-4 h-4 ml-1" />
                                    </div>
                                    <div className="text-xs text-emerald-600/70 font-medium">
                                        {Math.round(insight.savingsPercentage!)}% de ahorro posible
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
