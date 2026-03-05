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
});

export type Transaction = z.infer<typeof transactionSchema>;
