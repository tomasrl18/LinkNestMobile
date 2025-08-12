import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import type { Session, User } from "@supabase/supabase-js"

type Ctx = {
    user: User | null
    session: Session | null
    signIn(email: string, password: string): Promise<void>
    signUp(email: string, password: string): Promise<void>
    signOut(): Promise<void>
}
const AuthCtx = createContext<Ctx>(null as any)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<Session | null>(null)

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => setSession(data.session ?? null))
        const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
        return () => sub.subscription.unsubscribe()
    }, [])

    return (
        <AuthCtx.Provider value={{
            user: session?.user ?? null,
            session,
            async signIn(email, password) { await supabase.auth.signInWithPassword({ email, password }) },
            async signUp(email, password) { await supabase.auth.signUp({ email, password }) },
            async signOut() { await supabase.auth.signOut() }
        }}>
            {children}
        </AuthCtx.Provider>
    )
}
export const useAuth = () => useContext(AuthCtx)
