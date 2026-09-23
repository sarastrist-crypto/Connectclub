import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api, type Ambassador } from '@/lib/api';
import Landing from '@/pages/Landing';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';
import Nominate from '@/pages/Nominate';
import Import from '@/pages/Import';
import MyPage from '@/pages/MyPage';
import PublicReferralPage from '@/pages/PublicReferralPage';

export type SessionCtx = {
  ambassador: Ambassador | null;
  loading: boolean;
  refresh: () => Promise<void>;
};

import { createContext, useContext } from 'react';
export const SessionContext = createContext<SessionCtx>({
  ambassador: null,
  loading: true,
  refresh: async () => {},
});
export const useSession = () => useContext(SessionContext);

export default function App() {
  const [ambassador, setAmbassador] = useState<Ambassador | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    try { setAmbassador(await api.getSession()); }
    finally { setLoading(false); }
  };

  useEffect(() => { refresh(); }, []);

  // Scroll-reveal observer
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('revealed'); obs.unobserve(e.target); }
      }),
      { threshold: 0.1 },
    );
    const observe = () => document.querySelectorAll('.reveal:not(.revealed)').forEach(el => obs.observe(el));
    observe();
    const interval = setInterval(observe, 500);
    return () => { obs.disconnect(); clearInterval(interval); };
  }, []);

  return (
    <SessionContext.Provider value={{ ambassador, loading, refresh }}>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/:code" element={<PublicReferralPage />} />

        {/* Authenticated */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/nominate" element={<ProtectedRoute><Nominate /></ProtectedRoute>} />
        <Route path="/import" element={<ProtectedRoute><Import /></ProtectedRoute>} />
        <Route path="/my-page" element={<ProtectedRoute><MyPage /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </SessionContext.Provider>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { ambassador, loading } = useSession();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-ocean">
      <div className="w-8 h-8 rounded-full border-2 border-azure border-t-transparent animate-spin" />
    </div>
  );
  if (!ambassador) return <Navigate to="/register" replace />;
  return <>{children}</>;
}
