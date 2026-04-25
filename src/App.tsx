// src/App.tsx
import { Switch, Route } from 'wouter';
import { LanguageProvider } from './contexts/LanguageContext';
import { TransitionProvider } from './contexts/TransitionContext';
import { AuthProvider } from './contexts/AuthContext';

import MainLayout from './components/layout/MainLayout';
import CyberTransition from './components/layout/CyberTransition';

// Pages
import HomePage from './pages/homepage/Homepage';
import TestPage from './pages/TestPage';
import ReservationPage from './pages/reservationpage/ReservationPage';
// 假设你已经按照之前的建议新建了这些页面，如果没有，请先创建简单的占位组件
import ProcessPage from './pages/ProcessPage'; 
import PricingPage from './pages/PricingPage';
import CastListPage from './pages/CastListPage';
import RecruitmentPage from './pages/RecruitmentPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <TransitionProvider>
          <CyberTransition />

          {/* 所有页面使用 MainLayout（登录/注册嵌套在 Header/Footer 布局中） */}
          <MainLayout>
            <Switch>
              <Route path="/" component={HomePage} />
              <Route path="/login" component={LoginPage} />
              <Route path="/register" component={RegisterPage} />
              <Route path="/process" component={ProcessPage} />
              <Route path="/pricing" component={PricingPage} />
              <Route path="/castList" component={CastListPage} />
              <Route path="/recruitment" component={RecruitmentPage} />
              <Route path="/reservation" component={ReservationPage} />
              <Route path="/test" component={TestPage} />

              {/* 404 */}
              <Route>
                <div className="flex items-center justify-center min-h-[50vh] text-white">
                  <div className="text-center">
                    <h2 className="text-5xl font-bold mb-4 text-red-500">404</h2>
                    <p>Page Not Found</p>
                  </div>
                </div>
              </Route>
            </Switch>
          </MainLayout>


        </TransitionProvider>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;