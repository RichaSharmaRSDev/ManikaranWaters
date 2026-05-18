// frontend/src/components/layout/AppLayout.js
// Wrap all authenticated pages with this — gives sidebar + header shell

import React from "react";
import { useSelector } from "react-redux";
import "./AppLayout.css";
import Navigation from "../../Navigation/Navigation";
import Header from "../Header/Header";

const AppLayout = ({ children }) => {
  const { showNavigation } = useSelector((state) => state.navigation);

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <Navigation />

      {/* Right side: header + page content */}
      <div className={`app-main ${showNavigation ? "nav-open" : "nav-closed"}`}>
        <Header />
        <div className="app-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AppLayout;