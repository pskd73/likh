"use client";
import { createClient } from "@supabase/supabase-js";
import { useEffect } from "react";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_KEY!
);

export default function Auth() {
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user.email) {
        console.log(session);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user.email) {
        console.log(session);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return null;
}
