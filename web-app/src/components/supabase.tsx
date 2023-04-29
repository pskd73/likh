import { createClient } from "@supabase/supabase-js";
import Event from "./Event";
import { LoggedInUser } from "../type";
import { useEffect } from "react";

export const supabase = createClient(
  "https://crsbxqtxjqprmhrgdylk.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNyc2J4cXR4anFwcm1ocmdkeWxrIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Nzc0MTE0NTksImV4cCI6MTk5Mjk4NzQ1OX0.ySVSLlEBQRPkVG-rA-Ul6jswXMa_NzeZIZUp0k-2oig"
);

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
        Event.track("logged_in");
        setLoggedInUser({
          email: session.user.email,
          token: session.access_token,
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);
};
