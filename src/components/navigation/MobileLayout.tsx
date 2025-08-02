import { ReactNode } from 'react';
import { MobileNavigation } from './MobileNavigation';
import { BottomNavigation } from './BottomNavigation';
import { cn } from '@/lib/utils';

interface MobileLayoutProps {
  children: ReactNode;
  className?: string;
  showBottomNav?: boolean;
}

export function MobileLayout({ 
  children, 
  className,
  showBottomNav = true 
}: MobileLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Top Navigation */}
      <MobileNavigation />
      
      {/* Main Content */}
      <main className={cn(
        'px-4 py-6 transition-all duration-300',
        showBottomNav ? 'pb-20 md:pb-6' : 'pb-6',
        className
      )}>
        {children}
      </main>
      
      {/* Bottom Navigation (Mobile Only) */}
      {showBottomNav && <BottomNavigation />}
    </div>
  );
}