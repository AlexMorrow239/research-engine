import React from "react";
import Header from "../Header/Header";
import "../../styles/main.scss";

const MainLayout = ({ children, onNavigate }) => {
  return (
    <div className="main-layout">
      <Header onNavigate={onNavigate} />
      <main className="main-content">{children}</main>
    </div>
  );
};

export default MainLayout;
