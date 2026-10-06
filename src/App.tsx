import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { ToastProvider } from '@/components/Toast';
import { TopNav } from '@/components/TopNav';
import { LoginPage } from '@/pages/LoginPage';
import { SignupPage } from '@/pages/SignupPage';
import { LandingPage } from '@/pages/LandingPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { QuickLogPage } from '@/pages/QuickLogPage';
import { TimelinePage } from '@/pages/TimelinePage';
import { DoctorSummaryPage } from '@/pages/DoctorSummaryPage';
import { InsightsPage } from '@/pages/InsightsPage';
import { OnboardingCarousel } from '@/components/OnboardingCarousel';
import { Loader2, Heart } from 'lucide-react';
import type { Page } from '@/lib/types';

function AuthGate() {
  const { session, loading } = useAuth();
  const [showLanding, setShowLanding] = useState(true);
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');
  const [page, setPage] = useState<Page>('dashboard');
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (session && !localStorage.getItem('silent-symptom-onboarded')) {
      setShowOnboarding(true);
    }
  }, [session]);

  const dismissOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem('silent-symptom-onboarded', 'true');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBFBFA] dark:bg-[#18181B] flex items-center justify-center transition-colors duration-200">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-gray-900 dark:bg-gray-100 flex items-center justify-center">
            <Heart className="w-5 h-5 text-white dark:text-gray-900" fill="currentColor" />
          </div>
          <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  if (!session) {
    if (showLanding) {
      return (
        <LandingPage
          onGetStarted={() => {
            setShowLanding(false);
            setAuthView('signup');
          }}
          onLearnMore={() => {
            const el = document.getElementById('how-it-works');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          hasSession={false}
        />
      );
    }
    return authView === 'login' ? (
      <LoginPage onSwitch={() => setAuthView('signup')} onBack={() => setShowLanding(true)} />
    ) : (
      <SignupPage onSwitch={() => setAuthView('login')} onBack={() => setShowLanding(true)} />
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFBFA] dark:bg-[#18181B] transition-colors duration-200">
      <TopNav currentPage={page} onNavigate={setPage} />
      <main>
        {page === 'dashboard' && <DashboardPage onNavigate={setPage} />}
        {page === 'quicklog' && <QuickLogPage />}
        {page === 'timeline' && <TimelinePage />}
        {page === 'insights' && <InsightsPage />}
        {page === 'reports' && <DoctorSummaryPage />}
      </main>
      {showOnboarding && <OnboardingCarousel onDismiss={dismissOnboarding} />}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <AuthGate />
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
