import { GroupInsight } from "./compute-group-insights";

export interface Recommendation {
    id: string;
    title: string;
    description: string;
}

export const generateRecommendations = (insights: GroupInsight[]): Recommendation[] => {
    const recommendations: Recommendation[] = [];

    insights.forEach(insight => {
        if (insight.merchants.length > 1 && insight.cheapestMerchant && insight.savingsPercentage && insight.savingsPercentage > 5) {
            recommendations.push({
                id: `rec-centralize-${insight.normalizedGroup}`,
                title: `Centraliza las compras de ${insight.normalizedGroup}`,
                description: `Compraste ${insight.normalizedGroup} en ${insight.merchants.length} lugares distintos. El más barato fue ${insight.cheapestMerchant}. Si centralizas allí, podrías reducir hasta un ${Math.round(insight.savingsPercentage)}% este gasto.`
            });
        }

        if (insight.purchaseCount > 5) {
            recommendations.push({
                id: `rec-budget-${insight.normalizedGroup}`,
                title: `Presupuesta mensualmente: ${insight.normalizedGroup}`,
                description: `Este mes realizaste ${insight.purchaseCount} transacciones de ${insight.normalizedGroup}. Es muy recurrente, conviene fijarle un límite o presupuesto mensual.`
            });
        }
    });

    return recommendations.slice(0, 5); // Return top 5 recommendations
};
