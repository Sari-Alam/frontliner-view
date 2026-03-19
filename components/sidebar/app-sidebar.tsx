"use client";

import { usePathname } from "next/navigation";

import {
  CalendarClockIcon,
  Clock10Icon,
  Clock3Icon,
  GitBranchPlus,
  GroupIcon,
  HardHatIcon,
  HistoryIcon,
  ListEndIcon,
  ListTodoIcon,
  TimerIcon,
  ToyBrickIcon,
  UserCheck2Icon,
  UserCheckIcon,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuGroup,
  SidebarMenuGroupContent,
  SidebarMenuHeader,
  SidebarMenuItem,
} from "./sidebar-primitives";

export default function AppSidebar() {
  const pathname = usePathname();

  const menuGroups = [
    {
      headerTitle: "OPERASIONAL",
      menuHeaderInit: "open",
      menus: [
        {
          title: "Cuti",
          url: "/dashboard/cuti",
          icon: <UserCheck2Icon className="w-4 shrink-0" />,
        },
        {
          title: "Absensi",
          url: "/dashboard/absensi",
          icon: <UserCheckIcon className="w-4 shrink-0" />,
        },
        {
          title: "Overtime",
          url: "/dashboard/overtime",
          icon: <Clock10Icon className="w-4 shrink-0" />,
        },
        {
          title: "Log Aktivitas",
          url: "/dashboard/log-aktifitas",
          icon: <HistoryIcon className="w-4 shrink-0" />,
        },
      ],
    },
    {
      headerTitle: "PENGATURAN",
      menuHeaderInit: "open",
      menus: [
        {
          title: "Shift",
          url: "/dashboard/shift",
          icon: <Clock3Icon className="w-4 shrink-0" />,
        },
        {
          title: "Jadwal Masuk",
          url: "/dashboard/jadwal-masuk",
          icon: <TimerIcon className="w-4 shrink-0" />,
        },
        {
          title: "Data Karyawan",
          url: "/dashboard/data-karyawan",
          icon: <GroupIcon className="w-4 shrink-0" />,
        },
        {
          title: "Cuti Nasional",
          url: "/dashboard/cuti-nasional",
          icon: <CalendarClockIcon className="w-4 shrink-0" />,
        },
      ],
    },
    {
      headerTitle: "REFERENSI",
      menuHeaderInit: "open",
      menus: [
        {
          title: "Cabang Perusahaan",
          url: "/dashboard/cabang-perusahaan",
          icon: <GitBranchPlus className="w-4 shrink-0" />,
        },
        {
          title: "Departemen",
          url: "/dashboard/departemen",
          icon: <ToyBrickIcon className="w-4 shrink-0" />,
        },
        {
          title: "Jabatan",
          url: "/dashboard/jabatan",
          icon: <HardHatIcon className="w-4 shrink-0" />,
        },
        {
          title: "Kategori Shift",
          url: "/dashboard/kategori-shift",
          icon: <ListEndIcon className="w-4 shrink-0" />,
        },
        {
          title: "Kategori Cuti",
          url: "/dashboard/kategori-cuti",
          icon: <ListTodoIcon className="w-4 shrink-0" />,
        },
      ],
    },
  ];

  const getSidebarItemActiveStatus = (pathname: string, itemUrl: string) => {
    const regex = /^(\/dashboard\/[^\/]+)\/.*$/;

    // This replaces the entire string with just the content of the first capturing group
    const parentRoute = pathname.replace(regex, "$1");
    return parentRoute === itemUrl;
  };

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
  );
}