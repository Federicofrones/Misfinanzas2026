import { GroupInsight } from "./compute-group-insights";

export interface SmartAlert {
    id: string;
    type: 'warning' | 'info' | 'success';
    message: string;
    groupName: string;
    priority: number;
}

export const generateAlerts = (insights: GroupInsight[]): SmartAlert[] => {
    const alerts: SmartAlert[] = [];

    insights.forEach(insight => {
        // High price dispersion > 15%
        if (insight.priceDispersionPercentage && insight.priceDispersionPercentage > 15 && insight.merchants.length > 1) {
            alerts.push({
                id: `dispersion-${insight.normalizedGroup}`,
                type: 'warning',
                groupName: insight.normalizedGroup,
                message: `Diferencia de precio del ${Math.round(insight.priceDispersionPercentage)}% detectada en ${insight.normalizedGroup}.`,
                priority: 3
            });
        }

        // Dispersion of merchants (>=3 merchants for same group)
        if (insight.merchants.length >= 3) {
            alerts.push({
                id: `multi-merchant-${insight.normalizedGroup}`,
                type: 'info',
                groupName: insight.normalizedGroup,
                message: `Compraste ${insight.normalizedGroup} en ${insight.merchants.length} lugares distintos. Considera unificarlos para ahorrar.`,
                priority: 2
            });
        }

        // Possible high savings potential
        if (insight.savingsPotential && insight.savingsPotential > 100) {
            alerts.push({
                id: `high-savings-${insight.normalizedGroup}`,
                type: 'success',
                groupName: insight.normalizedGroup,
                message: `Puedes ahorrar $${Math.round(insight.savingsPotential)} si compras ${insight.normalizedGroup} en ${insight.cheapestMerchant}.`,
                priority: 1
            });
        }

        // High frequency purchase (budget suggestion)
        if (insight.purchaseCount >= 4) {
            alerts.push({
                id: `freq-${insight.normalizedGroup}`,
                type: 'info',
                groupName: insight.normalizedGroup,
                message: `Compraste ${insight.normalizedGroup} ${insight.purchaseCount} veces. Quizás te convenga presupuestarlo.`,
                priority: 4
            });
        }
    });

    return alerts.sort((a, b) => a.priority - b.priority);
};
