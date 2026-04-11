import type { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import BackgroundDecorations from './BackgroundDecorations';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <>
      <BackgroundDecorations />
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default MainLayout;
