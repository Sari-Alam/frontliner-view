import React, { createContext, useContext, useEffect, useState } from "react";

import { ChevronLeftIcon, LogOutIcon, SidebarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";

import Link from "next/link";
import Image from "next/image";

import { Avatar, AvatarFallback } from "../ui/avatar";

interface SidebarContextProps {
  isOpen: boolean;
  toggle: () => void;
}

interface SidebarContentContextProps {
  expandedMenus: string[];
  toggle: (id: string) => void;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined,
);

const SidebarContentContext = createContext<
  SidebarContentContextProps | undefined
>(undefined);

export function useSidebarContext() {
  const context = useContext(SidebarContext);

  if (!context) {
    throw new Error("Sidebar components must be wrapped in <Sidebar />");
  }

  return context;
}

function useSidebarContentContext() {
  const context = useContext(SidebarContentContext);

  if (!context) {
    throw new Error(
      "SidebarMenuGroup components must be wrappen in <SidebarContent />",
    );
  }

  return context;
}

interface SidebarProps {
  children: React.ReactNode;
}

export function Sidebar({
  children,
  className,
}: SidebarProps & React.ComponentProps<"aside">) {
  const [isOpen, setIsOpen] = useState(true);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <SidebarContext.Provider value={{ isOpen, toggle }}>
      <aside
        className={cn(
          "bg-white rounded-2xl border border-slate-200 h-[calc(100dvh-16px)] grid grid-rows-[max-content_1fr_max-content] animate-all",
          className,
          isOpen ? "w-[16em]" : "w-22",
        )}
      >
        {children}
      </aside>
    </SidebarContext.Provider>
  );
}

interface SidebarContentProps {
  children: React.ReactNode;
}

export function SidebarContent({
  children,
  className,
}: SidebarContentProps & React.ComponentProps<"section">) {
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  const toggle = (id: string) => {
    if (expandedMenus.includes(id)) {
      setExpandedMenus((prevState) => prevState.filter((x) => x !== id));
    } else setExpandedMenus((prevState) => [id, ...prevState]);
  };

  return (
    <SidebarContentContext.Provider value={{ expandedMenus, toggle }}>
      <section
        className={cn(
          "flex flex-col h-full min-h-0 overflow-hidden relative w-full",
          className,
        )}
      >
        <div className="flex-1 overflow-y-auto no-scrollbar">
          <div className="flex flex-col gap-4 p-6 pt-4">{children}</div>
        </div>

        <div className="flex-none bg-linear-to-t from-white to-transparent w-full h-16 z-20 absolute bottom-0 pointer-events-none"></div>
      </section>
    </SidebarContentContext.Provider>
  );
}

export function SidebarHeader() {
  const { toggle, isOpen } = useSidebarContext();

  return (
    <header
      className={cn(
        "flex justify-between items-center p-6 pb-4",
        isOpen ? "jutify-between" : "justify-center",
      )}
    >
      <div
        className={cn(
          "gap-2 items-center relative",
          isOpen ? "flex" : "hidden",
        )}
      >
        <Image
          src={"/assets/sari alam logo.png"}
          alt=""
          width={22}
          height={30}
          className="absolute -top-1 left-0"
        />

        <p className="text-base font-semibold ml-8 text-teal-700">SARI ALAM</p>
      </div>

      <button
        onClick={toggle}
        className="cursor-pointer hover:opacity-75 transition-opacity"
      >
        <SidebarIcon className="w-4" />
      </button>
    </header>
  );
}

