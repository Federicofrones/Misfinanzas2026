"use client"

import * as React from "react"
import {
    TrendingDown,
    Plus,
    AlertCircle,
    PiggyBank,
    PencilLine,
    Trash
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

const initialBudgets: any[] = [];

export default function BudgetsPage() {
    const [budgets, setBudgets] = React.useState(initialBudgets);
    const [editingBudget, setEditingBudget] = React.useState<any>(null);
    const [editForm, setEditForm] = React.useState({ category: "", limit: "" });
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);

    const openEditBudget = (budget: any) => {
        setEditingBudget(budget);
        setEditForm({ category: budget.category, limit: budget.limit.toString() });
        setIsDialogOpen(true);
    };

    const openAddBudget = () => {
        setEditingBudget(null);
        setEditForm({ category: "", limit: "" });
        setIsDialogOpen(true);
    };

    const handleSaveBudget = () => {
        const newLimit = parseFloat(editForm.limit);

        if (!editForm.category || isNaN(newLimit) || newLimit <= 0) {
            toast.error("Por favor, introduce una categoría y un importe válido.");
            return;
        }

        if (editingBudget) {
            setBudgets(budgets.map(b => b.id === editingBudget.id ? { ...b, category: editForm.category, limit: newLimit } : b));
            toast.success(`Presupuesto de ${editForm.category} actualizado.`);
        } else {
            setBudgets([...budgets, {
                id: Math.random().toString(),
                category: editForm.category,
                spent: 0,
                limit: newLimit,
                color: "bg-primary"
            }]);
            toast.success(`Nuevo presupuesto añadido.`);
        }
        setIsDialogOpen(false);
    };

    const handleDeleteBudget = (id: string) => {
        setBudgets(budgets.filter(b => b.id !== id));
        toast.success("Presupuesto eliminado.");
    };

    // Resumen de ejemplo
    const totalAhorro = budgets.reduce((acc, curr) => acc + (curr.limit - curr.spent > 0 ? curr.limit - curr.spent : 0), 0);
    const excedidos = budgets.filter(b => b.spent > b.limit).length;

    return (
        <div className="space-y-6 pb-12">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold font-outfit">Presupuestos</h1>
                    <p className="text-sm sm:text-base text-muted-foreground">Controlad vuestros gastos por categoría.</p>
                </div>
                <Button className="gap-2 w-full sm:w-auto" onClick={openAddBudget}>
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
                        <div className="text-3xl font-bold font-outfit text-emerald-700">$ {totalAhorro.toLocaleString()}</div>
                        <p className="text-xs text-emerald-600/80">Dinero sobrante de presupuestos</p>
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
                        <div className="text-3xl font-bold font-outfit text-red-700">{excedidos} Categoría(s)</div>
                        <p className="text-xs text-red-600/80">Revisa tus excesos</p>
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
                        <div className="text-3xl font-bold font-outfit text-blue-700">$ 0</div>
                        <p className="text-xs text-blue-600/80">Basado en los últimos 30 días</p>
                    </CardContent>
                </Card>
            </div>

            <h2 className="text-xl font-semibold font-outfit mt-8">Límites por Categoría</h2>
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                {budgets.map((budget) => {
                    const percent = budget.limit > 0 ? Math.min((budget.spent / budget.limit) * 100, 100) : 0;
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
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant={isOver ? "destructive" : "outline"} className={!isOver ? "bg-primary/5 text-primary border-primary/20 whitespace-nowrap" : "whitespace-nowrap"}>
                                            {Math.round(percent)}%
                                        </Badge>
                                        <Button variant="ghost" size="icon" className="h-6 w-6 ml-2 text-muted-foreground hover:text-primary" onClick={() => openEditBudget(budget)}>
                                            <PencilLine className="h-3 w-3" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => handleDeleteBudget(budget.id)}>
                                            <Trash className="h-3 w-3" />
                                        </Button>
                                    </div>
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
                {budgets.length === 0 && (
                    <div className="col-span-full text-center text-sm text-muted-foreground py-10">
                        No hay presupuestos activos por ahora. Presiona "Nuevo Presupuesto" para comenzar a planificar.
                    </div>
                )}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{editingBudget ? "Editar Presupuesto" : "Nuevo Presupuesto"}</DialogTitle>
                        <DialogDescription>
                            Define un límite para mantener tus gastos controlados en una categoría específica.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="catname">Categoría</Label>
                            <Input
                                id="catname"
                                value={editForm.category}
                                onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                                placeholder="Ej: Supermercado, Alquiler, etc."
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="limit">Límite Mensual ($)</Label>
                            <Input
                                id="limit"
                                type="number"
                                value={editForm.limit}
                                onChange={(e) => setEditForm(prev => ({ ...prev, limit: e.target.value }))}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                        <Button onClick={handleSaveBudget}>{editingBudget ? "Guardar Cambios" : "Crear Presupuesto"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    )
}
