import { Outlet } from "react-router-dom";
import { NavBar } from "../navBar/NavBar";
import "./MainLayout.scss";

export const MainLayout = () => {
  return (
    <div className="layout">
      <NavBar />
      <main className="layout__main">
        <div className="container">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
