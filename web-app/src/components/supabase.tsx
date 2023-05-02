import { createClient } from "@supabase/supabase-js";
import { User } from "../type";
import { useEffect } from "react";
import { SUPABASE_KEY, SUPABASE_URL } from "../config";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export const useSupabase = ({
  setUser,
}: {
  setUser: (user: User) => void;
}) => {
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user.email) {
        setUser({
          email: session.user.email,
          token: session.access_token,
        });
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user.email) {
        setUser({
          email: session.user.email,
          token: session.access_token,
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);
};
