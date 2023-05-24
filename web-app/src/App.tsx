import { useEffect, useState } from "react";
import { AppContext, useAppContext } from "./components/AppContext";
import { useSupabase } from "./components/supabase";
import { Paper } from "./comps/Layout";
import { Nav, Footer } from "./comps/Nav";
import { Outlet } from "react-router-dom";
import { API_HOST } from "./config";
import { User } from "./type";

const App = ({ nav = true }: { nav?: boolean }) => {
  const [sbUser, setSbUser] = useState<User | null>();
  const appContext = useAppContext();

  useEffect(() => {
    (async () => {
      if (sbUser) {
        const res = await fetch(`${API_HOST}/user-home`, {
          headers: {
            Authorization: `Bearer ${sbUser.token}`,
          },
        });
        const json = await res.json();
        appContext.setUser({ ...json.user, token: sbUser.token });
      }
    })();
  }, [sbUser]);

  useSupabase({
    setUser: (user) => {
      setSbUser((u) => {
        if (u?.token === user?.token) return u;
        return user;
      });
    },
  });

  return (
    <AppContext.Provider value={appContext}>
      <div className="font-Inter text-base text-primary-700 bg-base min-h-[100vh]">
        {nav && appContext.user && !appContext.focusMode && <Nav />}
        <Paper className="py-8 min-h-[100vh]">
          <Outlet />
        </Paper>
        {!appContext.focusMode && <Footer />}
      </div>
    </AppContext.Provider>
  );
};

export default App;
