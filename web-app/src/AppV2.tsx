import { AppContext, useAppContext } from "./components/AppContext";
import { Paper } from "./comps/Layout";
import { Nav, Footer } from "./comps/Nav";
import { Outlet } from "react-router-dom";

const AppV2 = () => {
  const appContext = useAppContext();

  return (
    <AppContext.Provider value={appContext}>
      <div className="font-SpecialElite text-base text-primary-700 bg-base">
        <Nav />
        <Paper className="py-8">
          <Outlet />
        </Paper>
        <Footer />
      </div>
    </AppContext.Provider>
  );
};

export default AppV2;
