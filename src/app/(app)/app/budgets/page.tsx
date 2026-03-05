"use client"

import * as React from "react"
import {
    TrendingDown,
    Plus,
    AlertCircle,
    PiggyBank,
    PencilLine
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

const initialBudgets: any[] = [];

export default function BudgetsPage() {
    const [budgets, setBudgets] = React.useState(initialBudgets);
    const [editingBudget, setEditingBudget] = React.useState<any>(null);
    const [editLimit, setEditLimit] = React.useState("");

    const handleEditSave = () => {
        if (!editingBudget) return;
        const newLimit = parseFloat(editLimit);

        if (isNaN(newLimit) || newLimit <= 0) {
            toast.error("Por favor, introduce un importe válido mayor a 0.");
            return;
        }

        setBudgets(budgets.map(b => b.id === editingBudget.id ? { ...b, limit: newLimit } : b));
        toast.success(`Presupuesto de ${editingBudget.category} actualizado.`);
        setEditingBudget(null);
    };

    return (
        <div className="space-y-6 pb-12">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold font-outfit">Presupuestos</h1>
                    <p className="text-sm sm:text-base text-muted-foreground">Controlad vuestros gastos por categoría.</p>
                </div>
                <Button className="gap-2 w-full sm:w-auto">
                    <Plus className="w-4 h-4" />
                    Nuevo Presupuesto
                </Button>
            </div>

            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
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

                <Card className="bg-blue-500/5 border-blue-500/10 sm:col-span-2 lg:col-span-1">
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
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                {budgets.map((budget) => {
                    const percent = Math.min((budget.spent / budget.limit) * 100, 100);
                    const isOver = budget.spent > budget.limit;

                    return (
                        <Card key={budget.id} className="border-border/40 overflow-hidden group hover:shadow-md transition-all">
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-2">
                                        <div>
                                            <CardTitle className="text-lg font-outfit">{budget.category}</CardTitle>
                                            <CardDescription className="text-xs sm:text-sm">Presupuesto mensual</CardDescription>
                                        </div>
                                        <Dialog open={editingBudget?.id === budget.id} onOpenChange={(isOpen) => {
                                            if (isOpen) {
                                                setEditingBudget(budget);
                                                setEditLimit(budget.limit.toString());
                                            } else {
                                                setEditingBudget(null);
                                            }
                                        }}>
                                            <DialogTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-6 w-6 ml-2 text-muted-foreground hover:text-primary">
                                                    <PencilLine className="h-3 w-3" />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[425px]">
                                                <DialogHeader>
                                                    <DialogTitle>Editar Presupuesto</DialogTitle>
                                                    <DialogDescription>
                                                        Ajusta el límite mensual para la categoría <strong>{budget.category}</strong>.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="grid gap-4 py-4">
                                                    <div className="grid gap-2">
                                                        <Label htmlFor="limit">Límite Mensual ($)</Label>
                                                        <Input
                                                            id="limit"
                                                            type="number"
                                                            value={editLimit}
                                                            onChange={(e) => setEditLimit(e.target.value)}
                                                            className="text-lg font-bold"
                                                        />
                                                    </div>
                                                </div>
                                                <DialogFooter>
                                                    <Button variant="outline" onClick={() => setEditingBudget(null)}>Cancelar</Button>
                                                    <Button onClick={handleEditSave}>Guardar Cambios</Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                    <Badge variant={isOver ? "destructive" : "outline"} className={!isOver ? "bg-primary/5 text-primary border-primary/20 whitespace-nowrap" : "whitespace-nowrap"}>
                                        {Math.round((budget.spent / budget.limit) * 100)}%
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs sm:text-sm">
                                        <span className="text-muted-foreground">Gastado: <strong>${budget.spent.toLocaleString()}</strong></span>
                                        <span className="text-muted-foreground">Límite: <strong>${budget.limit.toLocaleString()}</strong></span>
                                    </div>
                                    <Progress value={percent} className={`h-2 ${isOver ? 'bg-red-500/20' : 'bg-secondary'}`} />
                                </div>
                                {isOver && (
                                    <div className="flex items-center gap-2 text-[10px] text-red-500 font-bold uppercase">
                                        <AlertCircle className="w-3 h-3 flex-shrink-0" />
                                        <span>Has superado el presupuesto</span>
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
