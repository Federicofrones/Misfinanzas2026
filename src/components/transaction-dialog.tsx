"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { PlusCircle, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
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
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { transactionSchema, Transaction } from "@/lib/schemas"
import { createTransaction } from "@/actions/transactions"
import { TicketUpload } from "@/components/ticket-upload"
import { auth } from "@/lib/firebase/client"

export function TransactionDialog({ workspaceId }: { workspaceId: string }) {
    const [open, setOpen] = React.useState(false)
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    const form = useForm<Transaction>({
        resolver: zodResolver(transactionSchema),
        defaultValues: {
            type: "expense",
            amount: 0,
            date: new Date(),
            categoryId: null,
            accountId: null,
            accountToId: null,
            payerUserId: auth.currentUser?.uid || "",
            splitMode: "shared_even",
            splitPercents: null,
            merchant: "",
            note: "",
            tags: [],
            attachmentUrl: null,
        },
    })

    async function onSubmit(values: Transaction) {
        if (!auth.currentUser) return toast.error("No autenticado")

        setIsSubmitting(true)
        const res = await createTransaction(workspaceId, {
            ...values,
            payerUserId: auth.currentUser.uid
        })
        setIsSubmitting(false)

        if (res.success) {
            toast.success("Transacción registrada")
            setOpen(false)
            form.reset()
        } else {
            toast.error(res.error)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="rounded-full gap-2 shadow-lg shadow-primary/20">
                    <PlusCircle className="w-4 h-4" />
                    <span className="hidden sm:inline">Nueva Transacción</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] border-primary/20 bg-card/95 backdrop-blur-xl">
                <DialogHeader>
                    <DialogTitle className="font-outfit text-2xl">Nueva Transacción</DialogTitle>
                    <DialogDescription>
                        Registra un nuevo ingreso o gasto en tu espacio compartido.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tipo</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Tipo" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="expense">Gasto</SelectItem>
                                                <SelectItem value="income">Ingreso</SelectItem>
                                                <SelectItem value="transfer">Transferencia</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="amount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Monto</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="0.00"
                                                {...field}
                                                onChange={e => field.onChange(parseFloat(e.target.value))}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="merchant"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Comercio / Descripción</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ej: Supermercado Tata" {...field} value={field.value || ''} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="attachmentUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Comprobante</FormLabel>
                                    <FormControl>
                                        <TicketUpload
                                            onUploadSuccess={(url) => field.onChange(url)}
                                        />
                                    </FormControl>
                                    {field.value && (
                                        <p className="text-[10px] text-primary truncate">Archivo listo: {field.value}</p>
                                    )}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Registrando...
                                    </>
                                ) : (
                                    "Guardar Transacción"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
