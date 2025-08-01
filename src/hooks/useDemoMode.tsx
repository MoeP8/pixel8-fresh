import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function useDemoMode() {
  const navigate = useNavigate();

  useEffect(() => {
    // In demo mode, automatically redirect to dashboard
    if (!import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL === 'https://demo.supabase.co') {
      // Give time for the app to render
      setTimeout(() => {
        navigate('/dashboard');
      }, 100);
    }
  }, [navigate]);
}