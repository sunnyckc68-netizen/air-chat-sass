"use client";

import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const login = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });
  };

  return (
    <div style={{ padding: 20 }}>
      <button onClick={login}>Google 로그인</button>
    </div>
  );
}