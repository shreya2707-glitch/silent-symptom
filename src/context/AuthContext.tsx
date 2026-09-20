import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  displayName: string | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const user = session?.user ?? null;
  const displayName =
    user?.user_metadata?.display_name ?? user?.email?.split('@')[0] ?? null;

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: name } },
    });
    if (error) return { error: error.message };
    if (data.user) {
      await seedDemoEntries(data.user.id);
    }
    return { error: null };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ session, user, displayName, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

async function seedDemoEntries(userId: string) {
  const now = new Date();
  const demoEntries = [
    {
      raw_text: 'Woke up with a dull ache in my lower abdomen, mostly on the left side. It got worse after breakfast. Felt bloated all morning.',
      tags: ['pain', 'bloating', 'abdomen'],
      severity: 4,
      body_area: 'Abdomen',
      flagged: true,
      daysAgo: 1,
    },
    {
      raw_text: 'Could not fall asleep until 2am. Kept waking up. Feel exhausted today and having trouble focusing on work.',
      tags: ['insomnia', 'fatigue', 'brain fog'],
      severity: 3,
      body_area: 'General',
      flagged: false,
      daysAgo: 3,
    },
    {
      raw_text: 'Sharp pain in my pelvic area during my morning walk. Had to stop and sit down. Lasted about 20 minutes.',
      tags: ['pain', 'pelvic', 'sharp'],
      severity: 5,
      body_area: 'Pelvic Area',
      flagged: true,
      daysAgo: 5,
    },
    {
      raw_text: 'Feeling anxious and irritable today. Stressed about upcoming appointments. Mild headache in the afternoon.',
      tags: ['anxiety', 'stress', 'headache', 'irritable'],
      severity: 3,
      body_area: 'Head & Neck',
      flagged: false,
      daysAgo: 8,
    },
    {
      raw_text: 'Nausea after lunch, some bloating and gas. Stomach was cramping on and off for a couple hours.',
      tags: ['nausea', 'bloating', 'cramp', 'gas'],
      severity: 3,
      body_area: 'Abdomen',
      flagged: false,
      daysAgo: 12,
    },
    {
      raw_text: 'Joint pain in both knees and my lower back when I woke up. Felt stiff. Got a bit better after moving around but still sore.',
      tags: ['joint', 'back', 'stiff', 'pain'],
      severity: 4,
      body_area: 'Back',
      flagged: false,
      daysAgo: 18,
    },
  ];

  const rows = demoEntries.map((e) => {
    const date = new Date(now);
    date.setDate(date.getDate() - e.daysAgo);
    date.setHours(9 + (e.daysAgo % 8), 15, 0, 0);
    return {
      user_id: userId,
      raw_text: e.raw_text,
      tags: e.tags,
      severity: e.severity,
      body_area: e.body_area,
      flagged: e.flagged,
      created_at: date.toISOString(),
    };
  });

  const { error } = await supabase.from('entries').insert(rows);
  if (error) console.error('Failed to seed demo entries:', error.message);
}
