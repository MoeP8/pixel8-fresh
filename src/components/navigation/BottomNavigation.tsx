import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Home, 
  Building2, 
  BarChart3, 
  Target, 
  Calendar,
  PenTool
} from 'lucide-react';

interface BottomNavItem {
  name: string;
  href: string;
  icon: any;
}

const bottomNavItems: BottomNavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Clients', href: '/clients', icon: Building2 },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Studio', href: '/content-studio', icon: PenTool },
  { name: 'Scheduler', href: '/scheduler', icon: Calendar },
  { name: 'Campaigns', href: '/campaigns', icon: Target },
];

export function BottomNavigation() {
  const location = useLocation();

  const isActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-t border-white/10 md:hidden">
      <div className="grid grid-cols-6 h-16">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex flex-col items-center justify-center space-y-1 text-xs font-medium transition-all duration-200',
                active
                  ? 'text-white bg-purple-500/20'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              )}
            >
              <Icon className={cn('w-5 h-5', active && 'text-purple-400')} />
              <span className={cn('text-[10px]', active && 'text-purple-300')}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}