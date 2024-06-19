import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import style from "./styles/Login.module.scss";
import Input from "../../../components/Core/Input";
import Button from "../../../components/Core/Button";
import Text from "../../../components/Core/Text";
import google from "../../../assets/images/google.png";
import users from "../../../data/user.json";
import AuthContext from "../../../store/AuthContext";
import { useContext } from "react";
import { useEffect } from "react";
// import { GoogleOAuthProvider } from "@react-oauth/google";
import GoogleLogin from "./GoogleLogin";
import { Link } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack"

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const authCtx = useContext(AuthContext);

  const handleLogin = () => {
    event.preventDefault();
    if (email === "" || password === "") {
      alert("Please fill all the fields");
      return;
    }

    const user = users.find(
      (user) => user.email === email && user.password === password
    );

    if (user) {
      authCtx.login(
        user.name,
        user.email,
        user.pic,
        user.rollNo,
        user.school,
        user.college,
        user.mobileNo,
        user.selected,
        user.regForm,
        user.access,
        "someToken",
        3600000
      );
      navigate("/");
      alert("Login successful");
      console.log(authCtx);
      // Redirect to profile or dashboard
    } else {
      alert("Invalid email or password");
    }
  };
  return (
    <div>
      <div className={style.container}>
        <Link to={'/'}>
          <div className={style.ArrowBackIcon}>
            <ArrowBackIcon />
          </div>
        </Link>
        <div className={style.circle}>
          <div></div>
        </div>

        <div className={style.circle1}></div>
        <div className={style.login}>
          <h1>Login</h1>

          <GoogleLogin />

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: "20px 0 4px 0",
            }}
          >
            <div className={style.divider} />
            <p style={{ color: "#fff", textAlign: "center" }}>or</p>
            <div className={style.divider} />
          </div>
          <form>
            <Input
              type="text"
              placeholder="eg:something@gmail.com"
              label="Email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "98%",
              }}
            />
            <Input
              type="password"
              placeholder="Enter your password"
              label="Password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "98%",
              }}
            />
            <Text
              variant="secondary"
              style={{
                fontSize: "0.7rem",
              }}
            >
              Forget Password?
            </Text>
            <Button
              style={{
                width: "100%",
                backgroundColor: "#ff6b00",
                color: "#fff",
                height: "40px",
                marginTop: "20px",
                fontSize: "1rem",
                cursor: "pointer",
                border: "1px solid #fff",
              }}
              onClick={(e) => {
                handleLogin();
              }}
            >
              Login
            </Button>
            <Text
              style={{
                fontSize: "0.7rem",
                textAlign: "center",
                marginTop: "14px",
              }}
            >
              Don't have an account?{" "}
              <a
                href="/signup"
                style={{
                  color: "#FF8A00",
                }}
              >
                Sign Up
              </a>
            </Text>
          </form>
        </div>
        <div className={style.sideImage}></div>
      </div>
    </div>
  );
};

export default Login;
