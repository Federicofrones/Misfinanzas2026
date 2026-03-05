"use client"

import * as React from "react"
import {
    Users,
    Settings,
    ShieldCheck,
    Mail,
    Copy,
    Trash2,
    LogOut
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

const mockMembers = [
    { id: "1", name: "Federico", email: "ficofrones@gmail.com", role: "ADMIN", status: "ACTIVO" },
    { id: "2", name: "Meli", email: "meliefb7@gmail.com", role: "EDITOR", status: "ACTIVO" },
];

export default function SettingsPage() {
    const inviteLink = "https://duobudget.app/invites/abc-123-token";

    const copyToClipboard = () => {
        navigator.clipboard.writeText(inviteLink);
        toast.success("Enlace de invitación copiado");
    };

    return (
        <div className="space-y-6 pb-12">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold font-outfit">Configuración</h1>
                <p className="text-sm sm:text-base text-muted-foreground">Gestiona vuestros miembros y preferencias de la cuenta.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2 space-y-6">
                    <Card className="border-border/40 bg-card/50 backdrop-blur-sm shadow-xl">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-2 font-outfit text-lg sm:text-xl">
                                <Users className="w-5 h-5 text-primary" />
                                Miembros del Espacio
                            </CardTitle>
                            <CardDescription className="text-xs sm:text-sm">Personas que tienen acceso a este DuoBudget.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3 sm:space-y-4">
                                {mockMembers.map((member) => (
                                    <div key={member.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 rounded-lg bg-background/40 border border-border/20 group hover:border-primary/30 transition-all gap-3 sm:gap-0">
                                        <div className="flex items-center gap-3 sm:gap-4">
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
                                                {member.name.charAt(0)}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="font-semibold text-sm sm:text-base truncate">{member.name}</span>
                                                    <Badge variant="secondary" className="text-[9px] sm:text-[10px] h-4 bg-primary/5 text-primary border-primary/20 shrink-0">
                                                        {member.role}
                                                    </Badge>
                                                </div>
                                                <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{member.email}</p>
                                            </div>
                                        </div>
                                        {member.role !== "ADMIN" && (
                                            <Button variant="ghost" size="sm" className="w-full sm:w-auto mt-2 sm:mt-0 opacity-100 sm:opacity-0 group-hover:opacity-100 text-destructive hover:bg-destructive/10">
                                                <Trash2 className="w-4 h-4 sm:mr-2" />
                                                <span className="sm:hidden">Eliminar miembro</span>
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden shadow-xl">
                        <div className="h-1 bg-gradient-to-r from-primary/50 to-primary" />
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-2 font-outfit text-lg sm:text-xl">
                                <Mail className="w-5 h-5 text-primary" />
                                Invitar a tu pareja
                            </CardTitle>
                            <CardDescription className="text-xs sm:text-sm">Envía este enlace para que se una a vuestro espacio compartido.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-col sm:flex-row gap-2">
                                <Input value={inviteLink} readOnly className="bg-background/80 border-border/40 font-mono text-xs w-full" />
                                <Button variant="outline" className="w-full sm:w-auto shrink-0 gap-2" onClick={copyToClipboard}>
                                    <Copy className="w-4 h-4" />
                                    <span className="sm:hidden">Copiar Enlace</span>
                                </Button>
                            </div>
                            <p className="text-[10px] text-muted-foreground italic">
                                Nota: Este enlace caducará en 7 días por motivos de seguridad.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="border-border/40 bg-card/50 backdrop-blur-sm shadow-xl">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-muted-foreground">Tu Cuenta</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Button variant="ghost" className="w-full justify-start gap-3 hover:bg-primary/5 text-sm sm:text-base">
                                <Settings className="w-4 h-4" />
                                Preferencias
                            </Button>
                            <Button variant="ghost" className="w-full justify-start gap-3 hover:bg-primary/5 text-sm sm:text-base">
                                <ShieldCheck className="w-4 h-4" />
                                Seguridad
                            </Button>
                            <div className="pt-4 mt-4 border-t border-border/20">
                                <Button variant="ghost" className="w-full justify-start gap-3 text-destructive hover:bg-destructive/5 hover:text-destructive text-sm sm:text-base">
                                    <LogOut className="w-4 h-4" />
                                    Cerrar Sesión
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
