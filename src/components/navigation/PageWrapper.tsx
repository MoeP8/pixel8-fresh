import { ReactNode } from 'react';
import { MobileLayout } from './MobileLayout';

interface PageWrapperProps {
  children: ReactNode;
  showBottomNav?: boolean;
}

export function PageWrapper({ children, showBottomNav = true }: PageWrapperProps) {
  return (
    <MobileLayout showBottomNav={showBottomNav}>
      {children}
    </MobileLayout>
  );
}