import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  Menu, 
  X, 
  Home, 
  Building2, 
  BarChart3, 
  Target, 
  Bot, 
  Calendar, 
  FolderOpen, 
  UserCheck,
  Settings,
  PenTool,
  Upload
} from 'lucide-react';

interface NavigationItem {
  name: string;
  href: string;
  icon: any;
  badge?: string;
}

const navigationItems: NavigationItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Clients', href: '/clients', icon: Building2 },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Campaigns', href: '/campaigns', icon: Target },
  { name: 'Content Studio', href: '/content-studio', icon: PenTool },
  { name: 'Publisher', href: '/publisher', icon: Upload },
  { name: 'Automation', href: '/automation', icon: Bot },
  { name: 'Scheduler', href: '/scheduler', icon: Calendar },
  { name: 'Assets', href: '/assets', icon: FolderOpen },
  { name: 'Approvals', href: '/approvals', icon: UserCheck },
  { name: 'Brand Hub', href: '/brand-hub', icon: Target },
  { name: 'Settings', href: '/settings', icon: Settings },
];

interface MobileNavigationProps {
  className?: string;
}

export function MobileNavigation({ className }: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const isActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  return (
    <div className={cn('flex items-center justify-between p-4 bg-black/20 backdrop-blur-lg border-b border-white/10', className)}>
      {/* Logo/Brand */}
      <Link to="/dashboard" className="flex items-center space-x-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
          <span className="text-white font-bold text-sm">P8</span>
        </div>
        <span className="text-white font-semibold text-lg hidden sm:block">Pixel8</span>
      </Link>

      {/* Desktop Navigation (hidden on mobile) */}
      <nav className="hidden lg:flex items-center space-x-1">
        {navigationItems.slice(0, 6).map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                isActive(item.href)
                  ? 'bg-white/20 text-white shadow-lg'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Mobile Menu Button */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden text-white hover:bg-white/10"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </SheetTrigger>
        <SheetContent 
          side="right" 
          className="w-80 bg-slate-900/95 backdrop-blur-xl border-l border-white/10 p-0"
        >
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">P8</span>
              </div>
              <span className="text-white font-semibold text-lg">Pixel8 Social Hub</span>
            </div>
          </div>

          {/* Mobile Menu Items */}
          <nav className="flex flex-col p-4 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                    isActive(item.href)
                      ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-white border border-purple-500/30 shadow-lg'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                  {item.badge && (
                    <span className="ml-auto bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10 bg-slate-900/50">
            <div className="text-center text-white/50 text-xs">
              <p>Pixel8 Social Hub</p>
              <p className="mt-1">Professional Social Media Management</p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}