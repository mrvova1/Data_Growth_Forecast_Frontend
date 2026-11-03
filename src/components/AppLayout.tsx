import type { ReactNode } from 'react';
import { BottomNav } from './BottomNav';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="phone-shell">
      <header className="app-topline">
        <div className="brand-mark" aria-hidden="true">DG</div>
        <div>
          <div className="brand-name">DATA GROWTH</div>
          <div className="brand-subtitle">ПРОГНОЗ ОБЪЁМА ДАННЫХ</div>
        </div>
        <span className="guest-chip">ГОСТЬ</span>
      </header>
      <main className="app-screen">{children}</main>
      <BottomNav />
    </div>
  );
}
