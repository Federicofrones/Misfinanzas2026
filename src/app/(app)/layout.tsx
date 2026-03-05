import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { TransactionDialog } from "@/components/transaction-dialog"
import Image from "next/image"

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="bg-background/50 backdrop-blur-sm">
                <header className="flex h-16 shrink-0 items-center justify-between gap-2 px-4 border-b border-border/40 sticky top-0 bg-background/80 backdrop-blur-md z-10">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="-ml-1 w-8 h-8 rounded-lg overflow-hidden p-0 relative">
                            <Image src="/logo.png" alt="Mis finanzas Logo" fill className="object-cover" />
                        </SidebarTrigger>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* El workspaceId debería venir del contexto del usuario/app */}
                        <TransactionDialog workspaceId="default-workspace" />
                    </div>
                </header>
                <main className="flex-1 p-4 sm:p-6 overflow-y-auto overflow-x-hidden">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}
