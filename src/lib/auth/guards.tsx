"use client"

import { auth } from "@/lib/firebase/client";
import { onAuthStateChanged, User } from "firebase/auth";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    return { user, loading };
}

export function withAuth(Component: any) {
    return function ProtectedRoute(props: any) {
        const { user, loading } = useAuth();

        if (loading) return null;
        if (!user) {
            redirect("/auth/login");
            return null;
        }

        return <Component {...props} user={user} />;
    };
}
