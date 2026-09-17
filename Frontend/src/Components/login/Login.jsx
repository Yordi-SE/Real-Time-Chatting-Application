import React, { useState, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import "./newLogin.css";

function Login() {
  const [hasError, setHasError] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const history = useHistory();

  const emailRef = useRef();
  const passwordRef = useRef();

  const handleClick = (e) => {
    e.preventDefault();
    if (!emailRef.current.value || !passwordRef.current.value) {
      setHasError(true);
      setErrorText("Fill in all of the fields");
    } else {
      hasError && setHasError(false);
      setIsLoggingIn(true);
      const loginData = {
        password: passwordRef.current.value,
        email: emailRef.current.value,
      };

      let responseOk = false;

      fetch("http://localhost:5000/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      })
        .then((response) => {
          if (response.status === 200) {
            responseOk = true;
          }
          return response.json();
        })
        .then((data) => {
          if (responseOk) {
            history.push("/chats");
            localStorage.setItem("userData", JSON.stringify(data));
            setIsLoggingIn(false);
          } else {
            setHasError(true);
            setErrorText(data.message);
            setIsLoggingIn(false);
          }
        })
        .catch((error) => console.error("Error:", error));
    }
  };

  return (
    <div className="appContainer">
      <div className="formWrapper">
        <div className="brandLogo">
          <h1 className="mainLogo">Vortex Verse</h1>
          <p className="sloganText">
            Vortext Verse - Where Conversations Unfold in Real Time Excellence.
          </p>
        </div>

        <form className="loginForm" onSubmit={handleClick}>
          <div className="inputContainer">
            <input
              placeholder="Email"
              type="Email"
              required
              ref={emailRef}
              maxLength={50}
              className="textInput"
            />
            <input
              placeholder="Password"
              required
              ref={passwordRef}
              minLength={8}
              type="password"
              className="textInput"
            />
            <p
              className="errorMessage"
              style={{ display: hasError ? "block" : "none" }}
            >
              {errorText}
            </p>
            <button className="loginButton" type="submit">
              {!isLoggingIn ? "Log In" : <div className="loadingSpinner"></div>}
            </button>
            <Link to="/register">
              <p className="registrationLink">Don't have an account?</p>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
