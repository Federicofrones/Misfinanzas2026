"use client"

import * as React from "react"
import { CreditCard, Plus, Server, PlayCircle, RefreshCw, PencilLine, MoreHorizontal, Edit, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"

const initialFixedExpenses: any[] = [];

export default function CreditCardsPage() {
    // Card state
    const [cardDetails, setCardDetails] = React.useState({
        name: "Mi Tarjeta VISA",
        closingDate: "-",
        totalDebt: 0,
        limit: 100000
    });
    const [isCardDialogOpen, setIsCardDialogOpen] = React.useState(false);
    const [cardForm, setCardForm] = React.useState({ name: "", closingDate: "", totalDebt: "", limit: "" });

    // Expenses state
    const [expenses, setExpenses] = React.useState(initialFixedExpenses);
    const [editingExpense, setEditingExpense] = React.useState<any>(null);
    const [expenseForm, setExpenseForm] = React.useState({ name: "", amount: "" });
    const [isExpenseDialogOpen, setIsExpenseDialogOpen] = React.useState(false);

    const percent = cardDetails.limit > 0 ? Math.min((cardDetails.totalDebt / cardDetails.limit) * 100, 100) : 0;

    const openCardEdit = () => {
        setCardForm({
            name: cardDetails.name,
            closingDate: cardDetails.closingDate,
            totalDebt: cardDetails.totalDebt.toString(),
            limit: cardDetails.limit.toString()
        });
        setIsCardDialogOpen(true);
    };

    const handleSaveCard = () => {
        const debt = parseFloat(cardForm.totalDebt);
        const limit = parseFloat(cardForm.limit);

        if (isNaN(debt) || isNaN(limit) || limit <= 0) {
            toast.error("Formatos numéricos inválidos en deuda o límite.");
            return;
        }

        setCardDetails({
            name: cardForm.name,
            closingDate: cardForm.closingDate,
            totalDebt: debt,
            limit: limit
        });

        toast.success("Tarjeta actualizada correctamente.");
        setIsCardDialogOpen(false);
    };

    const openAddExpense = () => {
        setEditingExpense(null);
        setExpenseForm({ name: "", amount: "" });
        setIsExpenseDialogOpen(true);
    };

    const openEditExpense = (expense: any) => {
        setEditingExpense(expense);
        setExpenseForm({ name: expense.name, amount: expense.amount.toString() });
        setIsExpenseDialogOpen(true);
    };

    const handleSaveExpense = () => {
        const amt = parseFloat(expenseForm.amount);
        if (!expenseForm.name || isNaN(amt) || amt <= 0) {
            toast.error("Nombre o monto inválido.");
            return;
        }

        if (editingExpense) {
            setExpenses(expenses.map(e => e.id === editingExpense.id ? { ...e, name: expenseForm.name, amount: amt } : e));
            toast.success("Gasto fijo actualizado.");
        } else {
            setExpenses([...expenses, {
                id: Math.random().toString(),
                name: expenseForm.name,
                amount: amt,
                icon: PlayCircle,
                color: "text-blue-500",
                bgColor: "bg-blue-500/10"
            }]);
            toast.success("Nuevo gasto fijo agregado.");
        }
        setIsExpenseDialogOpen(false);
    };

    const handleDeleteExpense = (id: string) => {
        setExpenses(expenses.filter(e => e.id !== id));
        toast.success("Gasto fijo eliminado.");
    };

    return (
        <div className="space-y-6 pb-12">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold font-outfit">Tarjetas y Pagos Fijos</h1>
                    <p className="text-sm sm:text-base text-muted-foreground">Gestiona tus tarjetas de crédito y suscripciones.</p>
                </div>
                <Button className="gap-2 w-full sm:w-auto" onClick={openAddExpense}>
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
                                    {cardDetails.name}
                                </CardTitle>
                                <CardDescription className="text-xs mt-1">Cierre: {cardDetails.closingDate}</CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                                    Compartida
                                </Badge>
                                <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-primary z-20" onClick={openCardEdit}>
                                    <PencilLine className="h-3 w-3" />
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="relative z-10 space-y-4">
                        <div className="space-y-1">
                            <div className="text-3xl font-bold font-outfit text-foreground group-hover:text-primary transition-colors">
                                $ {cardDetails.totalDebt.toLocaleString()}
                            </div>
                            <p className="text-xs text-muted-foreground">Deuda acumulada a pagar a principios de mes</p>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs sm:text-sm">
                                <span className="text-muted-foreground">Límite disponible: <strong>${(cardDetails.limit - cardDetails.totalDebt).toLocaleString()}</strong></span>
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
                            {expenses.map((expense) => (
                                <div key={expense.id} className="flex items-center justify-between p-3 rounded-lg bg-background/40 border border-border/20 group/expense hover:border-primary/30 transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${expense.bgColor} ${expense.color}`}>
                                            <expense.icon className="w-4 h-4" />
                                        </div>
                                        <div className="font-medium text-sm">{expense.name}</div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="font-bold font-outfit text-sm">
                                            $ {expense.amount.toLocaleString()}
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover/expense:opacity-100 transition-opacity">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => openEditExpense(expense)}>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Editar
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleDeleteExpense(expense.id)} className="text-destructive">
                                                    <Trash className="mr-2 h-4 w-4" />
                                                    Eliminar
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            ))}
                            {expenses.length === 0 && (
                                <div className="text-center text-sm text-muted-foreground py-4">
                                    No hay gastos fijos configurados.
                                </div>
                            )}
                        </div>
                        <div className="mt-4 pt-4 border-t border-border/20 flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Total fijo mensual:</span>
                            <span className="font-bold font-outfit text-base">$ {expenses.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Dialog Editar Tarjeta */}
            <Dialog open={isCardDialogOpen} onOpenChange={setIsCardDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Manejar Tarjeta</DialogTitle>
                        <DialogDescription>Edita la información de deuda límite y nombre de esta tarjeta.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="cardName">Nombre de la Tarjeta</Label>
                            <Input
                                id="cardName"
                                value={cardForm.name}
                                onChange={(e) => setCardForm(p => ({ ...p, name: e.target.value }))}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="closeDate">Día de Cierre</Label>
                            <Input
                                id="closeDate"
                                value={cardForm.closingDate}
                                onChange={(e) => setCardForm(p => ({ ...p, closingDate: e.target.value }))}
                                placeholder="Ej: 25 del mes"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="debt">Deuda actual ($)</Label>
                                <Input
                                    id="debt"
                                    type="number"
                                    value={cardForm.totalDebt}
                                    onChange={(e) => setCardForm(p => ({ ...p, totalDebt: e.target.value }))}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="limit">Límite Total ($)</Label>
                                <Input
                                    id="limit"
                                    type="number"
                                    value={cardForm.limit}
                                    onChange={(e) => setCardForm(p => ({ ...p, limit: e.target.value }))}
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCardDialogOpen(false)}>Cancelar</Button>
                        <Button onClick={handleSaveCard}>Guardar Cambios</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Dialog Agregar/Editar Gasto Fijo */}
            <Dialog open={isExpenseDialogOpen} onOpenChange={setIsExpenseDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingExpense ? "Editar Gasto Fijo" : "Nuevo Gasto Fijo"}</DialogTitle>
                        <DialogDescription>Añade o modifica un gasto que se repetirá mes a mes.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="expName">Nombre del Servicio</Label>
                            <Input
                                id="expName"
                                value={expenseForm.name}
                                onChange={(e) => setExpenseForm(p => ({ ...p, name: e.target.value }))}
                                placeholder="Ej: Netflix, Gym..."
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="expAmount">Costo Mensual ($)</Label>
                            <Input
                                id="expAmount"
                                type="number"
                                value={expenseForm.amount}
                                onChange={(e) => setExpenseForm(p => ({ ...p, amount: e.target.value }))}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsExpenseDialogOpen(false)}>Cancelar</Button>
                        <Button onClick={handleSaveExpense}>{editingExpense ? "Guardar Cambios" : "Agregar Gasto"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    )
}
