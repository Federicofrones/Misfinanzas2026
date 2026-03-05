"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { auth, db } from "@/lib/firebase/client"
import { doc, getDoc } from "firebase/firestore"
import { acceptInvite } from "@/actions/workspace"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, CheckCircle2 } from "lucide-react"

export default function InvitePage() {
    const { token } = useParams()
    const [invite, setInvite] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [accepting, setAccepting] = useState(false)
    const router = useRouter()

    useEffect(() => {
        async function fetchInvite() {
            if (!token) return
            try {
                const docRef = doc(db, "invites", token as string)
                const docSnap = await getDoc(docRef)
                if (docSnap.exists()) {
                    setInvite(docSnap.data())
                } else {
                    toast.error("Invitación no encontrada")
                }
            } catch (e) {
                toast.error("Error al cargar invitación")
            } finally {
                setLoading(false)
            }
        }
        fetchInvite()
    }, [token])

    const handleAccept = async () => {
        const user = auth.currentUser
        if (!user) {
            toast.error("Debes iniciar sesión primero")
            router.push(`/auth/login?redirect=/invites/${token}`)
            return
        }

        setAccepting(true)
        const res = await acceptInvite(
            token as string,
            user.uid,
            user.email!,
            user.displayName || 'Pareja'
        )

        if (res.success) {
            toast.success("¡Invitación aceptada!")
            router.push("/app/dashboard")
        } else {
            toast.error(res.error)
            setAccepting(false)
        }
    }

    if (loading) return <div className="min-h-screen flex items-center justify-center">Cargando...</div>

    if (!invite) return <div className="min-h-screen flex items-center justify-center text-destructive">Invitación no válida.</div>

    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <Card className="max-w-md w-full border-primary/20 shadow-xl overflow-hidden">
                <div className="h-2 bg-primary" />
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-6">
                        <div className="bg-primary/10 p-4 rounded-full">
                            <Users className="w-10 h-10 text-primary" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-outfit">Has sido invitado</CardTitle>
                    <CardDescription>
                        Te han invitado a unirte al espacio de presupuesto compartido.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="bg-secondary/50 p-4 rounded-xl text-center">
                        <p className="text-sm text-muted-foreground">Te unirás como</p>
                        <p className="text-lg font-bold text-primary">{invite.role}</p>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button
                        className="w-full h-12 font-semibold gap-2"
                        onClick={handleAccept}
                        disabled={accepting}
                    >
                        {accepting ? "Aceptando..." : "Aceptar Invitación"}
                        <CheckCircle2 className="w-5 h-5" />
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
