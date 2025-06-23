"use client"

import * as React from "react"
import {
  Bot,
  PieChart,
  Folder,
  Satellite,
  Drone,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useSession } from "next-auth/react"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const session = useSession()
  const data = {
  user: {
      name: (session.data?.user?.name ?? "shadcn"),
      email: (session.data?.user?.email ?? "m@example.com"),
      avatar: (session.data?.user?.image ?? "/avatars/shadcn.jpg"),
    }
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground flex flex-row items-center gap-2 pt-2">
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
            <Drone />
          </div>
          <div className="grid flex-1 text-left text-2xl leading-tight">
                <span className="truncate font-medium ">Dronecontrol</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={[
          {
            title: "Missions",
            icon: Folder,
            url: "#",
            items: [
              { title: "All Missions", url: "/missions" },
              { title: "Plan New Mission", url: "/missions/create" },
            ],
          },
          {
            title: "Fleet Management",
            icon: Bot,
            url: "#",
            items: [
              { title: "Drone Inventory", url: "/drones" },
            ],
          },
          {
            title: "Real-Time Monitor",
            icon: Satellite,
            url: "#",
            items: [
              { title: "Live Missions", url: "/monitor" },
            ],
          },
          {
            title: "Reports & Analytics",
            icon: PieChart,
            url: "#",
            items: [
              { title: "Survey Reports", url: "/reports" },
              { title: "Org Analytics", url: "/analytic" },
            ],
          },
        ]} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
