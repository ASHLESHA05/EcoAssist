import type React from "react"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Toaster } from "sonner"

export const metadata = {
  title: "EcoAI - Reduce Your Carbon Footprint",
  description: "Personalized AI assistant for sustainable living",
}
import { UserProvider, useUser } from '@auth0/nextjs-auth0/client';
import SurveyPopup from "@/components/SurveyPopUP/popUp"
import NotificationPopup from "@/components/Notification/popUpNotify"
import { ToastProvider } from "@radix-ui/react-toast"
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <UserProvider>
      <body className="bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange >
          <SidebarProvider>
            <div className="flex h-screen">
              <AppSidebar />
              <main className="flex-1 overflow-auto">{children}</main>
              <ToastProvider />
            </div>
          </SidebarProvider>
          <Toaster position="top-center" richColors />
          <SurveyPopup/>
          <NotificationPopup/><Toaster position="top-center" richColors />
        </ThemeProvider>
      </body>
      </UserProvider>
    </html>
  )
}

