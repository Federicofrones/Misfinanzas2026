"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PiggyBank, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { auth } from "@/lib/firebase/client"
import { signInWithEmailAndPassword } from "firebase/auth"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            await signInWithEmailAndPassword(auth, email, password)
            toast.success("¡Bienvenido de nuevo!")
            router.push("/app/dashboard")
        } catch (error: any) {
            toast.error("Error al iniciar sesión: " + error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background p-6">
            <Card className="w-full max-w-md border-primary/10 bg-card/50 backdrop-blur-xl shadow-2xl">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 relative rounded-2xl overflow-hidden">
                            <Image src="/logo.png" alt="Mis finanzas Logo" fill className="object-cover" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-outfit font-bold tracking-tight">Mis finanzas</CardTitle>
                    <CardDescription>Inicia sesión para gestionar tu economía compartida</CardDescription>
                </CardHeader>
                <form onSubmit={handleLogin}>
                    <CardContent className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="hola@pareja.com"
                                className="bg-background/50"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Contraseña</Label>
                                <Link href="#" className="text-xs text-primary hover:underline">¿Olvidaste tu contraseña?</Link>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                className="bg-background/50"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button className="w-full h-11 font-semibold gap-2 shadow-lg shadow-primary/20" disabled={loading}>
                            {loading ? "Cargando..." : "Entrar"}
                            {!loading && <ArrowRight className="w-4 h-4" />}
                        </Button>
                        <p className="text-sm text-center text-muted-foreground">
                            ¿No tienen cuenta?{" "}
                            <Link href="/auth/register" className="text-primary font-semibold hover:underline">Registrarse</Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
