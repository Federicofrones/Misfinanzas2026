"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, CreditCard, Users, ArrowRight } from "lucide-react"
import { useState } from "react"
import { createWorkspace } from "@/actions/workspace"
import { auth } from "@/lib/firebase/client"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function OnboardingPage() {
    const [step, setStep] = useState(1)
    const [wsName, setWsName] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleCreate = async () => {
        const user = auth.currentUser
        if (!user) return toast.error("Debes estar autenticado")

        setLoading(true)
        const res = await createWorkspace({
            userId: user.uid,
            userEmail: user.email!,
            displayName: user.displayName || 'Usuario',
            name: wsName,
            currency: "UYU",
            monthStartDay: 1
        })

        if (res.success) {
            toast.success("¡Espacio creado con éxito!")
            router.push("/app/dashboard")
        } else {
            toast.error("Error: " + res.error)
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-6">
            <div className="w-full max-w-2xl">
                <div className="flex justify-center mb-8 gap-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className={`w-12 h-1.5 rounded-full transition-colors ${step >= i ? 'bg-primary' : 'bg-secondary'}`} />
                    ))}
                </div>

                {step === 1 && (
                    <Card className="border-primary/10 bg-card/50 backdrop-blur-xl shadow-2xl">
                        <CardHeader className="text-center">
                            <CardTitle className="text-3xl font-outfit">¡Bienvenidos a DuoBudget! 🥂</CardTitle>
                            <CardDescription>Para empezar, vamos a configurar su espacio compartido.</CardDescription>
                        </CardHeader>
                        <CardContent className="py-10 flex flex-col items-center gap-6">
                            <div className="bg-primary/10 p-6 rounded-3xl">
                                <Briefcase className="w-12 h-12 text-primary" />
                            </div>
                            <div className="w-full space-y-2">
                                <Label htmlFor="wsName">Nombre del Espacio (ej: Los Martínez, Casa Nuestra)</Label>
                                <Input
                                    id="wsName"
                                    placeholder="Escribe el nombre aquí..."
                                    className="h-12 text-lg"
                                    value={wsName}
                                    onChange={(e) => setWsName(e.target.value)}
                                />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button
                                className="w-full h-12 text-lg font-outfit gap-2"
                                disabled={!wsName || loading}
                                onClick={handleCreate}
                            >
                                {loading ? "Creando..." : "Crear Espacio"}
                                {!loading && <ArrowRight className="w-5 h-5" />}
                            </Button>
                        </CardFooter>
                    </Card>
                )}
            </div>
        </div>
    )
}
