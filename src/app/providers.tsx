"use client"

import { SessionProvider } from "next-auth/react"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider 
      refetchInterval={0} // Не обновлять автоматически
      refetchOnWindowFocus={true} // Обновлять при фокусе на окне
    >
      {children}
    </SessionProvider>
  )
}