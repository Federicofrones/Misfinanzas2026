"use client"

import * as React from "react"
import {
    LayoutDashboard,
    Receipt,
    PiggyBank,
    BarChart3,
    Scale,
    Bell,
    Settings,
    PlusCircle,
    LogOut
} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"

const items = [
    { title: "Dashboard", url: "/app/dashboard", icon: LayoutDashboard },
    { title: "Transacciones", url: "/app/transactions", icon: Receipt },
    { title: "Presupuestos", url: "/app/budgets", icon: PiggyBank },
    { title: "Reportes", url: "/app/reports", icon: BarChart3 },
    { title: "Conciliación", url: "/app/reconcile", icon: Scale },
    { title: "Alertas", url: "/app/alerts", icon: Bell },
    { title: "Configuración", url: "/app/settings", icon: Settings },
]

export function AppSidebar() {
    const pathname = usePathname()

    return (
        <Sidebar variant="floating" collapsible="icon">
            <SidebarHeader className="flex flex-row items-center gap-2 p-4">
                <div className="bg-primary/20 p-2 rounded-lg">
                    <PiggyBank className="w-6 h-6 text-primary" />
                </div>
                <span className="font-outfit font-bold text-xl tracking-tight group-data-[collapsible=icon]:hidden">
                    DuoBudget
                </span>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Principal</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={pathname === item.url}
                                        tooltip={item.title}
                                    >
                                        <Link href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton>
                            <LogOut />
                            <span>Cerrar Sesión</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}
