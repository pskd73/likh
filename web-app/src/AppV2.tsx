import { AppContext, useAppContext } from "./components/AppContext";
import { useSupabase } from "./components/supabase";
import { Paper } from "./comps/Layout";
import { Nav, Footer } from "./comps/Nav";
import { Outlet } from "react-router-dom";

const AppV2 = () => {
  const appContext = useAppContext();

  useSupabase({
    setUser: appContext.setUser,
  });

  return (
    <AppContext.Provider value={appContext}>
      <div className="font-SpecialElite text-base text-primary-700 bg-base min-h-[100vh]">
        <Nav />
        <Paper className="py-8 min-h-[100vh]">
          <Outlet />
        </Paper>
        <Footer />
      </div>
    </AppContext.Provider>
  );
};

export default AppV2;
