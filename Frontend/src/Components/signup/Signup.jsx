import React, { useEffect, useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import "./login.css";

function Signup() {
  const [imageURL, setImageURL] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const history = useHistory();

  const email = useRef();
  const password = useRef();
  const name = useRef();

  const handleClick = (e) => {
    e.preventDefault();
    if (
      !email.current.value ||
      !password.current.value ||
      !name.current.value
    ) {
      setErrorMessage("Please all of the fields");
      setIsError(true);
      return;
    } else {
      isError && setIsError(false);
      setIsSigning(true);

      const dataToBePost = {
        name: name.current.value,
        email: email.current.value,
        password: password.current.value,
        pic: imageURL ? imageURL : "",
      };

      let responseStatusOk = false;
      fetch("http://localhost:5000/api/user/", {
        method: "POST", // Corrected method name
        headers: {
          "Content-Type": "application/json", // Setting content type to JSON
        },
        body: JSON.stringify(dataToBePost),
      })
        .then((response) => {
          if (response.status === 200) {
            responseStatusOk = true;
          }
          return response.json();
        })
        .then((data) => {
          if (responseStatusOk) {
            history.push("/chats");
            localStorage.setItem("userData", JSON.stringify(data));
            setIsSigning(false);
          } else {
            setIsError(true);
            setErrorMessage(data.message);
            setIsSigning(false);
          }
        })
        .catch((error) => console.error("Error:", error));
    }
  };

  const handleFileChange = (image) => {
    setIsUploading(true);
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "tohco7vu");

    fetch(`https://api.cloudinary.com/v1_1/difavbhph/image/upload`, {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setImageURL(data.secure_url);
        setIsUploading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsUploading(false);
      });
  };

  return (
    <div className="loginParent">
      <div className="loginWrapper">
        <div className="logo">
          <h1 className="logo-main">Vortex Verse</h1>
          <p className="slogan">
            Vortext Verse - Where Conversations Unfold in Real Time Excellence.
          </p>
        </div>

        <form className="loginForm" onSubmit={handleClick}>
          <div className="login-container">
            <input
              placeholder="name"
              type="name"
              required
              ref={name}
              maxLength={50}
              className="loginInput"
            />
            <input
              placeholder="Email"
              type="Email"
              required
              ref={email}
              maxLength={50}
              className="loginInput"
            />
            <input
              placeholder="Password"
              required
              ref={password}
              minLength={8}
              type="password"
              className="loginInput"
            />
            <label htmlFor="profile-pic" className="label-profile-pic">
              Add Profile Picture
            </label>
            <input
              id="profile-pic"
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e.target.files[0])}
              className="fileInput"
            />

            <p
              className="errroMessage"
              style={{ display: isError ? "block" : "none" }}
            >
              {errorMessage}
            </p>
            <button
              className="loginBtn"
              style={{ backgroundColor: isUploading ? "#B0B2EB" : "#1775ee" }}
              type="submit"
            >
              {isUploading ? (
                "uploading..."
              ) : !isSigning ? (
                "Sign Up"
              ) : (
                <div className="loader"></div>
              )}
            </button>
            <Link to="/login">
              {" "}
              <p className="registraion-asker">have an account?</p>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
