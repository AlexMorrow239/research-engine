import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter
      future={{
        v7_startTransition: true, // Opt-in for startTransition behavior
        v7_relativeSplatPath: true, // Opt-in for relative splat path resolution
      }}
    >
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
