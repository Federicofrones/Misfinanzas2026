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
    Eye
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

// Mock data para visualización inicial (esto vendría de Firestore en producción)
const mockTransactions = [
    {
        id: "1",
        type: "expense",
        amount: 1250,
        merchant: "Supermercado Tata",
        date: new Date(),
        categoryId: "comidas",
        payerUserId: "user1",
        attachmentUrl: "https://res.cloudinary.com/dkvdcxi4u/image/upload/v1/tickets/sample",
    },
    {
        id: "2",
        type: "income",
        amount: 55000,
        merchant: "Salario Federico",
        date: new Date(Date.now() - 86400000 * 2),
        categoryId: "sueldo",
        payerUserId: "user1",
        attachmentUrl: null,
    },
    {
        id: "3",
        type: "expense",
        amount: 450,
        merchant: "Farmacia",
        date: new Date(Date.now() - 86400000 * 5),
        categoryId: "salud",
        payerUserId: "user2",
        attachmentUrl: null,
    }
];

export default function TransactionsPage() {
    const [searchTerm, setSearchTerm] = React.useState("");

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
                                        <TableHead className="w-[60px] sm:w-[80px] text-center">Ticket</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {mockTransactions.map((tx) => (
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
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                <Badge variant="secondary" className="capitalize font-normal bg-primary/5 text-primary hover:bg-primary/10 border-primary/20">
                                                    {tx.categoryId}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-[10px] font-bold text-emerald-600">
                                                        {tx.payerUserId === "user1" ? "F" : "M"}
                                                    </div>
                                                    <span className="text-xs">{tx.payerUserId === "user1" ? "Federico" : "Meli"}</span>
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
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
