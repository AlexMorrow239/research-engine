import { Outlet } from "react-router-dom";
import { NavBar } from "../components/layout/navBar/NavBar";

export const RootLayout = (): JSX.Element => {
  return (
    <div>
      <NavBar />
      <main>
        <Outlet />
      </main>
    </div>
  );
};