export function SidebarFooter() {
  const { isOpen } = useSidebarContext();

  return (
    <footer className="p-6 flex-1 overflow-hidden">
      <div
        className={cn(
          "rounded-lg flex flex-col items-center overflow-hidden",
          isOpen ? "border border-slate-200" : "border-none",
        )}
      >
        <div
          className={cn(
            "overflow-hidden flex gap-3 w-full",
            isOpen ? "px-4 py-2" : "p-0",
          )}
        >
          <Avatar className="flex-none">
            <AvatarFallback>AJ</AvatarFallback>
          </Avatar>

          <div className="overflow-hidden">
            <p className="font-medium text-sm truncate text-slate-900">
              Adela Jergova
            </p>
            <span className="text-slate-400 text-xs block truncate">
              Human Resource and General Affair
            </span>
          </div>
        </div>

        <Link
          href={"/login"}
          className={cn(
            "text-sm text-red-600 px-4 py-2 bg-slate-100 items-center gap-2 w-full border-t border-slate-200",
            isOpen ? "flex" : "hidden",
          )}
        >
          <LogOutIcon className="w-4" /> Log out
        </Link>
      </div>
    </footer>
  );
}

interface SidebarMenuGroupProps {
  children: React.ReactNode;
}

export function SidebarMenuGroup({
  children,
  className,
}: SidebarMenuGroupProps & React.ComponentProps<"div">) {
  return <div className={cn("gap-2 flex flex-col", className)}>{children}</div>;
}

interface SidebarMenuHeaderProps {
  title: string;
  initialState?: "open" | "close";
}

export function SidebarMenuHeader({
  className,
  title,
  initialState,
  ...rest
}: SidebarMenuHeaderProps & React.ComponentProps<"button">) {
  const { expandedMenus, toggle } = useSidebarContentContext();
  const { isOpen } = useSidebarContext();

  const menuId = title.trim().toLowerCase();
  const isExpanded = expandedMenus.includes(menuId);

  useEffect(() => {
    const shouldOpenOnRender = initialState === "open";
    if (shouldOpenOnRender && !isExpanded) toggle(menuId);
  }, []);

  return (
    <button
      className={cn(
        "flex items-center text-xs justify-between cursor-pointer text-slate-400 hover:text-slate-600",
        className,
        isOpen ? "justify-between" : "justify-center",
      )}
      {...rest}
      onClick={() => toggle(menuId)}
    >
      {isOpen && (
        <span
          className={cn("transition-all", isOpen ? "opacity-100" : "opacity-0")}
        >
          {title}
        </span>
      )}

      <ChevronLeftIcon
        className={cn(
          "w-4 transition-transform",
          isExpanded ? "-rotate-90" : "rotate-0",
        )}
      />
    </button>
  );
}

interface SidebarMenuGroupContentProps {
  children: React.ReactNode;
  menuId: string;
}

export function SidebarMenuGroupContent({
  children,
  className,
  menuId,
}: SidebarMenuGroupContentProps & React.ComponentProps<"div">) {
  const { expandedMenus } = useSidebarContentContext();
  const isExpanded = expandedMenus.includes(menuId.trim().toLowerCase());

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden",
        className,
        isExpanded ? "h-max" : "h-0",
      )}
    >
      <div className="flex flex-col">{children}</div>
    </div>
  );
}

interface SidebarMenuItemProps {
  iconPosition?: "left" | "right" | "none";
  active?: boolean;
  children: React.ReactNode[];
  url: string;
}

const sidebarMenuItemVariants = cva(
  "px-3 py-2 flex gap-3 items-center text-sm transition-all rounded-md cursor-pointer whitespace-nowrap",
  {
    variants: {
      status: {
        default: "bg-white text-slate-400 hover:bg-slate-100",
        active: "bg-teal-600 text-white hover:bg-teal-500",
      },
    },
    defaultVariants: {
      status: "default",
    },
  },
);

export function SidebarMenuItem({
  className,
  children,
  active,
  url,
  ...rest
}: SidebarMenuItemProps & React.ComponentProps<"a">) {
  const { isOpen } = useSidebarContext();

  const buttonStatus = active ? "active" : "default";

  return (
    <Link
      href={url}
      className={cn(
        sidebarMenuItemVariants({ status: buttonStatus, className }),
      )}
      {...rest}
    >
      {children[0]}
      {isOpen ? children[1] : <></>}
    </Link>
  );
}