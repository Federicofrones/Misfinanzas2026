"use client"

import * as React from "react"
import {
    TrendingDown,
    Plus,
    PieChart,
    AlertCircle,
    PiggyBank
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

const mockBudgets = [
    {
        id: "1",
        category: "Alimentación",
        spent: 4500,
        limit: 6000,
        color: "bg-emerald-500"
    },
    {
        id: "2",
        category: "Restaurantes",
        spent: 2800,
        limit: 3000,
        color: "bg-yellow-500"
    },
    {
        id: "3",
        category: "Transporte",
        spent: 1200,
        limit: 1500,
        color: "bg-blue-500"
    },
    {
        id: "4",
        category: "Ocio / Salidas",
        spent: 4200,
        limit: 4000,
        color: "bg-red-500"
    }
];

export default function BudgetsPage() {
    return (
        <div className="space-y-6 pb-12">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-outfit">Presupuestos</h1>
                    <p className="text-muted-foreground">Controlad vuestros gastos por categoría.</p>
                </div>
                <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Nuevo Presupuesto
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-emerald-500/10 border-emerald-500/20">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2 text-emerald-600">
                            <PiggyBank className="w-4 h-4" />
                            Ahorro Total Mes
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold font-outfit text-emerald-700">$ 12.450</div>
                        <p className="text-xs text-emerald-600/80">+5% respecto al mes pasado</p>
                    </CardContent>
                </Card>

                <Card className="bg-red-500/5 border-red-500/10">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2 text-red-600 uppercase tracking-wider">
                            <AlertCircle className="w-4 h-4" />
                            Límite Excedido
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold font-outfit text-red-700">1 Categoría</div>
                        <p className="text-xs text-red-600/80">Ocio / Salidas se ha pasado por $200</p>
                    </CardContent>
                </Card>

                <Card className="bg-blue-500/5 border-blue-500/10">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2 text-blue-600">
                            <TrendingDown className="w-4 h-4" />
                            Gasto Diario Promedio
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold font-outfit text-blue-700">$ 890</div>
                        <p className="text-xs text-blue-600/80">Basado en los últimos 30 días</p>
                    </CardContent>
                </Card>
            </div>

            <h2 className="text-xl font-semibold font-outfit mt-8">Límites por Categoría</h2>
            <div className="grid gap-6 md:grid-cols-2">
                {mockBudgets.map((budget) => {
                    const percent = Math.min((budget.spent / budget.limit) * 100, 100);
                    const isOver = budget.spent > budget.limit;

                    return (
                        <Card key={budget.id} className="border-border/40 overflow-hidden group hover:shadow-md transition-all">
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-lg font-outfit">{budget.category}</CardTitle>
                                        <CardDescription>Presupuesto mensual</CardDescription>
                                    </div>
                                    <Badge variant={isOver ? "destructive" : "outline"} className={!isOver ? "bg-primary/5 text-primary border-primary/20" : ""}>
                                        {Math.round((budget.spent / budget.limit) * 100)}%
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Gastado: <strong>${budget.spent.toLocaleString()}</strong></span>
                                        <span className="text-muted-foreground">Límite: <strong>${budget.limit.toLocaleString()}</strong></span>
                                    </div>
                                    <Progress value={percent} className={`h-2 ${isOver ? 'bg-red-500/20' : 'bg-secondary'}`} />
                                </div>
                                {isOver && (
                                    <div className="flex items-center gap-2 text-[10px] text-red-500 font-bold uppercase">
                                        <AlertCircle className="w-3 h-3" />
                                        Cuidado: Has superado el presupuesto
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    )
}
