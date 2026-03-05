'use server';

import { adminDb } from "@/lib/firebase/admin";
import { Role } from "@/lib/permissions";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createWorkspace(data: {
    userId: string,
    userEmail: string,
    displayName: string,
    name: string,
    currency: string,
    monthStartDay: number
}) {
    try {
        const wsRef = adminDb.collection('workspaces').doc();

        await adminDb.runTransaction(async (t) => {
            t.set(wsRef, {
                name: data.name,
                currency: data.currency || 'UYU',
                monthStartDay: data.monthStartDay || 1,
                thresholds: { budgetWarn: 0.8, budgetCritical: 1.0, monthVariation: 0.3 },
                createdAt: new Date(),
            });

            const memberRef = wsRef.collection('members').doc(data.userId);
            t.set(memberRef, {
                role: 'ADMIN' as Role,
                email: data.userEmail,
                displayName: data.displayName,
                createdAt: new Date(),
            });
        });

        revalidatePath('/app');
        return { success: true, workspaceId: wsRef.id };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function inviteMember(workspaceId: string, email: string, role: Role, invitedBy: string) {
    try {
        const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

        await adminDb.collection('invites').doc(token).set({
            workspaceId,
            email,
            role,
            createdBy: invitedBy,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            acceptedAt: null,
            createdAt: new Date(),
        });

        return { success: true, token };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function acceptInvite(token: string, userId: string, userEmail: string, displayName: string) {
    try {
        const inviteRef = adminDb.collection('invites').doc(token);
        const inviteDoc = await inviteRef.get();

        if (!inviteDoc.exists) throw new Error("Invitación no válida");

        const data = inviteDoc.data()!;
        if (data.acceptedAt) throw new Error("Invitación ya aceptada");
        if (data.email !== userEmail) throw new Error("Esta invitación no es para este correo");
        if (data.expiresAt.toDate() < new Date()) throw new Error("Invitación expirada");

        const wsRef = adminDb.collection('workspaces').doc(data.workspaceId);
        const memberRef = wsRef.collection('members').doc(userId);

        await adminDb.runTransaction(async (t) => {
            t.set(memberRef, {
                role: data.role,
                email: userEmail,
                displayName,
                createdAt: new Date(),
            });
            t.update(inviteRef, { acceptedAt: new Date() });
        });

        revalidatePath('/app');
        return { success: true, workspaceId: data.workspaceId };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
