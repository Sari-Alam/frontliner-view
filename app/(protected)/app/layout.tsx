import AppBar from "@/components/app-bar/app-bar"
import AppSidebar from "@/components/sidebar/app-sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-dvh bg-slate-200 p-2 dark:bg-background">
      <main className="grid w-full grid-cols-[max-content_1fr] gap-2">
        <AppSidebar />

        <div className="flex flex-col gap-2">
          <AppBar />
          {children}
        </div>
      </main>
    </div>
  )
}
