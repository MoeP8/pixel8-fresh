import { Home, Users, Palette, PenTool, Calendar, CheckSquare, BarChart3, Target, Workflow, Settings, FolderOpen, Send } from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

const items = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Clients", url: "/clients", icon: Users },
  { title: "Brand Hub", url: "/brand-hub", icon: Palette },
  { title: "Content Studio", url: "/content-studio", icon: PenTool },
  { title: "Publisher", url: "/publisher", icon: Send },
  { title: "Assets", url: "/assets", icon: FolderOpen },
  { title: "Scheduler", url: "/scheduler", icon: Calendar },
  { title: "Approvals", url: "/approvals", icon: CheckSquare },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Campaigns", url: "/campaigns", icon: Target },
  { title: "Automation", url: "/automation", icon: Workflow },
  { title: "Settings", url: "/settings", icon: Settings },
]

export function AppSidebar() {
  const { state } = useSidebar()
  const location = useLocation()
  const currentPath = location.pathname
  const collapsed = state === "collapsed"

  const isActive = (path: string) => {
    if (path === "/") return currentPath === "/"
    return currentPath.startsWith(path)
  }

  const getNavCls = (active: boolean) =>
    `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-sidebar-accent/50 focus:bg-sidebar-accent focus:outline-none touch-target ${
      active 
        ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm" 
        : "text-sidebar-foreground hover:text-sidebar-accent-foreground"
    }`

  return (
    <Sidebar
      className={`${collapsed ? "w-16" : "w-64"} transition-all duration-300`}
      collapsible="icon"
    >
      <SidebarContent className="bg-sidebar-background border-r border-sidebar-border">
        {/* Logo/Brand Section */}
        <div className="p-grid-3 border-b border-sidebar-border">
          {collapsed ? (
            <div className="flex justify-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-lg shadow-premium">
                8
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-lg shadow-premium">
                8
              </div>
              <div>
                <h2 className="text-xl font-bold text-sidebar-foreground">Pixel8</h2>
                <p className="text-sm text-sidebar-foreground/70 font-medium">Social Hub</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Navigation */}
        <SidebarGroup className="px-3 py-grid-3">
          {!collapsed && (
            <SidebarGroupLabel className="text-sidebar-foreground/70 text-xs font-medium mb-grid">
              MAIN MENU
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {items.map((item) => {
                const active = isActive(item.url)
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url} 
                        className={() => getNavCls(active)}
                        title={collapsed ? item.title : undefined}
                      >
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        {!collapsed && <span className="truncate">{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}