import React, { useState } from "react";
import { startsWith } from "lodash";

import "../scss/signup.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { Form, FormGroup, InputGroup } from "react-bootstrap";
import PhoneInput, { CountryData } from "react-phone-input-2";

import { CountryCode, parsePhoneNumber } from "libphonenumber-js";
import { validateEmail, validatePassword } from "../utils/commonUtils";
import { UserPayload } from "../types/auth.dto";
import { api } from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import LoadingModal from "../components/Modal/LoadingModal";

declare type UserInputDto = {
  userName: string;
  phoneNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
  [key: string]: string | undefined;
};

const defaultUserInputs: UserInputDto = {
  userName: "",
  phoneNumber: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const SignUp = () => {
  const navigate = useNavigate();
  const [userInputs, setUserInputs] = useState<UserInputDto>(defaultUserInputs);
  const [errors, setErrors] = useState<UserInputDto>(defaultUserInputs);
  const [countryCode, setCountryCode] = useState<CountryCode>("IN");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const inputStyle = {
    width: "100%",
    border: "none",
  };

  const buttonStyle = {};

  const searchStyle = {
    color: "rgb(207, 207, 207)",
  };

  const validate = (userInputs: UserInputDto) => {
    const err: UserInputDto = { ...defaultUserInputs };
    if (userInputs.userName === "") {
      err.userName = "Please enter user name";
    }

    if (!validateEmail(userInputs.email)) {
      err.email = "Please enter valid email";
    }

    const parsedPhoneNumber = parsePhoneNumber(
      `+${userInputs.phoneNumber.length > 3 ? userInputs.phoneNumber : "123"}`,
      countryCode
    );

    if (parsedPhoneNumber && !parsedPhoneNumber.isValid()) {
      err.phoneNumber = "Please enter a valid phone no.";
    }

    if (userInputs.password === "") {
      err.password = "please enter password";
    }
    if (userInputs.confirmPassword === "") {
      err.confirmPassword = "please enter confirm password";
    }

    if (userInputs.confirmPassword !== userInputs.password) {
      err.confirmPassword = "confirm password must be same as password";
    }

    if (!validatePassword(userInputs.password)) {
      err.password =
        "Password must have at least one uppercase, lowercase, number, and special character";
    }

    if (
      err.confirmPassword ||
      err.password ||
      err.userName ||
      err.email ||
      err.phoneNumber
    ) {
      setErrors(err);
      return false;
    }

    return true;
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

  const createNewUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!validate(userInputs)) return;

      setIsLoading(true);
      const payload: UserPayload = {
        userName: userInputs.userName,
        email: userInputs.email,
        password: userInputs.password,
        phoneNumber: userInputs.phoneNumber,
      };

      const response = await api.signUpUser(payload);
      if (response) {
        setUserInputs(defaultUserInputs);
        navigate("/login");
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
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
                icon={faUserPlus}
                className="text-primary"
                size="2xl"
              />
            </div>
            <h3 className="mb-4">Sign up</h3>
            <Form onSubmit={createNewUser}>
              <FormGroup className="mb-2">
                <Form.Control
                  type="text"
                  autoFocus
                  value={userInputs.userName}
                  placeholder="User Name"
                  title="User Name"
                  isInvalid={!!errors.userName}
                  onChange={(e) => {
                    setUserInputs({
                      ...userInputs,
                      userName: e.target.value,
                    });
                    setErrors({
                      ...errors,
                      userName: "",
                    });
                  }}
                />
                {feedbackError("userName")}
              </FormGroup>
              <Form.Group className="mb-2">
                <PhoneInput
                  country={countryCode.toLowerCase()}
                  autoFormat
                  value={userInputs.phoneNumber}
                  onChange={(e, code: CountryData) => {
                    setUserInputs({
                      ...userInputs,
                      phoneNumber: e,
                    });
                    setErrors({
                      ...errors,
                      phoneNumber: "",
                    });
                    if (code) {
                      setCountryCode(
                        code.countryCode.toUpperCase() as CountryCode
                      );
                    }
                  }}
                  isValid={(inputNumber, country, countries) => {
                    return countries.some((country: any) => {
                      return (
                        startsWith(inputNumber, country.dialCode) ||
                        startsWith(country.dialCode, inputNumber)
                      );
                    });
                  }}
                  buttonStyle={{ ...buttonStyle }}
                  inputStyle={{ ...inputStyle }}
                  searchStyle={{ ...searchStyle }}
                  containerClass=" border rounded-3"
                />
                {feedbackError("phoneNumber")}
              </Form.Group>

              <FormGroup className="mb-2">
                <Form.Control
                  type="text"
                  placeholder="Email"
                  title="email"
                  value={userInputs.email}
                  onChange={(e) => {
                    setUserInputs({
                      ...userInputs,
                      email: e.target.value,
                    });
                    setErrors({
                      ...errors,
                      email: "",
                    });
                  }}
                />
                {feedbackError("email")}
              </FormGroup>
              <FormGroup className="mb-2">
                <InputGroup>
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    placeholder="password"
                    value={userInputs.password}
                    title="password"
                    onChange={(e) => {
                      setUserInputs({
                        ...userInputs,
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
              </FormGroup>
              <FormGroup className="mb-4">
                <InputGroup>
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    placeholder="confirm password"
                    value={userInputs.confirmPassword}
                    title="confirm password"
                    onChange={(e) => {
                      setUserInputs({
                        ...userInputs,
                        confirmPassword: e.target.value,
                      });
                      setErrors({
                        ...errors,
                        confirmPassword: "",
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
                {feedbackError("confirmPassword")}
              </FormGroup>
              <button
                type="submit"
                className="btn btn-primary shadow-2 mb-4 px-3"
              >
                Sign up
              </button>
              <p className="mb-0 text-muted">
                All ready have an account? <Link to={"/login"}>Log in</Link>
              </p>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
