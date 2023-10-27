import React, { useState } from "react";
import { Form, InputGroup } from "react-bootstrap";
import { LoginPayload } from "../types/auth.dto";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLockOpen } from "@fortawesome/free-solid-svg-icons";
import { faEyeSlash, faEye } from "@fortawesome/free-regular-svg-icons";
import { Link, useNavigate } from "react-router-dom";

import { validateEmail } from "../utils/commonUtils";
import { api } from "../services/api";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/authSlice";
import LoadingModal from "../components/Modal/LoadingModal";

declare type SigninInputDto = LoginPayload & {
  [key: string]: string | undefined;
};

const defaultSignInInputs: SigninInputDto = {
  email: "",
  password: "",
};

const Login = () => {
  const navigate = useNavigate();

  const [inputs, setInputs] = useState<SigninInputDto>(defaultSignInInputs);
  const [errors, setErrors] = useState<SigninInputDto>(defaultSignInInputs);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();

  const validate = () => {
    const err: SigninInputDto = { ...defaultSignInInputs };

    if (!validateEmail(inputs.email)) {
      err.email = "Please enter a valid email address";
    }

    if (!inputs.password) {
      err.password = "Please enter a password";
    }

    if (err.identity || err.password) {
      setErrors(err);
      return false;
    }

    return true;
  };

  const signIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setIsLoading(true);
      const payload: LoginPayload = {
        email: inputs.email,
        password: inputs.password,
      };

      const response = await api.loginUser(payload);

      if (response) {
        setInputs({ ...defaultSignInInputs });
        dispatch(setUser(response));
        localStorage.setItem("auth", JSON.stringify(response));
        navigate("/");
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const feedbackError = (key: string) => {
    return (
      <Form.Control.Feedback
        style={{ fontSize: "10px" }}
        className="font-color-red d-block poppins text-start"
        type="invalid"
      >
        {errors[key]}&nbsp;
      </Form.Control.Feedback>
    );
  };

  return (
    <div className="auth-wrapper h-100">
      <LoadingModal isVisible={isLoading} />
      <div className="auth-content">
        <div className="auth-bg">
          <span className="r"></span>
          <span className="r s"></span>
          <span className="r s"></span>
          <span className="r"></span>
        </div>
        <div className="card border-0 rounded-3 shadow-lg p-3">
          <div className="card-body text-center">
            <div className="mb-4">
              <FontAwesomeIcon
                icon={faLockOpen}
                className="text-primary"
                size="2xl"
              />
            </div>
            <h3 className="mb-4">Login</h3>
            <Form onSubmit={signIn}>
              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  autoFocus
                  value={inputs.email}
                  placeholder="Email"
                  title="email"
                  isInvalid={!!errors.email}
                  onChange={(e) => {
                    setInputs({
                      ...inputs,
                      email: e.target.value,
                    });
                    setErrors({
                      ...errors,
                      email: "",
                    });
                  }}
                />
                {feedbackError("identity")}
              </Form.Group>
              <Form.Group className="mb-4">
                <InputGroup>
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    placeholder="password"
                    value={inputs.password}
                    title="password"
                    onChange={(e) => {
                      setInputs({
                        ...inputs,
                        password: e.target.value,
                      });
                      setErrors({
                        ...errors,
                        password: "",
                      });
                    }}
                  />
                  <button
                    className="bg-transparent border-0 border-1 border-bottom border-end border-top rounded-end"
                    type="button"
                    onClick={() => {
                      setShowPassword(!showPassword);
                    }}
                  >
                    <FontAwesomeIcon
                      style={{ minWidth: "40px" }}
                      icon={showPassword ? faEyeSlash : faEye}
                      size="lg"
                    />
                  </button>
                </InputGroup>
                {feedbackError("password")}
              </Form.Group>
              <button
                type="submit"
                className="btn btn-primary shadow-2 mb-4 px-3"
              >
                Login
              </button>
              <p className="mb-2 text-muted">
                Forgot Password? <Link to={"/forgot-password"}>Reset</Link>
              </p>
              <p className="mb-0 text-muted">
                Don't have an account? <Link to={"/signup"}>Sign Up</Link>{" "}
              </p>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
