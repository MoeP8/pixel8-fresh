import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { SearchBar } from "@/components/ui/search-bar"
import { Bell, Menu, ChevronDown, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"
import { useClients } from "@/hooks/useClients"

interface DashboardLayoutProps {
  children: React.ReactNode
  title?: string
  showSearch?: boolean
}

export function DashboardLayout({ children, title = "Dashboard", showSearch = true }: DashboardLayoutProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const { clients, loading: clientsLoading } = useClients()
  const [selectedClient, setSelectedClient] = useState<string>("")

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    // Implement search functionality here
    console.log("Searching for:", query)
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-grid-3">
            <SidebarTrigger className="touch-target" aria-label="Toggle sidebar">
              <Menu className="h-5 w-5" />
            </SidebarTrigger>
            
            <div className="flex flex-1 items-center justify-between">
              <div className="flex items-center gap-6">
                {/* Logo */}
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm shadow-premium">
                    8
                  </div>
                  <span className="text-lg font-bold text-foreground hidden sm:block">Pixel8</span>
                </div>
                
                {/* Client Switcher */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2 hidden md:flex">
                      <span className="text-sm font-medium">
                        {clientsLoading ? "Loading..." : 
                         selectedClient ? clients.find(c => c.id === selectedClient)?.name || "Demo Client" : 
                         clients[0]?.name || "Demo Client"}
                      </span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56 bg-background border shadow-md">
                    <DropdownMenuLabel>Select Client</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {clients.map((client) => (
                      <DropdownMenuItem 
                        key={client.id}
                        onClick={() => setSelectedClient(client.id)}
                        className="cursor-pointer"
                      >
                        <div className="flex flex-col">
                          <span className="font-medium">{client.name}</span>
                          {client.industry && (
                            <span className="text-xs text-muted-foreground">{client.industry}</span>
                          )}
                        </div>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer">+ Add New Client</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <div className="flex items-center gap-3">
                {showSearch && (
                  <SearchBar 
                    placeholder="Search campaigns, posts..." 
                    onSearch={handleSearch}
                    className="w-64 hidden lg:block"
                  />
                )}
                
                {/* Notifications with Badge */}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="touch-target relative"
                  aria-label="Notifications"
                >
                  <Bell className="h-5 w-5" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-primary text-primary-foreground">
                    3
                  </Badge>
                </Button>
                
                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="gap-2 touch-target">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-secondary text-secondary-foreground">
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium hidden md:block">John Doe</span>
                      <ChevronDown className="h-4 w-4 hidden md:block" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Profile Settings</DropdownMenuItem>
                    <DropdownMenuItem>Billing</DropdownMenuItem>
                    <DropdownMenuItem>Team</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Sign Out</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>
          
          {/* Mobile search */}
          {showSearch && (
            <div className="sm:hidden p-grid-3 border-b border-border">
              <SearchBar 
                placeholder="Search..." 
                onSearch={handleSearch}
                className="w-full"
              />
            </div>
          )}
          
          {/* Main content */}
          <main className="flex-1 overflow-auto p-grid-3 space-grid animate-fade-in">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}