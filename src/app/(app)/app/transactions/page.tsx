"use client"

import * as React from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import {
    Search,
    Filter,
    ArrowUpRight,
    ArrowDownLeft,
    Receipt,
    MoreHorizontal,
    Edit,
    Trash
} from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

const initialTransactions: any[] = [];

export default function TransactionsPage() {
    const [searchTerm, setSearchTerm] = React.useState("");
    const [transactions, setTransactions] = React.useState<any[]>(initialTransactions);
    const [editingTx, setEditingTx] = React.useState<any>(null);
    const [editForm, setEditForm] = React.useState({
        merchant: "",
        amount: "",
        categoryId: "",
        type: "",
        paymentMethod: "cash_debit",
        productName: "",
        quantity: "",
        unit: ""
    });

    const openEditDialog = (tx: any) => {
        setEditingTx(tx);
        setEditForm({
            merchant: tx.merchant || "",
            amount: tx.amount ? tx.amount.toString() : "",
            categoryId: tx.categoryId || "",
            type: tx.type || "expense",
            paymentMethod: tx.paymentMethod || "cash_debit",
            productName: tx.productName || "",
            quantity: tx.quantity ? tx.quantity.toString() : "",
            unit: tx.unit || ""
        });
    };

    const handleEditSave = () => {
        if (!editingTx) return;
        const newAmount = parseFloat(editForm.amount);

        if (isNaN(newAmount) || newAmount <= 0) {
            toast.error("Por favor, introduce un importe válido.");
            return;
        }

        let newQuantity: number | undefined = parseFloat(editForm.quantity);
        if (isNaN(newQuantity) || newQuantity <= 0) newQuantity = undefined;

        let unitPrice: number | undefined = undefined;
        if (newAmount > 0 && newQuantity && newQuantity > 0) {
            unitPrice = newAmount / newQuantity;
        }

        setTransactions(transactions.map(tx =>
            tx.id === editingTx.id ? {
                ...tx,
                merchant: editForm.merchant,
                amount: newAmount,
                categoryId: editForm.categoryId,
                type: editForm.type,
                paymentMethod: editForm.paymentMethod,
                productName: editForm.productName,
                quantity: newQuantity,
                unit: editForm.unit,
                unitPrice: unitPrice
            } : tx
        ));
        toast.success("Transacción actualizada con éxito.");
        setEditingTx(null);
    };

    const handleDelete = (id: string) => {
        setTransactions(transactions.filter(tx => tx.id !== id));
        toast.success("Transacción eliminada.");
    };

    const filteredTransactions = transactions.filter(tx =>
        tx.merchant.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 pb-12">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight font-outfit">Historial de Transacciones</h1>
                    <p className="text-sm sm:text-base text-muted-foreground">Revisa y gestiona todos los movimientos de vuestro espacio.</p>
                </div>
            </div>

            <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-3 px-4 sm:px-6">
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                        <div className="relative w-full sm:flex-1 sm:max-w-sm">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar por comercio..."
                                className="pl-9 bg-background/50 border-border/40 text-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Button variant="outline" className="gap-2 border-border/40 w-full sm:w-auto">
                            <Filter className="w-4 h-4 text-muted-foreground" />
                            Filtros
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="px-0 sm:px-6">
                    <div className="rounded-none sm:rounded-md border-y sm:border border-border/40 overflow-hidden">
                        <div className="overflow-x-auto">
                            <Table className="min-w-[600px] sm:min-w-0">
                                <TableHeader className="bg-muted/50 font-outfit">
                                    <TableRow>
                                        <TableHead className="w-[100px] sm:w-[120px]">Fecha</TableHead>
                                        <TableHead>Comercio / Nota</TableHead>
                                        <TableHead className="hidden md:table-cell">Categoría</TableHead>
                                        <TableHead className="hidden sm:table-cell">Pagado por</TableHead>
                                        <TableHead className="text-right">Monto</TableHead>
                                        <TableHead className="w-[50px] sm:w-[60px] text-center">Ticket</TableHead>
                                        <TableHead className="w-[50px] text-right"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredTransactions.map((tx) => (
                                        <TableRow key={tx.id} className="hover:bg-muted/30 transition-colors">
                                            <TableCell className="text-muted-foreground text-[10px] sm:text-xs">
                                                {format(tx.date, "dd MMM, yy", { locale: es })}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                <div className="flex flex-col">
                                                    <span className="text-sm sm:text-base">{tx.merchant || "Sin descripción"}</span>
                                                    <span className="text-[9px] sm:text-[10px] text-muted-foreground uppercase tracking-widest">{tx.id}</span>
                                                    {/* Mostrar en móviles cosas ocultas */}
                                                    <div className="flex sm:hidden items-center gap-2 mt-1">
                                                        <Badge variant="secondary" className="px-1.5 py-0 text-[9px] capitalize font-normal bg-primary/5 text-primary border-primary/20">
                                                            {tx.categoryId}
                                                        </Badge>
                                                        <span className="text-[10px] text-muted-foreground">{tx.payerUserId === "user1" ? "Fico" : "Meli"}</span>
                                                        {tx.paymentMethod === 'credit_card' && (
                                                            <Badge variant="outline" className="px-1.5 py-0 text-[9px] font-normal border-primary/30 text-primary bg-primary/5">
                                                                Tarjeta
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="secondary" className="capitalize font-normal bg-primary/5 text-primary hover:bg-primary/10 border-primary/20">
                                                        {tx.categoryId}
                                                    </Badge>
                                                    {tx.paymentMethod === 'credit_card' && (
                                                        <Badge variant="outline" className="hidden lg:inline-flex text-[10px] font-medium border-primary/30 text-primary">
                                                            Crédito
                                                        </Badge>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-[10px] font-bold text-emerald-600">
                                                        {tx.payerUserId === "user1" ? "F" : "M"}
                                                    </div>
                                                    <span className="text-xs">{tx.payerUserId === "user1" ? "Fico" : "Meli"}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className={`text-right font-bold ${tx.type === 'income' ? 'text-emerald-500' : 'text-foreground'}`}>
                                                <div className="flex flex-col sm:flex-row items-end sm:items-center justify-end gap-1 text-xs sm:text-sm">
                                                    <div className="flex items-center gap-1">
                                                        {tx.type === 'income' ? (
                                                            <ArrowDownLeft className="w-3 h-3 hidden sm:block" />
                                                        ) : (
                                                            <ArrowUpRight className="w-3 h-3 text-destructive hidden sm:block" />
                                                        )}
                                                        ${tx.amount.toLocaleString()}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {tx.attachmentUrl ? (
                                                    <Button variant="ghost" size="icon" className="h-6 w-6 sm:h-8 sm:w-8 hover:bg-primary/20 hover:text-primary transition-all" asChild>
                                                        <a href={tx.attachmentUrl} target="_blank" rel="noreferrer">
                                                            <Receipt className="w-3 h-3 sm:w-4 sm:h-4" />
                                                        </a>
                                                    </Button>
                                                ) : (
                                                    <div className="flex justify-center opacity-20">
                                                        <Receipt className="w-3 h-3 sm:w-4 sm:h-4 strike" />
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                            <span className="sr-only">Abrir menú</span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => openEditDialog(tx)}>
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            <span>Editar</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleDelete(tx.id)} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                                                            <Trash className="mr-2 h-4 w-4" />
                                                            <span>Eliminar</span>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {filteredTransactions.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                                                No se encontraron transacciones.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Dialog open={!!editingTx} onOpenChange={(open) => !open && setEditingTx(null)}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Editar Transacción</DialogTitle>
                        <DialogDescription>
                            Modifica los datos de la transacción seleccionada.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="merchant">Comercio / Descripción</Label>
                            <Input
                                id="merchant"
                                value={editForm.merchant}
                                onChange={(e) => setEditForm(prev => ({ ...prev, merchant: e.target.value }))}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="productName">Producto (Opcional)</Label>
                            <Input
                                id="productName"
                                placeholder="Ej: Bidón de agua"
                                value={editForm.productName}
                                onChange={(e) => setEditForm(prev => ({ ...prev, productName: e.target.value }))}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="quantity">Cantidad (Opcional)</Label>
                                <Input
                                    id="quantity"
                                    type="number"
                                    step="0.01"
                                    value={editForm.quantity}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, quantity: e.target.value }))}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="unit">Unidad (Opcional)</Label>
                                <select
                                    id="unit"
                                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={editForm.unit}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, unit: e.target.value }))}
                                >
                                    <option value="">Seleccionar</option>
                                    <option value="unidad">Unidad</option>
                                    <option value="kg">Kg</option>
                                    <option value="g">g</option>
                                    <option value="litro">Litro</option>
                                    <option value="ml">ml</option>
                                    <option value="bidon">Bidón</option>
                                    <option value="paquete">Paquete</option>
                                    <option value="docena">Docena</option>
                                    <option value="caja">Caja</option>
                                    <option value="otro">Otro</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="amount">Monto ($)</Label>
                            <Input
                                id="amount"
                                type="number"
                                step="0.01"
                                value={editForm.amount}
                                onChange={(e) => setEditForm(prev => ({ ...prev, amount: e.target.value }))}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="type">Tipo</Label>
                                <select
                                    id="type"
                                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={editForm.type}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, type: e.target.value }))}
                                >
                                    <option value="expense">Gasto</option>
                                    <option value="income">Ingreso</option>
                                </select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="paymentMethod">Método de Pago</Label>
                                <select
                                    id="paymentMethod"
                                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={editForm.paymentMethod}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, paymentMethod: e.target.value }))}
                                >
                                    <option value="cash_debit">Efectivo / Débito</option>
                                    <option value="credit_card">Tarjeta de Crédito</option>
                                </select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="category">Categoría</Label>
                                <Input
                                    id="category"
                                    value={editForm.categoryId}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, categoryId: e.target.value }))}
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditingTx(null)}>Cancelar</Button>
                        <Button onClick={handleEditSave}>Guardar Cambios</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
