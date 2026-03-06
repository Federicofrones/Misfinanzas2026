import { NormalizedTransaction } from "./normalize-transaction";

export interface MerchantPrice {
    merchant: string;
    purchaseCount: number;
    totalAmount: number;
    totalQuantity: number;
    averagePrice: number;
    minPrice: number;
    maxPrice: number;
}

export interface GroupInsight {
    normalizedGroup: string;
    totalSpent: number;
    purchaseCount: number;
    totalQuantity: number;
    averageUnitPrice: number | null;
    merchants: MerchantPrice[];

    // comparisons
    cheapestMerchant: string | null;
    mostExpensiveMerchant: string | null;
    minPriceOverall: number | null;
    maxPriceOverall: number | null;
    priceDispersionPercentage: number | null; // diff between max and min

    // savings opportunities
    idealSpent: number | null; // If all quantity was bought at minPriceOverall
    savingsPotential: number | null; // totalSpent - idealSpent
    savingsPercentage: number | null;
}

export const computeGroupInsights = (transactions: NormalizedTransaction[]): GroupInsight[] => {
    // Only analyze expenses
    const expenses = transactions.filter(t => t.type === 'expense');

    const groupedMap = new Map<string, NormalizedTransaction[]>();

    expenses.forEach(t => {
        const group = t.normalizedGroup || 'otros';
        if (!groupedMap.has(group)) {
            groupedMap.set(group, []);
        }
        groupedMap.get(group)!.push(t);
    });

    const insights: GroupInsight[] = [];

    for (const [groupName, txs] of Array.from(groupedMap.entries())) {
        const totalSpent = txs.reduce((acc, tx) => acc + (tx.amount || 0), 0);
        const purchaseCount = txs.length;

        let totalQuantity = 0;
        let sumUnitPrices = 0;
        let countWithUnitPrice = 0;

        // Group by merchant inside the group
        const merchantMap = new Map<string, NormalizedTransaction[]>();

        txs.forEach(tx => {
            const m = tx.merchant || 'Desconocido';
            if (!merchantMap.has(m)) {
                merchantMap.set(m, []);
            }
            merchantMap.get(m)!.push(tx);

            if (tx.quantity && tx.quantity > 0) {
                totalQuantity += tx.quantity;
            }
            if (tx.unitPrice) {
                sumUnitPrices += tx.unitPrice;
                countWithUnitPrice += 1;
            } else if (tx.quantity && tx.amount) {
                sumUnitPrices += (tx.amount / tx.quantity);
                countWithUnitPrice += 1;
            } else if (tx.amount) {
                // Approximate: if no quantity, treat purchase as 1 unit
                sumUnitPrices += tx.amount;
                countWithUnitPrice += 1;
            }
        });

        const merchants: MerchantPrice[] = [];
        let globalMinPrice = Infinity;
        let globalMaxPrice = -Infinity;
        let cheapestMerch: string | null = null;
        let mostExpensiveMerch: string | null = null;

        for (const [merchantName, mtxs] of Array.from(merchantMap.entries())) {
            let mTotalAmount = 0;
            let mTotalQuantity = 0;
            let mSumUnit = 0;
            let mCountUnit = 0;
            let mMinPrice = Infinity;
            let mMaxPrice = -Infinity;

            mtxs.forEach(tx => {
                mTotalAmount += (tx.amount || 0);
                if (tx.quantity) mTotalQuantity += tx.quantity;

                let uPrice = tx.unitPrice;
                if (!uPrice && tx.quantity && tx.amount) uPrice = tx.amount / tx.quantity;
                if (!uPrice && tx.amount) uPrice = tx.amount; // default to 1 unit if omitted

                if (uPrice) {
                    mSumUnit += uPrice;
                    mCountUnit++;
                    if (uPrice < mMinPrice) mMinPrice = uPrice;
                    if (uPrice > mMaxPrice) mMaxPrice = uPrice;
                }
            });

            const avgP = mCountUnit > 0 ? mSumUnit / mCountUnit : 0;

            if (mCountUnit > 0) {
                if (mMinPrice < globalMinPrice) {
                    globalMinPrice = mMinPrice;
                    cheapestMerch = merchantName;
                }
                if (mMaxPrice > globalMaxPrice) {
                    globalMaxPrice = mMaxPrice;
                    mostExpensiveMerch = merchantName;
                }
            }

            merchants.push({
                merchant: merchantName,
                purchaseCount: mtxs.length,
                totalAmount: mTotalAmount,
                totalQuantity: mTotalQuantity,
                averagePrice: avgP,
                minPrice: mCountUnit > 0 ? mMinPrice : 0,
                maxPrice: mCountUnit > 0 ? mMaxPrice : 0
            });
        }

        const averageUnitPrice = countWithUnitPrice > 0 ? sumUnitPrices / countWithUnitPrice : null;

        let idealSpent: number | null = null;
        let savingsPot: number | null = null;
        let savingsPerc: number | null = null;

        if (globalMinPrice !== Infinity && totalQuantity > 0) {
            idealSpent = globalMinPrice * totalQuantity;
            savingsPot = totalSpent - idealSpent;
            if (savingsPot < 0) savingsPot = 0;
            savingsPerc = totalSpent > 0 ? (savingsPot / totalSpent) * 100 : 0;
        } else if (globalMinPrice !== Infinity) {
            // fallback using purchase count as quantity
            idealSpent = globalMinPrice * purchaseCount;
            savingsPot = totalSpent - idealSpent;
            if (savingsPot < 0) savingsPot = 0;
            savingsPerc = totalSpent > 0 ? (savingsPot / totalSpent) * 100 : 0;
        }

        let priceDispersionPercentage: number | null = null;
        if (globalMinPrice !== Infinity && globalMaxPrice !== -Infinity && globalMinPrice > 0) {
            priceDispersionPercentage = ((globalMaxPrice - globalMinPrice) / globalMinPrice) * 100;
        }

        insights.push({
            normalizedGroup: groupName,
            totalSpent,
            purchaseCount,
            totalQuantity,
            averageUnitPrice,
            merchants: merchants.sort((a, b) => b.totalAmount - a.totalAmount),
            cheapestMerchant: cheapestMerch,
            mostExpensiveMerchant: mostExpensiveMerch,
            minPriceOverall: globalMinPrice === Infinity ? null : globalMinPrice,
            maxPriceOverall: globalMaxPrice === -Infinity ? null : globalMaxPrice,
            priceDispersionPercentage,
            idealSpent,
            savingsPotential: savingsPot,
            savingsPercentage: savingsPerc
        });
    }

    // Sort by savings potential descending, then by total spent
    return insights.sort((a, b) => {
        if (b.savingsPotential && a.savingsPotential) {
            return b.savingsPotential - a.savingsPotential;
        }
        return b.totalSpent - a.totalSpent;
    });
};
