"use client"

import * as React from "react"
import { CreditCard, Plus, Calendar, Server, ShieldCheck, PlayCircle, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

const initialFixedExpenses = [
    { id: "1", name: "Netflix", amount: 450, icon: PlayCircle, color: "text-red-500", bgColor: "bg-red-500/10" },
    { id: "2", name: "Spotify", amount: 190, icon: PlayCircle, color: "text-green-500", bgColor: "bg-green-500/10" },
    { id: "3", name: "Vercel / Hosting", amount: 800, icon: Server, color: "text-zinc-500", bgColor: "bg-zinc-500/10" },
];

export default function CreditCardsPage() {
    const totalDebt = 34500;
    const limit = 100000;
    const percent = Math.min((totalDebt / limit) * 100, 100);

    return (
        <div className="space-y-6 pb-12">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold font-outfit">Tarjetas y Pagos Fijos</h1>
                    <p className="text-sm sm:text-base text-muted-foreground">Gestiona tus tarjetas de crédito y suscripciones.</p>
                </div>
                <Button className="gap-2 w-full sm:w-auto">
                    <Plus className="w-4 h-4" />
                    Nuevo Gasto Fijo
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background opacity-50 z-0" />
                    <CardHeader className="relative z-10 pb-2">
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-sm font-medium flex items-center gap-2 text-primary uppercase tracking-wider">
                                    <CreditCard className="w-4 h-4" />
                                    Tarjeta Principal VISA
                                </CardTitle>
                                <CardDescription className="text-xs mt-1">Cierre: 25 del mes</CardDescription>
                            </div>
                            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                                Compartida
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="relative z-10 space-y-4">
                        <div className="space-y-1">
                            <div className="text-3xl font-bold font-outfit text-foreground group-hover:text-primary transition-colors">
                                $ {totalDebt.toLocaleString()}
                            </div>
                            <p className="text-xs text-muted-foreground">Deuda acumulada a pagar a principios de mes</p>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs sm:text-sm">
                                <span className="text-muted-foreground">Límite disponible: <strong>${(limit - totalDebt).toLocaleString()}</strong></span>
                            </div>
                            <Progress value={percent} className="h-2 bg-secondary" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 font-outfit text-lg">
                            <RefreshCw className="w-4 h-4 text-primary" />
                            Gastos Fijos y Suscripciones
                        </CardTitle>
                        <CardDescription className="text-xs">Servicios que se debitan automáticamente.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {initialFixedExpenses.map((expense) => (
                                <div key={expense.id} className="flex items-center justify-between p-3 rounded-lg bg-background/40 border border-border/20">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${expense.bgColor} ${expense.color}`}>
                                            <expense.icon className="w-4 h-4" />
                                        </div>
                                        <div className="font-medium text-sm">{expense.name}</div>
                                    </div>
                                    <div className="font-bold font-outfit text-sm">
                                        $ {expense.amount.toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 pt-4 border-t border-border/20 flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Total fijo mensual:</span>
                            <span className="font-bold font-outfit text-base">$ {initialFixedExpenses.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
