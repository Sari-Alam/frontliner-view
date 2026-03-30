import { FullscreenToggle } from "../full-screen-toggler"
import { ThemeToggler } from "../theme-toggler"
import AppBarBreadcrumb from "./app-bar-breadcrumbs"

export default function AppBar() {
  return (
    <div className="flex items-center justify-between gap-2 rounded-xl border border-border bg-card p-2 pl-4">
      <AppBarBreadcrumb />

      <div className="flex items-center gap-2">
        <FullscreenToggle />
        <ThemeToggler />
      </div>
    </div>
  )
}
