import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Recommendation } from "@/lib/expense-analysis/generate-recommendations"
import { Lightbulb } from "lucide-react"

export const RecommendationsPanel = ({ recommendations }: { recommendations: Recommendation[] }) => {
    return (
        <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center gap-4">
                <div className="p-2 bg-amber-500/10 rounded-full">
                    <Lightbulb className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                    <CardTitle className="font-outfit text-xl">Sugerencias Clave</CardTitle>
                    <CardDescription>Pequeños cambios, gran diferencia al final del mes.</CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {recommendations.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">Sigue registrando tus gastos para obtener más sugerencias personalizadas.</p>
                    ) : (
                        recommendations.map(rec => (
                            <div key={rec.id} className="relative pl-6 before:absolute before:left-2 before:top-2 before:w-1.5 before:h-1.5 before:bg-amber-500 before:rounded-full">
                                <h4 className="font-bold text-sm mb-1">{rec.title}</h4>
                                <p className="text-xs text-muted-foreground leading-relaxed">{rec.description}</p>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
