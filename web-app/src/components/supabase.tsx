import { createClient } from "@supabase/supabase-js";
import { LoggedInUser } from "../type";
import { useEffect } from "react";
import { SUPABASE_KEY, SUPABASE_URL } from "../config";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export const useSupabase = ({
  setLoggedInUser,
}: {
  setLoggedInUser: (user: LoggedInUser) => void;
}) => {
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user.email) {
        setLoggedInUser({
          email: session.user.email,
          token: session.access_token,
        });
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user.email) {
        setLoggedInUser({
          email: session.user.email,
          token: session.access_token,
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);
};
