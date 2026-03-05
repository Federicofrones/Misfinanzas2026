"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
    TrendingUp,
    TrendingDown,
    Wallet,
    Zap,
    ArrowUpRight,
    ArrowDownRight,
    MoreHorizontal
} from "lucide-react"
import {
    Bar,
    BarChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip,
    Line,
    LineChart,
    CartesianGrid,
    Cell,
    Pie,
    PieChart
} from "recharts"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth/guards"

const data = [
    { name: "Lun", ingresos: 0, gastos: 0 },
    { name: "Mar", ingresos: 0, gastos: 0 },
    { name: "Mie", ingresos: 0, gastos: 0 },
    { name: "Jue", ingresos: 0, gastos: 0 },
    { name: "Vie", ingresos: 0, gastos: 0 },
    { name: "Sab", ingresos: 0, gastos: 0 },
    { name: "Dom", ingresos: 0, gastos: 0 },
]

const categoryData: any[] = []

export default function DashboardPage() {
    const { user } = useAuth();

    let greeting = "¡Hola, Pareja! 👋";
    if (user?.email === "meliefb7@gmail.com") {
        greeting = "Bienvenida Meli 👋";
    } else if (user?.email === "ficofrones@gmail.com") {
        greeting = "¿Qué andas Fico? 👋";
    }

    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-3xl font-outfit font-bold">{greeting}</h1>
                <p className="text-muted-foreground">Aquí está el resumen de su economía compartida este mes.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Ingresos del Mes"
                    value="$ 0"
                    change="0%"
                    trend="up"
                    icon={TrendingUp}
                    color="text-primary"
                />
                <StatsCard
                    title="Gastos del Mes"
                    value="$ 0"
                    change="0%"
                    trend="down"
                    icon={TrendingDown}
                    color="text-destructive"
                />
                <StatsCard
                    title="Balance Neto"
                    value="$ 0"
                    icon={Wallet}
                />
                <StatsCard
                    title="Burn Rate (Proy.)"
                    value="$ 0"
                    icon={Zap}
                    description="Gasto total proyectado"
                />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <Card className="lg:col-span-4 border-primary/10 bg-card/30 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="font-outfit">Flujo de Caja</CardTitle>
                        <CardDescription>Ingresos vs Gastos por día este mes</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(1 0 0 / 10%)" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'currentColor', opacity: 0.5, fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'currentColor', opacity: 0.5, fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'oklch(0.141 0.038 273.308)', border: '1px solid oklch(1 0 0 / 10%)', borderRadius: '12px' }}
                                />
                                <Line type="monotone" dataKey="ingresos" stroke="var(--primary)" strokeWidth={3} dot={false} />
                                <Line type="monotone" dataKey="gastos" stroke="oklch(0.627 0.265 303.9)" strokeWidth={3} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-3 border-primary/10 bg-card/30 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="font-outfit">¿Quién le debe a quién?</CardTitle>
                        <CardDescription>Resumen de conciliación actual</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center h-[300px] gap-4">
                        <div className="relative w-40 h-40">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={[{ value: 50 }, { value: 50 }]}
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        <Cell fill="var(--primary)" />
                                        <Cell fill="oklch(0.196 0.034 268.04)" />
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-2xl font-bold font-outfit">$ 0</span>
                                <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Saldo</span>
                            </div>
                        </div>
                        <div className="text-center">
                            <p className="text-sm text-muted-foreground">¡Todo en orden!</p>
                            <Badge variant="outline" className="mt-2 border-primary/30 text-muted-foreground">SIN DEUDAS</Badge>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-primary/10 bg-card/30 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="font-outfit">Gastos por Categoría</CardTitle>
                            <CardDescription>Top gastos de este periodo</CardDescription>
                        </div>
                        <Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {categoryData.length === 0 ? (
                                <p className="text-sm text-muted-foreground">Aún no hay gastos registrados.</p>
                            ) : categoryData.map((cat) => (
                                <div key={cat.name} className="flex items-center gap-4">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                                    <div className="flex-1">
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>{cat.name}</span>
                                            <span className="font-medium">${cat.value}</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                                            <div className="h-full bg-primary" style={{ width: `${(cat.value / 2500) * 100}%`, backgroundColor: cat.color }} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-primary/10 bg-card/30 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="font-outfit">Alertas Inteligentes</CardTitle>
                        <CardDescription>Lo que necesita su atención</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">No hay alertas activas por el momento.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

function StatsCard({ title, value, change, trend, icon: Icon, color, description }: any) {
    return (
        <Card className="border-primary/10 bg-card/30 backdrop-blur-sm overflow-hidden group hover:border-primary/30 transition-colors">
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</span>
                    <div className={`p-2 rounded-lg bg-secondary/50 group-hover:bg-primary/10 transition-colors`}>
                        <Icon className={`w-4 h-4 ${color || 'text-muted-foreground'}`} />
                    </div>
                </div>
                <div className="flex items-baseline gap-2">
                    <h2 className="text-2xl font-bold font-outfit">{value}</h2>
                    {change && (
                        <span className={`text-[10px] flex items-center gap-0.5 font-bold ${trend === 'up' ? 'text-destructive' : 'text-primary'}`}>
                            {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                            {change}
                        </span>
                    )}
                </div>
                {description && <p className="text-[10px] text-muted-foreground mt-1">{description}</p>}
            </CardContent>
            <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
        </Card>
    )
}
