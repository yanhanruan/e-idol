import Header from './Header';
import Footer from './Footer';
import BackgroundDecorations from './BackgroundDecorations';

const MainLayout = ({ children }) => {
  return (
    <>
      <BackgroundDecorations />
      <Header />
      <main>
        {children}
      </main>
      <Footer />
    </>
  );
};

export default MainLayout;