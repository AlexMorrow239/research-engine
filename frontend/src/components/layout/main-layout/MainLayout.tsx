import { Outlet } from "react-router-dom";

import { NavBar } from "../navBar/NavBar";
import "./MainLayout.scss";

export const MainLayout = (): JSX.Element => {
  return (
    <div className="layout">
      <NavBar />
      <main className="layout__main">
        <Outlet />
      </main>
    </div>
  );
};
