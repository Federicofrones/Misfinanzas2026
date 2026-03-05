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
        <div className="space-y-8 pb-12">
            <div>
                <h1 className="text-3xl font-bold font-outfit">Configuración</h1>
                <p className="text-muted-foreground">Gestiona vuestros miembros y preferencias de la cuenta.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2 space-y-6">
                    <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 font-outfit">
                                <Users className="w-5 h-5 text-primary" />
                                Miembros del Espacio
                            </CardTitle>
                            <CardDescription>Personas que tienen acceso a este DuoBudget.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {mockMembers.map((member) => (
                                    <div key={member.id} className="flex items-center justify-between p-4 rounded-lg bg-background/40 border border-border/20 group hover:border-primary/30 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                {member.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold">{member.name}</span>
                                                    <Badge variant="secondary" className="text-[10px] h-4 bg-primary/5 text-primary border-primary/20">
                                                        {member.role}
                                                    </Badge>
                                                </div>
                                                <p className="text-xs text-muted-foreground">{member.email}</p>
                                            </div>
                                        </div>
                                        {member.role !== "ADMIN" && (
                                            <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 text-destructive hover:bg-destructive/10">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden">
                        <div className="h-1 bg-gradient-to-r from-primary/50 to-primary" />
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 font-outfit">
                                <Mail className="w-5 h-5 text-primary" />
                                Invitar a tu pareja
                            </CardTitle>
                            <CardDescription>Envía este enlace para que se una a vuestro espacio compartido.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-2">
                                <Input value={inviteLink} readOnly className="bg-background/80 border-border/40 font-mono text-xs" />
                                <Button variant="outline" size="icon" onClick={copyToClipboard}>
                                    <Copy className="w-4 h-4" />
                                </Button>
                            </div>
                            <p className="text-[10px] text-muted-foreground italic">
                                Nota: Este enlace caducará en 7 días por motivos de seguridad.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Tu Cuenta</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Button variant="ghost" className="w-full justify-start gap-3 hover:bg-primary/5">
                                <Settings className="w-4 h-4" />
                                Preferencias
                            </Button>
                            <Button variant="ghost" className="w-full justify-start gap-3 hover:bg-primary/5">
                                <ShieldCheck className="w-4 h-4" />
                                Seguridad
                            </Button>
                            <div className="pt-4 mt-4 border-t border-border/20">
                                <Button variant="ghost" className="w-full justify-start gap-3 text-destructive hover:bg-destructive/5 hover:text-destructive">
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
