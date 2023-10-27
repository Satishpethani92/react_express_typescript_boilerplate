import { Route } from "react-router-dom";
import Home from "./pages/User/Home";
import Login from "./pages/Login";

import SignUp from "./pages/SignUp";

import AdminHome from "./pages/Admin/AdminHome";

import UserDetails from "./pages/Admin/UserDetails";

export const DefaultRoutes = (
  <>
    <Route path="/">
      <Route index element={<Home />} />
    </Route>
  </>
);

export const SuperAdminRoutes = (
  <>
    <Route path="/">
      <Route index element={<AdminHome />} />
      <Route path="user">
        <Route index element={<AdminHome />} />
        <Route path=":usrID" element={<UserDetails />} />
      </Route>
    </Route>
  </>
);

export const AuthRoutes = (
  <>
    <Route path="/">
      <Route index element={<Login />} />
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<SignUp />} />
    </Route>
  </>
);
