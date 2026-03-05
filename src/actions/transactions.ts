'use server';

import { adminDb } from "@/lib/firebase/admin";
import { Transaction, transactionSchema } from "@/lib/schemas";
import { revalidatePath } from "next/cache";

export async function createTransaction(workspaceId: string, data: Transaction) {
    try {
        // Validate with Zod
        const validatedData = transactionSchema.parse(data);

        const txRef = adminDb
            .collection('workspaces')
            .doc(workspaceId)
            .collection('transactions')
            .doc();

        const finalData = {
            ...validatedData,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        await txRef.set(finalData);

        revalidatePath(`/app/dashboard`);
        revalidatePath(`/app/transactions`);

        return { success: true, id: txRef.id };
    } catch (error: any) {
        console.error("Error creating transaction:", error);
        return { success: false, error: error.message || "Error desconocido" };
    }
}
