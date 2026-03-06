"use client"

import * as React from "react"
import { NormalizedTransaction, normalizeTransaction } from "@/lib/expense-analysis/normalize-transaction"
import { computeGroupInsights, GroupInsight } from "@/lib/expense-analysis/compute-group-insights"
import { generateAlerts, SmartAlert } from "@/lib/expense-analysis/generate-alerts"
import { generateRecommendations, Recommendation } from "@/lib/expense-analysis/generate-recommendations"

import { SavingsSummaryCards } from "./savings-summary-cards"
import { SpendingGroupsTable } from "./spending-groups-table"
import { MerchantPriceComparison } from "./merchant-price-comparison"
import { SavingsOpportunities } from "./savings-opportunities"
import { SmartAlertsPanel } from "./smart-alerts-panel"
import { RecommendationsPanel } from "./recommendations-panel"

export const SavingsDashboard = ({ transactions }: { transactions: any[] }) => {
    const [insights, setInsights] = React.useState<GroupInsight[]>([])
    const [alerts, setAlerts] = React.useState<SmartAlert[]>([])
    const [recommendations, setRecommendations] = React.useState<Recommendation[]>([])
    const [totalSavingsPotential, setTotalSavingsPotential] = React.useState(0)

    React.useEffect(() => {
        if (!transactions || transactions.length === 0) return;

        // 1. Normalize
        const normalized = transactions.map(normalizeTransaction);

        // 2. Combine and compute insights
        const computedInsights = computeGroupInsights(normalized);
        setInsights(computedInsights);

        // 3. Generate alerts
        const generatedAlerts = generateAlerts(computedInsights);
        setAlerts(generatedAlerts);

        // 4. Generate recommendations
        const generatedRecs = generateRecommendations(computedInsights);
        setRecommendations(generatedRecs);

        // 5. Total savings
        const total = computedInsights.reduce((sum, item) => sum + (item.savingsPotential || 0), 0);
        setTotalSavingsPotential(total);
    }, [transactions]);

    return (
        <div className="space-y-6">
            <SavingsSummaryCards
                insights={insights}
                totalSavingsPotential={totalSavingsPotential}
                totalAlerts={alerts.length}
            />

            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <SavingsOpportunities insights={insights} />
                    <SpendingGroupsTable insights={insights} />
                </div>
                <div className="space-y-6">
                    <SmartAlertsPanel alerts={alerts} />
                    <RecommendationsPanel recommendations={recommendations} />
                    <MerchantPriceComparison insights={insights} />
                </div>
            </div>
        </div>
    )
}
