import React from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/authSlice";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <div className="pt-3 mx-4">
      <div>Logged in successfully</div>
      <button
        className="btn-primary btn px-3 mt-3"
        onClick={() => {
          dispatch(logout);
          localStorage.removeItem("auth");
          navigate("/login");
          window.location.reload();
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Home;
