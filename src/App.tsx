import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { Sidebar } from '@/components/Sidebar';
import { LoginPage } from '@/pages/LoginPage';
import { SignupPage } from '@/pages/SignupPage';
import { QuickLogPage } from '@/pages/QuickLogPage';
import { TimelinePage } from '@/pages/TimelinePage';
import { DoctorSummaryPage } from '@/pages/DoctorSummaryPage';
import { InsightsPage } from '@/pages/InsightsPage';
import { OnboardingCarousel } from '@/components/OnboardingCarousel';
import { PulseWave } from '@/components/PulseWave';
import { Loader2, Heart } from 'lucide-react';
import type { Page } from '@/lib/types';

function AuthGate() {
  const { session, loading } = useAuth();
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');
  const [page, setPage] = useState<Page>('quicklog');
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
      <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#1A1B23] flex items-center justify-center transition-colors duration-200">
        <div className="flex flex-col items-center gap-4 relative">
          <div className="w-12 h-12 rounded-2xl bg-lavender-500 flex items-center justify-center animate-pulse-slow">
            <Heart className="w-6 h-6 text-white" fill="white" />
          </div>
          <PulseWave className="w-48 h-6 text-lavender-400 dark:text-lavender-500" />
          <Loader2 className="w-5 h-5 animate-spin text-lavender-500" />
        </div>
      </div>
    );
  }

  if (!session) {
    return authView === 'login' ? (
      <LoginPage onSwitch={() => setAuthView('signup')} />
    ) : (
      <SignupPage onSwitch={() => setAuthView('login')} />
    );
  }

  return (
    <div className="flex min-h-screen bg-[#FAFAF8] dark:bg-[#1A1B23] transition-colors duration-200">
      <Sidebar currentPage={page} onNavigate={setPage} />
      <main className="flex-1 overflow-y-auto bg-gray-50/50 dark:bg-[#1A1B23]">
        <div className="max-w-5xl mx-auto">
          {page === 'quicklog' && <QuickLogPage />}
          {page === 'timeline' && <TimelinePage />}
          {page === 'summary' && <DoctorSummaryPage />}
          {page === 'insights' && <InsightsPage />}
        </div>
      </main>
      {showOnboarding && <OnboardingCarousel onDismiss={dismissOnboarding} />}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AuthGate />
      </AuthProvider>
    </ThemeProvider>
  );
}
