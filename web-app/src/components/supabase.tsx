import { createClient } from "@supabase/supabase-js";
import Event from "./Event";
import { LoggedInUser } from "../type";
import { useEffect } from "react";

export const supabase = createClient(
  "https://gfbrmxfdddmpwlqtvwsh.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmYnJteGZkZGRtcHdscXR2d3NoIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODI3NzMwNjQsImV4cCI6MTk5ODM0OTA2NH0.44lRQgUo7MOULLBvJ3moD6Z_XhA7FOcxqCA0kH22H9M"
);
let triggered = false;

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
        if (!triggered) {
          Event.track("logged_in");
          triggered = true;
        }
        setLoggedInUser({
          email: session.user.email,
          token: session.access_token,
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);
};
