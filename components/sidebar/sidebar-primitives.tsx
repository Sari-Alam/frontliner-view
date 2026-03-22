import React, { createContext, useContext, useEffect, useState } from "react"

import { ChevronLeftIcon, LogOutIcon, SidebarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { cva } from "class-variance-authority"

import Link from "next/link"
import Image from "next/image"

import { Avatar, AvatarFallback } from "../ui/avatar"
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { ScrollArea } from "../ui/scroll-area"

interface SidebarContextProps {
  isOpen: boolean
  toggle: () => void
}

interface SidebarContentContextProps {
  expandedMenus: string[]
  toggle: (id: string) => void
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined)

const SidebarContentContext = createContext<
  SidebarContentContextProps | undefined
>(undefined)

export function useSidebarContext() {
  const context = useContext(SidebarContext)

  if (!context) {
    throw new Error("Sidebar components must be wrapped in <Sidebar />")
  }

  return context
}

function useSidebarContentContext() {
  const context = useContext(SidebarContentContext)

  if (!context) {
    throw new Error(
      "SidebarMenuGroup components must be wrappen in <SidebarContent />"
    )
  }

  return context
}

interface SidebarProps {
  children: React.ReactNode
}

export function Sidebar({
  children,
  className,
}: SidebarProps & React.ComponentProps<"aside">) {
  const [isOpen, setIsOpen] = useState(true)

  const toggle = () => setIsOpen(!isOpen)

  return (
    <SidebarContext.Provider value={{ isOpen, toggle }}>
      <aside
        className={cn(
          "animate-all grid h-[calc(100dvh-16px)] grid-rows-[max-content_1fr_max-content] rounded-2xl border border-border bg-card transition-all duration-300 ease-in-out",
          className,
          isOpen ? "w-[16em]" : "w-22"
        )}
      >
        {children}
      </aside>
    </SidebarContext.Provider>
  )
}

interface SidebarContentProps {
  children: React.ReactNode
}

export function SidebarContent({
  children,
  className,
}: SidebarContentProps & React.ComponentProps<"section">) {
  const { isOpen } = useSidebarContext()
  const [expandedMenus, setExpandedMenus] = useState<string[]>([])

  const toggle = (id: string) => {
    if (expandedMenus.includes(id)) {
      setExpandedMenus((prevState) => prevState.filter((x) => x !== id))
    } else setExpandedMenus((prevState) => [id, ...prevState])
  }

  return (
    <SidebarContentContext.Provider value={{ expandedMenus, toggle }}>
      <section
        className={cn(
          "relative flex h-full min-h-0 flex-col overflow-hidden",
          className
        )}
      >
        <ScrollArea
          className={
            isOpen
              ? "h-[calc(100dvh-16px-2px-64px-143px)]"
              : "h-[calc(100dvh-16px-2px-64px-86px)]"
          }
        >
          <div className="flex flex-col gap-4 p-6 pt-4">{children}</div>
        </ScrollArea>

        <div className="pointer-events-none absolute bottom-0 z-20 h-16 w-full flex-none bg-linear-to-t from-card to-transparent"></div>
      </section>
    </SidebarContentContext.Provider>
  )
}

export function SidebarHeader() {
  const { toggle, isOpen } = useSidebarContext()

  return (
    <header
      className={cn(
        "flex items-center justify-between p-6 pb-4",
        isOpen ? "jutify-between" : "justify-center"
      )}
    >
      <div
        className={cn(
          "relative items-center gap-2",
          isOpen ? "flex" : "hidden"
        )}
      >
        <Image
          src={"/assets/images/sari-alam-logo.png"}
          alt=""
          width={22}
          height={30}
          className="absolute -top-1 left-0"
        />

        <p className="ml-8 text-base font-semibold text-nowrap text-teal-700">
          SARI ALAM
        </p>
      </div>

      <button
        onClick={toggle}
        className="cursor-pointer text-muted-foreground transition-opacity hover:opacity-75"
      >
        <SidebarIcon className="w-4" />
      </button>
    </header>
  )
}

export function SidebarFooter() {
  const { isOpen } = useSidebarContext()

  return (
    <footer className="flex-1 overflow-hidden p-6">
      <div
        className={cn(
          "flex flex-col items-center overflow-hidden rounded-lg border border-transparent bg-card",
          isOpen ? "border-border bg-card" : "border-card bg-card"
        )}
      >
        <div
          className={cn(
            "flex w-full gap-3 overflow-hidden",
            isOpen ? "px-4 py-2" : "p-0"
          )}
        >
          <Avatar className="flex-none">
            <AvatarFallback>AJ</AvatarFallback>
          </Avatar>

          <div className="overflow-hidden">
            <p className="truncate text-sm font-medium text-card-foreground">
              Adela Jergova
            </p>
            <span className="block truncate text-xs text-muted-foreground">
              Human Resource and General Affair
            </span>
          </div>
        </div>

        <Link
          href={"/login"}
          className={cn(
            "w-full items-center gap-2 border-t border-border bg-muted px-4 py-2 text-sm text-red-600 dark:text-red-400",
            isOpen ? "flex" : "hidden"
          )}
        >
          <LogOutIcon className="w-4" /> Log out
        </Link>
      </div>
    </footer>
  )
}

interface SidebarMenuGroupProps {
  children: React.ReactNode
}

export function SidebarMenuGroup({
  children,
  className,
}: SidebarMenuGroupProps & React.ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-2", className)}>{children}</div>
}

interface SidebarMenuHeaderProps {
  title: string
  initialState?: "open" | "close"
}

export function SidebarMenuHeader({
  className,
  title,
  initialState,
  ...rest
}: SidebarMenuHeaderProps & React.ComponentProps<"button">) {
  const { expandedMenus, toggle } = useSidebarContentContext()
  const { isOpen } = useSidebarContext()

  const menuId = title.trim().toLowerCase()
  const isExpanded = expandedMenus.includes(menuId)

  useEffect(() => {
    const shouldOpenOnRender = initialState === "open"
    if (shouldOpenOnRender && !isExpanded) toggle(menuId)
  }, [])

  return (
    <button
      className={cn(
        "flex cursor-pointer items-center justify-between text-xs text-muted-foreground opacity-75 transition-all hover:opacity-80",
        className,
        isOpen ? "justify-between" : "justify-center"
      )}
      {...rest}
      onClick={() => toggle(menuId)}
    >
      {isOpen && (
        <span className={cn("", isOpen ? "opacity-100" : "opacity-0")}>
          {title}
        </span>
      )}

      <ChevronLeftIcon
        className={cn(
          "w-4 transition-transform",
          isExpanded ? "-rotate-90" : "rotate-0"
        )}
      />
    </button>
  )
}

interface SidebarMenuGroupContentProps {
  children: React.ReactNode
  menuId: string
}

export function SidebarMenuGroupContent({
  children,
  className,
  menuId,
}: SidebarMenuGroupContentProps & React.ComponentProps<"div">) {
  const { expandedMenus } = useSidebarContentContext()
  const isExpanded = expandedMenus.includes(menuId.trim().toLowerCase())

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden",
        className,
        isExpanded ? "h-max" : "h-0"
      )}
    >
      <div className="flex flex-col">{children}</div>
    </div>
  )
}

interface SidebarMenuItemProps {
  iconPosition?: "left" | "right" | "none"
  active?: boolean
  children: React.ReactNode[]
  url: string
}

const sidebarMenuItemVariants = cva(
  "flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm whitespace-nowrap transition-all",
  {
    variants: {
      status: {
        default: "bg-card text-muted-foreground hover:bg-muted",
        active: "bg-teal-600 text-white hover:bg-teal-600/90",
      },
    },
    defaultVariants: {
      status: "default",
    },
  }
)

export function SidebarMenuItem({
  className,
  children,
  active,
  url,
  ...rest
}: SidebarMenuItemProps & React.ComponentProps<"a">) {
  const { isOpen } = useSidebarContext()

  const buttonStatus = active ? "active" : "default"

  return (
    <Link
      href={url}
      className={cn(
        sidebarMenuItemVariants({ status: buttonStatus, className })
      )}
      {...rest}
    >
      {children[0]}
      {isOpen ? children[1] : <></>}
    </Link>
  )
}
