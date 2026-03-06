"use client"

import * as React from "react"
import {
    Download,
    Share2,
    CalendarIcon,
    ArrowUpRight,
    ArrowDownRight,
    Search,
    TrendingUp
} from "lucide-react"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    PieChart as RePieChart,
    Cell,
    Pie,
    Legend
} from 'recharts';
import { format, subMonths, startOfMonth, endOfMonth, subDays } from "date-fns"
import { es } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { getTransactions } from "@/actions/transactions"
import { SavingsDashboard } from "@/components/reports/savings-dashboard"

// --- Mock Data ---
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

const splitData = [
    { name: 'Federico', value: 13970, color: '#10b981' },
    { name: 'Meli', value: 24706, color: '#3b82f6' },
];

const incomeVsExpenseData = [
    { name: 'Ene', Ingresos: 8000, Gastos: 6400 },
    { name: 'Feb', Ingresos: 8000, Gastos: 4398 },
    { name: 'Mar', Ingresos: 8500, Gastos: 11800 },
    { name: 'Abr', Ingresos: 8000, Gastos: 6688 },
    { name: 'May', Ingresos: 8800, Gastos: 6690 },
    { name: 'Jun', Ingresos: 8000, Gastos: 6190 },
];

const renderCustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-card text-card-foreground border border-border/40 p-3 rounded-lg shadow-xl shadow-black/20 text-xs">
                <p className="font-bold mb-2 pb-2 border-b border-border/40">{label}</p>
                {payload.map((entry: any, index: number) => (
                    <div key={`item-${index}`} className="flex justify-between items-center gap-4 py-1">
                        <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                            <span className="text-muted-foreground">{entry.name}</span>
                        </span>
                        <span className="font-medium">${entry.value.toLocaleString()}</span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

export default function ReportsPage() {
    const [date, setDate] = React.useState<Date | undefined>(new Date())
    const [dateRange, setDateRange] = React.useState("last-6")
    const [transactions, setTransactions] = React.useState<any[]>([])

    React.useEffect(() => {
        getTransactions("default-workspace").then((res) => {
            if (res.success && res.transactions) {
                setTransactions(res.transactions);
            }
        });
    }, []);

    const handlePresetChange = (value: string) => {
        setDateRange(value);
        const today = new Date();
        if (value === "this-month") setDate(today);
        // La lógica real filtraría los datos basándose en estas fechas
    };

    return (
        <div className="space-y-6 pb-12 text-foreground">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-outfit">Reportes e Insights</h1>
                    <p className="text-muted-foreground text-sm sm:text-base">Análisis profundo de vuestra salud financiera.</p>
                </div>

                {/* Controles de Fechas Moviles / Desktop */}
                <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-0 w-full sm:w-auto">
                    <Select value={dateRange} onValueChange={handlePresetChange}>
                        <SelectTrigger className="w-full sm:w-[160px] h-9 bg-background/50 backdrop-blur-sm border-border/40 text-xs">
                            <SelectValue placeholder="Seleccionar período" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="this-month">Este mes</SelectItem>
                            <SelectItem value="last-month">Mes pasado</SelectItem>
                            <SelectItem value="last-3">Últimos 3 meses</SelectItem>
                            <SelectItem value="last-6">Últimos 6 meses</SelectItem>
                            <SelectItem value="this-year">Este año</SelectItem>
                            <SelectItem value="last-12">Últimos 12 meses</SelectItem>
                            <SelectItem value="all">Todo el tiempo</SelectItem>
                        </SelectContent>
                    </Select>

                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full sm:w-[240px] h-9 justify-start text-left font-normal border-border/40 bg-background/50 backdrop-blur-sm text-xs",
                                    !date && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                                {date ? format(date, "PPP", { locale: es }) : <span>Elegir fecha exacta</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="end">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            <Tabs defaultValue="overview" className="space-y-6">
                <div className="overflow-x-auto pb-2 scrollbar-hide -mx-6 px-6 sm:mx-0 sm:px-0">
                    <TabsList className="bg-muted/50 border border-border/40 min-w-max">
                        <TabsTrigger value="overview">Flujo General</TabsTrigger>
                        <TabsTrigger value="savings" className="text-emerald-500 font-bold data-[state=active]:bg-emerald-500/10">Ahorro Inteligente</TabsTrigger>
                        <TabsTrigger value="categories">Por Categoría</TabsTrigger>
                        <TabsTrigger value="split">Reparto Personal</TabsTrigger>
                        <TabsTrigger value="trends">Tendencias</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="overview" className="space-y-6 mt-0">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <Card className="col-span-full border-border/40 bg-card/50 backdrop-blur-sm">
                            <CardHeader className="flex flex-row flex-wrap items-center justify-between pb-2">
                                <div>
                                    <CardTitle className="font-outfit text-xl">Balance: Ingresos vs Gastos</CardTitle>
                                    <CardDescription>Evolución de su capacidad de ahorro conjunto.</CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent className="h-[300px] sm:h-[400px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={incomeVsExpenseData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.3} />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                                        <Tooltip content={renderCustomTooltip} cursor={{ fill: 'hsl(var(--muted)/0.4)' }} />
                                        <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                                        <Bar dataKey="Ingresos" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
                                        <Bar dataKey="Gastos" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={40} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="categories" className="space-y-6 mt-0">
                    <div className="grid gap-4 lg:grid-cols-2">
                        <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="font-outfit text-xl">Distribución Principal</CardTitle>
                                <CardDescription>¿A dónde se va el dinero del periodo seleccionado?</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[350px] flex flex-col items-center justify-center">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RePieChart>
                                        <Pie
                                            data={categoryData}
                                            cx="50%"
                                            cy="45%"
                                            innerRadius={60}
                                            outerRadius={100}
                                            paddingAngle={3}
                                            dataKey="value"
                                        >
                                            {categoryData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip content={renderCustomTooltip} />
                                    </RePieChart>
                                </ResponsiveContainer>
                                <div className="grid grid-cols-2 gap-x-8 gap-y-3 w-full px-4 text-xs mt-4">
                                    {categoryData.map((cat) => (
                                        <div key={cat.name} className="flex items-center gap-2 border-b border-border/20 pb-1">
                                            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                                            <span className="text-muted-foreground truncate">{cat.name}</span>
                                            <span className="ml-auto font-bold">${cat.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="font-outfit text-xl">Top Comercios Frecuentes</CardTitle>
                                <CardDescription>Lugares donde más gastan como pareja.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    {[
                                        { name: "Supermercado Tata", amount: 4500, count: 12, percent: 100 },
                                        { name: "UTE", amount: 1200, count: 1, percent: 35 },
                                        { name: "Farmacia", amount: 800, count: 3, percent: 20 },
                                        { name: "PedidosYa", amount: 650, count: 5, percent: 15 },
                                    ].map((item, i) => (
                                        <div key={i} className="space-y-2">
                                            <div className="flex justify-between items-center text-sm">
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{item.name}</span>
                                                    <span className="text-[10px] text-muted-foreground">{item.count} transacciones</span>
                                                </div>
                                                <span className="font-bold text-destructive">${item.amount}</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-muted overflow-hidden rounded-full">
                                                <div className="h-full bg-primary" style={{ width: `${item.percent}%` }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="split" className="space-y-6 mt-0">
                    <div className="grid gap-4 lg:grid-cols-2">
                        <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="font-outfit text-xl">Gastos Compartidos Historicos</CardTitle>
                                <CardDescription>Evolución de los gastos comunes mes a mes.</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[350px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={dataMensual} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorFico" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="colorMeli" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.3} />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                                        <Tooltip content={renderCustomTooltip} />
                                        <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                                        <Area type="monotone" dataKey="Federico" stackId="1" stroke="#10b981" fillOpacity={1} fill="url(#colorFico)" strokeWidth={2} />
                                        <Area type="monotone" dataKey="Meli" stackId="1" stroke="#3b82f6" fillOpacity={1} fill="url(#colorMeli)" strokeWidth={2} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="font-outfit text-xl">Proporción Histórica</CardTitle>
                                <CardDescription>Quien ha aportado al espacio compartido en este período.</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[350px] flex flex-col items-center justify-center">
                                <ResponsiveContainer width="100%" height="80%">
                                    <RePieChart>
                                        <Pie
                                            data={splitData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={80}
                                            outerRadius={100}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {splitData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip content={renderCustomTooltip} />
                                    </RePieChart>
                                </ResponsiveContainer>
                                <div className="flex w-full justify-around items-center px-4 pt-4 border-t border-border/20">
                                    <div className="text-center">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1 justify-center">
                                            <div className="w-2 h-2 rounded-full bg-[#10b981]" /> Federico
                                        </div>
                                        <span className="text-xl font-bold font-outfit">$13.970</span>
                                    </div>
                                    <div className="w-[1px] h-10 bg-border/40"></div>
                                    <div className="text-center">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1 justify-center">
                                            <div className="w-2 h-2 rounded-full bg-[#3b82f6]" /> Meli
                                        </div>
                                        <span className="text-xl font-bold font-outfit">$24.706</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="trends" className="space-y-6 mt-0">
                    <Card className="border-border/40 bg-card/50 backdrop-blur-sm text-center p-12">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <TrendingUp className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold font-outfit mb-2">Más datos próximamente</h3>
                        <p className="text-muted-foreground text-sm max-w-md mx-auto">
                            A medida que agreguen más transacciones, la IA de Mis finanzas generará tendencias, predicciones de gasto y consejos para ahorrar más rápido.
                        </p>
                    </Card>
                </TabsContent>

                <TabsContent value="savings" className="space-y-6 mt-0">
                    <SavingsDashboard transactions={transactions} />
                </TabsContent>
            </Tabs>
        </div>
    )
}
