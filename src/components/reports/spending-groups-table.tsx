import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GroupInsight } from "@/lib/expense-analysis/compute-group-insights"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

export const SpendingGroupsTable = ({ insights }: { insights: GroupInsight[] }) => {
    return (
        <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="font-outfit text-xl">Gastos por grupo de productos</CardTitle>
                <CardDescription>Visualiza dónde estás comprando qué, y cuánto te cuesta.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="border-b border-border/40 text-muted-foreground text-left">
                            <tr className="font-outfit">
                                <th className="py-3 px-2">Grupo</th>
                                <th className="py-3 px-2 text-right">Compras</th>
                                <th className="py-3 px-2 text-right">Cant. Total</th>
                                <th className="py-3 px-2 text-right">Gasto ($)</th>
                                <th className="py-3 px-2 text-center">Más Barato</th>
                                <th className="py-3 px-2 text-center">Más Caro</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/20">
                            {insights.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-6 text-center text-muted-foreground">
                                        No hay datos de productos suficientes para analizar este periodo.
                                    </td>
                                </tr>
                            ) : insights.map((insight, idx) => (
                                <tr key={idx} className="hover:bg-muted/10 transition-colors">
                                    <td className="py-3 px-2 font-medium capitalize">
                                        {insight.normalizedGroup.replace(/_/g, " ")}
                                    </td>
                                    <td className="py-3 px-2 text-right">{insight.purchaseCount}</td>
                                    <td className="py-3 px-2 text-right">{insight.totalQuantity > 0 ? insight.totalQuantity : '-'}</td>
                                    <td className="py-3 px-2 text-right font-bold">${Math.round(insight.totalSpent).toLocaleString()}</td>
                                    <td className="py-3 px-2 text-center">
                                        {insight.cheapestMerchant ? (
                                            <Badge variant="outline" className="text-emerald-500 border-emerald-500/30 bg-emerald-500/10 whitespace-nowrap">
                                                {insight.cheapestMerchant} {insight.minPriceOverall && `(Min $${Math.round(insight.minPriceOverall)})`}
                                            </Badge>
                                        ) : '-'}
                                    </td>
                                    <td className="py-3 px-2 text-center">
                                        {insight.mostExpensiveMerchant ? (
                                            <Badge variant="outline" className="text-destructive border-destructive/30 bg-destructive/10 whitespace-nowrap">
                                                {insight.mostExpensiveMerchant} {insight.maxPriceOverall && `(Max $${Math.round(insight.maxPriceOverall)})`}
                                            </Badge>
                                        ) : '-'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    )
}
