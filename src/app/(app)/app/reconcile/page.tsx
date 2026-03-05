"use client"

import * as React from "react"
import {
    Scale,
    ArrowRightLeft,
    CheckCircle2,
    AlertCircle,
    History,
    TrendingDown,
    TrendingUp
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

// Mock data (vendría de Firestore)
const mockReconciliation = {
    totalSharedExpenses: 12500,
    federicoPaid: 8500,
    meliPaid: 4000,
    fairShare: 6250,
    debtor: "Meli",
    creditor: "Federico",
    amountOwed: 2250,
    status: "unsettled" // 'unsettled' | 'settled'
};

const mockHistory = [
    { id: "1", date: "28 Feb, 2026", amount: 1500, from: "Meli", to: "Federico", status: "completado" },
    { id: "2", date: "31 Ene, 2026", amount: 450, from: "Federico", to: "Meli", status: "completado" },
];

export default function ReconcilePage() {
    const [isSettling, setIsSettling] = React.useState(false);
    const [showConfetti, setShowConfetti] = React.useState(false);

    const handleSettleDebt = () => {
        setIsSettling(true);
        setTimeout(() => {
            setIsSettling(false);
            setShowConfetti(true);
            toast.success("Deuda saldada correctamente. ¡Balance a 0!");
            setTimeout(() => setShowConfetti(false), 3000);
        }, 1500);
    };

    const percentFico = (mockReconciliation.federicoPaid / mockReconciliation.totalSharedExpenses) * 100;
    const percentMeli = (mockReconciliation.meliPaid / mockReconciliation.totalSharedExpenses) * 100;

    return (
        <div className="space-y-6 pb-12 relative overflow-hidden">
            {showConfetti && (
                <div className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center">
                    {/* Un placeholder para animación de confetti, visualmente resuelto con un toast para este MVP */}
                    <div className="animate-bounce bg-primary text-primary-foreground px-6 py-3 rounded-full font-bold shadow-xl shadow-primary/20">
                        ¡Cuentas Claras! 🎉
                    </div>
                </div>
            )}

            <div>
                <h1 className="text-2xl sm:text-3xl font-bold font-outfit">Conciliación</h1>
                <p className="text-sm sm:text-base text-muted-foreground">¿Quién le debe a quién? Las cuentas claras conservan la relación.</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <Card className="border-border/40 bg-card/50 backdrop-blur-sm shadow-xl">
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 font-outfit text-lg sm:text-xl">
                            <Scale className="w-5 h-5 text-primary" />
                            Balance Actual
                        </CardTitle>
                        <CardDescription className="text-xs sm:text-sm">Resumen de los gastos compartidos de este mes.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex flex-col items-center justify-center py-6 px-4 bg-gradient-to-br from-background to-muted/20 rounded-xl border border-border/40 text-center">
                            <p className="text-xs sm:text-sm text-muted-foreground mb-2 uppercase tracking-wide font-medium">Deuda Pendiente</p>
                            <div className="text-4xl sm:text-5xl font-bold font-outfit tracking-tighter text-foreground flex items-center justify-center gap-1 sm:gap-2">
                                <span className="text-primary">$</span>
                                {mockReconciliation.amountOwed.toLocaleString()}
                            </div>
                            <div className="mt-4 flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-xs sm:text-sm w-full justify-center">
                                <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20 px-3 py-1 whitespace-nowrap">
                                    {mockReconciliation.debtor} debe
                                </Badge>
                                <ArrowRightLeft className="w-4 h-4 text-muted-foreground hidden sm:block" />
                                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-3 py-1 whitespace-nowrap mt-1 sm:mt-0">
                                    {mockReconciliation.creditor} recibe
                                </Badge>
                            </div>
                        </div>

                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className="w-full h-12 text-md font-bold hover:-translate-y-1 transition-transform shadow-lg shadow-primary/20">
                                    <CheckCircle2 className="w-5 h-5 mr-2" />
                                    Saldar Deuda Ahora
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="w-[95vw] max-w-[425px] sm:w-full rounded-xl">
                                <DialogHeader>
                                    <DialogTitle className="font-outfit">Confirmar Liquidación</DialogTitle>
                                    <DialogDescription className="text-xs sm:text-sm">
                                        ¿Estás seguro de que {mockReconciliation.debtor} ha pagado ${mockReconciliation.amountOwed.toLocaleString()} a {mockReconciliation.creditor}?
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="bg-muted/50 p-4 rounded-lg my-4 flex items-center justify-between border border-border/40">
                                    <div className="text-xs sm:text-sm text-muted-foreground">Monto a liquidar:</div>
                                    <div className="text-xl font-bold text-primary">${mockReconciliation.amountOwed.toLocaleString()}</div>
                                </div>
                                <DialogFooter className="flex-col sm:flex-row sm:justify-between gap-2">
                                    <DialogTrigger asChild>
                                        <Button variant="ghost" className="text-muted-foreground w-full sm:w-auto">Cancelar</Button>
                                    </DialogTrigger>
                                    <Button onClick={handleSettleDebt} disabled={isSettling} className="w-full sm:w-auto min-w-[120px]">
                                        {isSettling ? "Procesando..." : "Sí, saldar deuda"}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        <div className="pt-4 border-t border-border/20">
                            <div className="flex justify-between items-center text-xs sm:text-sm mb-4">
                                <span className="text-muted-foreground">Gastos Totales: <br className="sm:hidden" /><strong className="text-foreground">${mockReconciliation.totalSharedExpenses.toLocaleString()}</strong></span>
                                <span className="text-muted-foreground text-right">Cuota Ideal: <br className="sm:hidden" /><strong className="text-foreground">${mockReconciliation.fairShare.toLocaleString()}</strong></span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-outfit">Aportes del Mes</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-4">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div> Federico
                                    </span>
                                    <div className="text-right">
                                        <span className="block font-bold">${mockReconciliation.federicoPaid.toLocaleString()}</span>
                                        <span className="text-[10px] text-muted-foreground">{percentFico.toFixed(1)}% del total</span>
                                    </div>
                                </div>
                                <Progress value={percentFico} className="h-2 bg-muted/50 [&>div]:bg-emerald-500" />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-blue-500"></div> Meli
                                    </span>
                                    <div className="text-right">
                                        <span className="block font-bold">${mockReconciliation.meliPaid.toLocaleString()}</span>
                                        <span className="text-[10px] text-muted-foreground">{percentMeli.toFixed(1)}% del total</span>
                                    </div>
                                </div>
                                <Progress value={percentMeli} className="h-2 bg-muted/50 [&>div]:bg-blue-500" />
                            </div>

                            {Math.abs(percentFico - 50) > 15 && (
                                <div className="flex items-start gap-2 bg-amber-500/10 text-amber-600 p-3 rounded-md text-xs border border-amber-500/20">
                                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                    <p>Existe un desequilibrio notable en los aportes de este mes. Considere saldar la deuda pronto para no arrastrar montos grandes.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-outfit flex items-center gap-2">
                                <History className="w-4 h-4" />
                                Historial de Liquidaciones
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <div className="space-y-4">
                                {mockHistory.map((history) => (
                                    <div key={history.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/20 gap-2 sm:gap-0">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">{history.from} pagó a {history.to}</span>
                                            <span className="text-xs text-muted-foreground">{history.date}</span>
                                        </div>
                                        <div className="text-left sm:text-right flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start">
                                            <span className="font-bold text-emerald-500">+${history.amount}</span>
                                            <Badge variant="outline" className="text-[9px] h-4 sm:mt-1 bg-background/50">{history.status}</Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
