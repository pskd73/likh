import { useEffect } from "react";
import { AppContext, useAppContext } from "./components/AppContext";
import { useSupabase } from "./components/supabase";
import { Paper } from "./comps/Layout";
import { Nav, Footer } from "./comps/Nav";
import { Outlet, useNavigate } from "react-router-dom";

const App = ({ nav = true }: { nav?: boolean }) => {
  const appContext = useAppContext();
  const navigate = useNavigate();

  useSupabase({
    setUser: (user) => {
      if (user) {
        appContext.setUser(user);
      } else {
        navigate("/");
      }
    },
  });

  return (
    <AppContext.Provider value={appContext}>
      <div className="font-SpecialElite text-base text-primary-700 bg-base min-h-[100vh]">
        {nav && appContext.user && <Nav />}
        <Paper className="py-8 min-h-[100vh]">
          <Outlet />
        </Paper>
        <Footer />
      </div>
    </AppContext.Provider>
  );
};

export default App;
