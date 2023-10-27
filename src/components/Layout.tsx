import React, { useEffect } from "react";

import "../scss/layout.scss";
import { useDispatch, useSelector } from "react-redux";
import { getUser, setUser } from "../redux/authSlice";
import { Route, Routes } from "react-router-dom";
import { AuthRoutes, DefaultRoutes, SuperAdminRoutes } from "../routes";
import NotFound from "../pages/NotFound";
import { LoginDto } from "../types/auth.dto";

const Layout = () => {
  const user = useSelector(getUser);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) {
      const user: LoginDto = JSON.parse(localStorage.getItem("auth")!);
      dispatch(setUser(user));
    }
  }, [dispatch, user]);

  return (
    <div className="position-relative">
      <div>
        <div className={` ${user ? "auth-styles" : ""} main-section`}>
          <Routes>
            {user?.role === "user" && DefaultRoutes}
            {user?.role === "admin" && SuperAdminRoutes}
            {!user && AuthRoutes}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Layout;
