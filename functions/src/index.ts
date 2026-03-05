import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

const db = admin.firestore();

// Recalculate monthly totals on transaction changes
export const onTransactionWrite = functions.firestore
    .document('workspaces/{wsId}/transactions/{txId}')
    .onWrite(async (change, context) => {
        const { wsId } = context.params;
        const before = change.before.data();
        const after = change.after.data();

        if (!after && !before) return null;

        const data = after || before;
        if (!data || !data.date) return null;

        // Determine the monthKey involved
        const monthKey = data.date.toDate().toISOString().slice(0, 7);

        // Trigger recalculation for this month
        await calculateMonthlyTotals(wsId, monthKey);
        return null;
    });

async function calculateMonthlyTotals(wsId: string, monthKey: string) {
    const start = new Date(monthKey + '-01');
    const end = new Date(monthKey + '-31'); // Approximation, better use date-fns or similar

    const txs = await db.collection(`workspaces/${wsId}/transactions`)
        .where('date', '>=', start)
        .where('date', '<=', end)
        .get();

    let incomeTotal = 0;
    let expenseTotal = 0;
    const byCategory: Record<string, number> = {};
    const byUserPaid: Record<string, number> = {};

    txs.forEach(doc => {
        const data = doc.data();
        const amount = data.amount || 0;
        if (data.type === 'income') incomeTotal += amount;
        if (data.type === 'expense') {
            expenseTotal += amount;
            const catId = data.categoryId || 'uncategorized';
            byCategory[catId] = (byCategory[catId] || 0) + amount;
        }

        const userId = data.payerUserId;
        if (userId) byUserPaid[userId] = (byUserPaid[userId] || 0) + amount;
    });

    await db.doc(`workspaces/${wsId}/monthly/${monthKey}`).set({
        incomeTotal,
        expenseTotal,
        netTotal: incomeTotal - expenseTotal,
        byCategory,
        byUserPaid,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
}

// Scheduled function for burn rate
export const dailyMaintenance = functions.pubsub.schedule('every 24 hours').onRun(async (context) => {
    const workspaces = await db.collection('workspaces').get();
    const today = new Date();
    const monthKey = today.toISOString().slice(0, 7);

    for (const ws of workspaces.docs) {
        // Logic for burn rate and alerts would go here
        console.log(`Checking workspace ${ws.id}`);
    }
    return null;
});
