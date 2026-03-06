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
    LogOut,
    CreditCard
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
    { title: "Tarjetas", url: "/app/credit-cards", icon: CreditCard },
    { title: "Alertas", url: "/app/alerts", icon: Bell },
    { title: "Configuración", url: "/app/settings", icon: Settings },
]

import { useSidebar } from "@/components/ui/sidebar"
import { Logo } from "@/components/ui/logo"

export function AppSidebar() {
    const pathname = usePathname()
    const { setOpenMobile } = useSidebar()

    return (
        <Sidebar variant="floating" collapsible="icon">
            <SidebarHeader className="flex flex-row items-center gap-2 p-4">
                <div className="w-8 h-8 relative shrink-0">
                    <Logo />
                </div>
                <span className="font-outfit font-bold text-xl tracking-tight group-data-[collapsible=icon]:hidden">
                    Mis finanzas
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
                                        <Link href={item.url} onClick={() => setOpenMobile(false)}>
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
