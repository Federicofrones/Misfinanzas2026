"use client"

import * as React from "react"
import {
    Bell,
    AlertTriangle,
    Info,
    CheckCircle,
    Clock,
    Settings,
    X,
    MessageSquareText
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const mockAlerts = [
    {
        id: "1",
        type: "warning",
        title: "Presupuesto Ocio superado",
        description: "Has superado el presupuesto de Ocio / Salidas mensual en $200.",
        date: "Hace 2 horas",
        read: false,
    },
    {
        id: "2",
        type: "info",
        title: "Mes cerrado con ahorro",
        description: "¡Felicidades! Lograron ahorrar un 15% de sus ingresos el mes pasado.",
        date: "Ayer",
        read: true,
    },
    {
        id: "3",
        type: "action",
        title: "Balance mensual desequilibrado",
        description: "Fico pagó el 80% de los gastos comunes este mes. Revise la sección de Conciliación.",
        date: "Hace 3 días",
        read: true,
    },
    {
        id: "4",
        type: "success",
        title: "Transferencia liquidada",
        description: "Meli ha marcado como pagado el balance por $4,500.",
        date: "Hace 1 semana",
        read: true,
    }
];

export default function AlertsPage() {
    const [alerts, setAlerts] = React.useState(mockAlerts);
    const router = useRouter();

    const markAsRead = (id: string) => {
        setAlerts(alerts.map(a => a.id === id ? { ...a, read: true } : a));
    };

    const markAllAsRead = () => {
        if (alerts.every(a => a.read)) {
            toast.info("No hay alertas nuevas para leer");
            return;
        }
        setAlerts(alerts.map(a => ({ ...a, read: true })));
        toast.success("Todas las alertas marcadas como leídas");
    };

    const handleSettingsClick = () => {
        toast.info("Configuraciones de notificaciones próximamente.");
    };

    const getIcon = (type: string) => {
        switch (type) {
            case "warning": return <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500" />;
            case "success": return <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500" />;
            case "info": return <Info className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />;
            case "action": return <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" />;
            default: return <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />;
        }
    };

    const getBadgeColor = (type: string) => {
        switch (type) {
            case "warning": return "bg-amber-500/10 text-amber-600 border-amber-500/20";
            case "success": return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
            case "info": return "bg-blue-500/10 text-blue-600 border-blue-500/20";
            case "action": return "bg-purple-500/10 text-purple-600 border-purple-500/20";
            default: return "bg-primary/10 text-primary border-primary/20";
        }
    };

    return (
        <div className="space-y-6 pb-12">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold font-outfit">Centro de Alertas</h1>
                    <p className="text-sm sm:text-base text-muted-foreground">Notificaciones automáticas sobre sus finanzas.</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <Button variant="outline" className="gap-2 border-border/40 w-full sm:w-auto" onClick={markAllAsRead}>
                        <CheckCircle className="w-4 h-4" />
                        <span className="hidden sm:inline">Marcar todo leído</span>
                        <span className="inline sm:hidden">Leer todas</span>
                    </Button>
                    <Button variant="outline" size="icon" className="border-border/40 shrink-0" onClick={handleSettingsClick}>
                        <Settings className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <div className="grid gap-3 sm:gap-4 max-w-4xl">
                {alerts.length === 0 ? (
                    <Card className="border-border/40 bg-card/50 backdrop-blur-sm p-8 sm:p-12 text-center">
                        <div className="mx-auto w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                            <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-primary opacity-50" />
                        </div>
                        <h3 className="text-base sm:text-lg font-medium">Todo al día</h3>
                        <p className="text-muted-foreground text-xs sm:text-sm mt-1">No tienes nuevas notificaciones en este momento.</p>
                    </Card>
                ) : (
                    alerts.map((alert) => (
                        <Card
                            key={alert.id}
                            className={`border-border/40 overflow-hidden transition-all duration-300 ${!alert.read ? 'bg-primary/5 shadow-md shadow-primary/5' : 'bg-card/50 backdrop-blur-sm hover:bg-muted/40'}`}
                        >
                            <div className="flex items-start p-3 sm:p-5 gap-3 sm:gap-4 relative">
                                {!alert.read && (
                                    <div className="absolute top-1/2 -translate-y-1/2 left-0 w-1 h-3/4 sm:h-12 bg-primary rounded-r-md"></div>
                                )}

                                <div className={`flex-shrink-0 mt-0.5 sm:mt-1 p-1.5 sm:p-2 rounded-full ${getBadgeColor(alert.type).split(' ')[0]}`}>
                                    {getIcon(alert.type)}
                                </div>

                                <div className="flex-1 space-y-1.5 min-w-0">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="font-semibold text-sm sm:text-base leading-tight">{alert.title}</span>
                                            {!alert.read && (
                                                <Badge variant="default" className="h-4 text-[9px] px-1.5 uppercase bg-primary hover:bg-primary whitespace-nowrap">NUEVA</Badge>
                                            )}
                                        </div>
                                        <span className="text-[10px] sm:text-xs text-muted-foreground flex items-center gap-1 shrink-0">
                                            <Clock className="w-3 h-3 hidden sm:block" />
                                            {alert.date}
                                        </span>
                                    </div>
                                    <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed pr-6 sm:pr-0">
                                        {alert.description}
                                    </p>

                                    {alert.type === 'action' && !alert.read && (
                                        <div className="pt-2 sm:pt-3">
                                            <Button size="sm" className="h-7 sm:h-8 text-xs sm:text-sm" onClick={() => router.push('/app/conciliation')}>
                                                Revisar Conciliación
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                {!alert.read && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors absolute top-2 right-2 sm:relative sm:top-0 sm:right-0"
                                        onClick={() => markAsRead(alert.id)}
                                    >
                                        <X className="w-3 h-3 sm:w-4 sm:h-4" />
                                    </Button>
                                )}
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
