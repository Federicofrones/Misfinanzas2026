"use client"

import * as React from "react"
import {
    TrendingUp,
    Calendar,
    Download,
    Share2
} from "lucide-react"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    AreaChart,
    Area,
    PieChart as RePieChart,
    Cell,
    Pie
} from 'recharts';

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const dataMensual = [
    { name: 'Ene', Federico: 4000, Meli: 2400 },
    { name: 'Feb', Federico: 3000, Meli: 1398 },
    { name: 'Mar', Federico: 2000, Meli: 9800 },
    { name: 'Abr', Federico: 2780, Meli: 3908 },
    { name: 'May', Federico: 1890, Meli: 4800 },
    { name: 'Jun', Federico: 2390, Meli: 3800 },
];

const categoryData = [
    { name: 'Casa', value: 3500, color: '#10b981' },
    { name: 'Comida', value: 2400, color: '#3b82f6' },
    { name: 'Ocio', value: 1800, color: '#f59e0b' },
    { name: 'Salud', value: 1200, color: '#ef4444' },
];

export default function ReportsPage() {
    return (
        <div className="space-y-6 pb-12 text-foreground">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-outfit">Reportes e Insights</h1>
                    <p className="text-muted-foreground">Vuestra salud financiera de un vistazo.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="gap-2 border-border/40">
                        <Download className="w-4 h-4" />
                        Exportar PDF
                    </Button>
                    <Button className="gap-2">
                        <Share2 className="w-4 h-4" />
                        Compartir
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList className="bg-muted/50 border border-border/40">
                    <TabsTrigger value="overview">General</TabsTrigger>
                    <TabsTrigger value="categories">Por Categoría</TabsTrigger>
                    <TabsTrigger value="split">Reparto Personal</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <Card className="col-span-4 border-border/40 bg-card/50 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="font-outfit text-xl">Gastos Combinados (Ult. 6 meses)</CardTitle>
                                <CardDescription>Visualización de la evolución del gasto total de la pareja.</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[350px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={dataMensual}>
                                        <defs>
                                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                                            itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                                        />
                                        <Area type="monotone" dataKey="Federico" stackId="1" stroke="#10b981" fillOpacity={1} fill="url(#colorValue)" strokeWidth={2} />
                                        <Area type="monotone" dataKey="Meli" stackId="1" stroke="#3b82f6" fillOpacity={1} fill="#3b82f633" strokeWidth={2} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card className="col-span-3 border-border/40 bg-card/50 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="font-outfit text-xl">Distribución de Gastos</CardTitle>
                                <CardDescription>¿A dónde se va vuestro dinero este mes?</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[350px] flex flex-col items-center justify-center">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RePieChart>
                                        <Pie
                                            data={categoryData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={100}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {categoryData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                                        />
                                    </RePieChart>
                                </ResponsiveContainer>
                                <div className="grid grid-cols-2 gap-4 w-full px-4 text-xs">
                                    {categoryData.map((cat) => (
                                        <div key={cat.name} className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                                            <span className="text-muted-foreground">{cat.name}</span>
                                            <span className="ml-auto font-bold">${cat.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
