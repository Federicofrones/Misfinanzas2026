import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { GroupInsight } from "@/lib/expense-analysis/compute-group-insights"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export const MerchantPriceComparison = ({ insights }: { insights: GroupInsight[] }) => {
    // Only show groups with multiple merchants
    const multiMerchantInsights = insights.filter(i => i.merchants.length > 1);

    return (
        <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="font-outfit text-xl">Comparador de Precios por Comercio</CardTitle>
                <CardDescription>Analiza la dispersión de precios de los mismos productos en distintos lugares.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {multiMerchantInsights.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">No hay productos comprados en más de un comercio para comparar.</p>
                    ) : (
                        multiMerchantInsights.map((insight, idx) => (
                            <div key={idx} className="space-y-3 p-4 border border-border/20 rounded-lg bg-background/30">
                                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-2">
                                    <h4 className="font-bold text-primary capitalize">{insight.normalizedGroup.replace(/_/g, " ")}</h4>
                                    {insight.priceDispersionPercentage && (
                                        <Badge variant="secondary" className="bg-amber-500/10 text-amber-500 border-amber-500/20 w-fit">
                                            Dispersión del {Math.round(insight.priceDispersionPercentage)}%
                                        </Badge>
                                    )}
                                </div>
                                <div className="grid gap-2 text-sm">
                                    {insight.merchants.map((m, mIdx) => {
                                        // Calculate diff from cheapest
                                        const diff = insight.minPriceOverall && m.averagePrice > insight.minPriceOverall
                                            ? ((m.averagePrice - insight.minPriceOverall) / insight.minPriceOverall) * 100
                                            : 0;

                                        return (
                                            <div key={mIdx} className="flex justify-between items-center group/row">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-muted-foreground">{m.merchant}</span>
                                                    <span className="text-[10px] text-muted-foreground/50">({m.purchaseCount} compras)</span>
                                                </div>
                                                <div className="flex items-center gap-4 text-right">
                                                    <span className={`font-bold ${diff === 0 ? 'text-emerald-500' : 'text-foreground'}`}>
                                                        ${Math.round(m.averagePrice)}/u
                                                    </span>
                                                    {diff > 0 && (
                                                        <span className="text-[10px] text-destructive w-12 hidden sm:inline-block">
                                                            +{Math.round(diff)}%
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
