import { ReactNode, memo } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import BottomNav from './BottomNav';

interface LayoutProps {
  children: ReactNode;
}

const Layout = memo(({ children }: LayoutProps) => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-neutral">
      <Header />
      <main 
        className="flex-1 mb-20 md:mb-0"
      >
        {children}
      </main>
      <BottomNav />
    </div>
  );
});

Layout.displayName = 'Layout';

export default Layout;