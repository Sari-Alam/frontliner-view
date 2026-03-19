"use client";

import { UserIcon, UserCheckIcon, Clock10Icon, LogOutIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { Separator } from "./separator";
import { Avatar, AvatarImage, AvatarFallback } from "./avatar";
// import { useUserStore } from "@/stores/use-user-store";

const NAVIGATIONS = [
  { name: "Bawahan", slug: "bawahan", icon: UserIcon },
  { name: "Pengajuan Cuti", slug: "cuti", icon: UserCheckIcon },
  { name: "Pengajuan Lembur", slug: "lembur", icon: Clock10Icon },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar(); // Used to auto-close on mobile after clicking

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="p-4 px-6 mt-4 mb-2">
        <div className="flex items-center gap-3 w-max">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground">
            <img src="/assets/images/logo.png" alt="Logo" className="w-6 h-8" />
          </div>

          <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
            <span className="font-semibold text-teal-700">SARI ALAM</span>
            <span className="text-xs text-muted-foreground">Management System</span>
          </div>
        </div>
      </SidebarHeader>

      <Separator />

      <SidebarContent className="px-6 mt-4">
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {NAVIGATIONS.map((nav) => {
                const fullHref = `/app/${nav.slug}`;
                const isActive = pathname.startsWith(fullHref);

                return (
                  <SidebarMenuItem key={nav.slug}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={nav.name}
                      className="px-3 h-10"
                    >
                      <Link 
                        href={fullHref} 
                        onClick={() => setOpenMobile(false)} // Auto-close drawer on mobile
                      >
                        <nav.icon className="size-4" />
                        <span>{nav.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-6 pb-4 mb-8">
        {/* <CurrentUserCard /> */}
      </SidebarFooter>
    </Sidebar>
  );
}

// function CurrentUserCard() {
//     const currentUser = useUserStore(state => state.user);
  
//     return (
//         <div className="flex items-center gap-3 w-full bg-teal-200 dark:bg-teal-100/10 border border-teal-300 dark:border-teal-200/20 rounded-lg p-2">
//             <div className="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground">
//                 <Avatar>
//                     <AvatarImage src="https://github.com/shadcn.png" alt="Logo" />
//                     <AvatarFallback>SA</AvatarFallback>
//                 </Avatar>
//             </div>

//             <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
//                 <span className="font-semibold text-foreground">{currentUser?.name}</span>
//                 <span className="text-xs text-muted-foreground dark:text-foreground/60">{currentUser?.position}</span>
//             </div>
//         </div>
//     );
// }