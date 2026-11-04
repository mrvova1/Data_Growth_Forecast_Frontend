import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

import { BottomNav } from './BottomNav';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { pathname } = useLocation();
  const isFeedPage = pathname.startsWith('/feed');

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

      <main className={isFeedPage ? 'app-screen app-screen--feed' : 'app-screen'}>
        {children}
      </main>

      <BottomNav />
    </div>
  );
}
