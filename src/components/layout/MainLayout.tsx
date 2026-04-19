import type { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import BackgroundDecorations from './BackgroundDecorations';
import GlobalChat from './GlobalChat';

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

      <GlobalChat />
    </>
  );
};

export default MainLayout;
