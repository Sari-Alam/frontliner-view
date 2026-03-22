"use client"

import { usePathname } from "next/navigation"

import {
  LayoutDashboardIcon,
  ListPlusIcon,
  UserCheckIcon,
  UsersIcon,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuGroup,
  SidebarMenuGroupContent,
  SidebarMenuHeader,
  SidebarMenuItem,
} from "./sidebar-primitives"

export default function AppSidebar() {
  const pathname = usePathname()

  const menuGroups = [
    {
      headerTitle: "MENU",
      menuHeaderInit: "open",
      menus: [
        {
          title: "Dashboard",
          url: "/app/dashboard",
          icon: <LayoutDashboardIcon className="w-4 shrink-0" />,
        },
        {
          title: "Absensi",
          url: "/app/absensi",
          icon: <UserCheckIcon className="w-4 shrink-0" />,
        },
        {
          title: "Enrollment",
          url: "/app/enrollment",
          icon: <ListPlusIcon className="w-4 shrink-0" />,
        },
        {
          title: "Data Pegawai",
          url: "/app/data-pegawai",
          icon: <UsersIcon className="w-4 shrink-0" />,
        },
      ],
    },
  ]

  const getSidebarItemActiveStatus = (pathname: string, itemUrl: string) => {
    const regex = /^(\/app\/[^\/]+)\/.*$/

    // This replaces the entire string with just the content of the first capturing group
    const parentRoute = pathname.replace(regex, "$1")
    return parentRoute === itemUrl
  }

  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        {menuGroups.map((mng) => (
          <SidebarMenuGroup key={mng.headerTitle}>
            <SidebarMenuHeader
              title={mng.headerTitle}
              initialState={mng.menuHeaderInit as any}
            />

            <SidebarMenuGroupContent menuId={mng.headerTitle}>
              {mng.menus.map((menu) => (
                <SidebarMenuItem
                  url={menu.url}
                  key={menu.title}
                  active={getSidebarItemActiveStatus(pathname, menu.url)}
                >
                  {menu.icon}
                  <span>{menu.title}</span>
                </SidebarMenuItem>
              ))}
            </SidebarMenuGroupContent>
          </SidebarMenuGroup>
        ))}
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}
