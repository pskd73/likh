import { AppContext, useAppContext } from "./components/AppContext";
import { useSupabase } from "./components/supabase";
import { Paper } from "./comps/Layout";
import { Nav, Footer } from "./comps/Nav";
import { Outlet } from "react-router-dom";

const App = ({ nav = true }: { nav?: boolean }) => {
  const appContext = useAppContext();

  useSupabase({
    setUser: (user) => {
      appContext.setUser((u) => {
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
