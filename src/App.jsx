import { Switch, Route } from 'wouter';
import { LanguageProvider } from './contexts/LanguageContext'; // 1. 导入 Provider
import { TransitionProvider } from './contexts/TransitionContext';

import MainLayout from './components/layout/MainLayout';
import CyberTransition from './components/layout/CyberTransition';

import HomePage from './pages/homepage/Homepage';
import TestPage from './pages/TestPage';
import ReservationPage from './pages/reservationpage/ReservationPage'

const App = () => {
  return (
    <LanguageProvider>
      <TransitionProvider>
        <CyberTransition />
        <Switch>
          <Route path="/">
            {/* 用 MainLayout 包裹 HomePage */}
            <MainLayout>
              <HomePage />
            </MainLayout>
          </Route>
          <Route path="/reservation">
            <MainLayout>
              <ReservationPage />
            </MainLayout>
          </Route>
          <Route path="/test" component={TestPage} />
          {/* 未来你可以添加更多路由:
            <Route path="/profile">
              <MainLayout>
                <ProfilePage />
              </MainLayout>
            </Route>
          */}
          {/* 404 */}
          <Route>
            <MainLayout>
              <div className="text-white text-center py-20">404: Page Not Found</div>
            </MainLayout>
          </Route>
        </Switch>
      </TransitionProvider>
    </LanguageProvider>
  );
};

export default App;