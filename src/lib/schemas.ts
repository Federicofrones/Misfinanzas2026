import { z } from "zod";

export const transactionSchema = z.object({
    type: z.enum(['income', 'expense', 'transfer']),
    amount: z.number().positive(),
    date: z.date(),
    categoryId: z.string().nullable(),
    accountId: z.string().nullable(),
    accountToId: z.string().nullable(),
    payerUserId: z.string(),
    splitMode: z.enum(['shared_even', 'shared_percent', 'personal']),
    splitPercents: z.record(z.string(), z.number()).nullable(),
    merchant: z.string().nullable(),
    note: z.string().nullable(),
    tags: z.array(z.string()),
    attachmentUrl: z.string().nullable(),
    paymentMethod: z.enum(['cash_debit', 'credit_card']).default('cash_debit').optional(),
    productName: z.string().nullable().optional(),
    quantity: z.number().positive().nullable().optional(),
    unit: z.string().nullable().optional(),
    unitPrice: z.number().nullable().optional(),
    normalizedGroup: z.string().nullable().optional(),
});

export type Transaction = z.infer<typeof transactionSchema>;
