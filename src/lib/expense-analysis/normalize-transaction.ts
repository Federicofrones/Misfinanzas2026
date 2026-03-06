import { Transaction } from "@/lib/schemas";
import { groupingRules } from "./grouping-rules";

export interface NormalizedTransaction extends Transaction {
    id: string; // Add id since we expect to use it
    normalizedGroup: string;
    unitPrice: number | undefined;
}

const normalizeString = (str: string) => {
    return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

// Infers grouping based on merchant, productName, description, category
export const inferNormalizedGroup = (tx: any): string => {
    // If user already assigned one, respect it
    if (tx.normalizedGroup) return tx.normalizedGroup;

    const searchableText = [
        tx.productName,
        tx.merchant,
        tx.note,
        tx.categoryId,
        ...(tx.tags || [])
    ].filter(Boolean).map(s => normalizeString(s as string)).join(" ");

    for (const rule of groupingRules) {
        for (const keyword of rule.keywords) {
            const normalizedKeyword = normalizeString(keyword);
            if (searchableText.includes(normalizedKeyword)) {
                return rule.normalizedGroup;
            }
        }
    }

    // Fallback: Use categoryId or merchant if nothing matches, to avoid 'Desconocido' as much as possible
    if (tx.categoryId) return normalizeString(tx.categoryId);
    return 'otros_gastos';
}

export const normalizeTransaction = (tx: any): NormalizedTransaction => {
    const normalizedGroup = inferNormalizedGroup(tx);

    // Calculate unitPrice if quantity is provided and unitPrice isn't
    let unitPrice = tx.unitPrice;
    if (!unitPrice && tx.amount && tx.quantity && tx.quantity > 0) {
        unitPrice = tx.amount / tx.quantity;
    }

    return {
        ...tx,
        normalizedGroup,
        unitPrice
    };
}
