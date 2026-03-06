import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { SmartAlert } from "@/lib/expense-analysis/generate-alerts"
import { AlertCircle, Info, ShieldAlert, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const getAlertIcon = (type: SmartAlert['type']) => {
    switch (type) {
        case 'warning': return <ShieldAlert className="h-4 w-4" />
        case 'info': return <Info className="h-4 w-4" />
        case 'success': return <CheckCircle2 className="h-4 w-4" />
        default: return <AlertCircle className="h-4 w-4" />
    }
}

const getAlertVariant = (type: SmartAlert['type']) => {
    switch (type) {
        case 'warning': return 'destructive'
        case 'success': return 'default'
        default: return 'default'
    }
}

const getAlertClass = (type: SmartAlert['type']) => {
    switch (type) {
        case 'warning': return 'bg-amber-500/10 text-amber-500 border-amber-500/30'
        case 'success': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
        default: return 'bg-blue-500/10 text-blue-500 border-blue-500/30'
    }
}

export const SmartAlertsPanel = ({ alerts }: { alerts: SmartAlert[] }) => {
    return (
        <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="font-outfit text-xl">Alertas Inteligentes</CardTitle>
                <CardDescription>Avisos automáticos sobre tus hábitos de consumo y precios anómalos.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {alerts.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">Todo parece normal por aquí. Sin alertas vigentes.</p>
                    ) : (
                        alerts.map(alert => (
                            <Alert key={alert.id} className={getAlertClass(alert.type)}>
                                {getAlertIcon(alert.type)}
                                <AlertTitle className="capitalize font-bold text-sm leading-tight ml-2">
                                    {alert.groupName.replace(/_/g, " ")}
                                </AlertTitle>
                                <AlertDescription className="text-xs mt-1 ml-2 opacity-90 leading-relaxed">
                                    {alert.message}
                                </AlertDescription>
                            </Alert>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
