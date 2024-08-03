import React, { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import style from "./styles/Login.module.scss";
import Input from "../../components/Core/Input";
import Button from "../../components/Core/Button";
import Text from "../../components/Core/Text";
import users from "../../data/user.json";
import { api } from "../../services";
import AuthContext from "../../context/AuthContext";
import { RecoveryContext } from "../../context/RecoveryContext";
import GoogleLogin from "./GoogleLogin";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Alert, MicroLoading } from "../../microInteraction";

const Login = () => {
  const navigate = useNavigate();
  const { setEmail } = useContext(RecoveryContext);
  const authCtx = useContext(AuthContext);
  const [alert, setAlert] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [shouldNavigate, setShouldNavigate] = useState(false);
  const [navigatePath, setNavigatePath] = useState("/");
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (alert) {
      const { type, message, position, duration } = alert;
      Alert({ type, message, position, duration });
    }
  }, [alert]);

  useEffect(() => {
    if (shouldNavigate) {
      navigate(navigatePath);
      setShouldNavigate(false); // Reset state after navigation
    }
  }, [shouldNavigate, navigatePath, navigate]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    if (email === "" || password === "") {
      setAlert({
        type: "error",
        message: "Please fill all the fields",
        position: "bottom-right",
        duration: 3000,
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.post("/api/auth/login", { email, password });

      if (response.status === 200 || response.status === 201) {
        const user = response.data.user;

        setAlert({
          type: "success",
          message: "Login successful",
          position: "bottom-right",
          duration: 2800,
        });

        setNavigatePath(sessionStorage.getItem("prevPage") || "/");

        setTimeout(() => {
          setShouldNavigate(true);
        }, 2800);

        setTimeout(() => {
          authCtx.login(
            user.name,
            user.email,
            user.img,
            user.rollNumber,
            user.school,
            user.college,
            user.contactNo,
            user.year,
            user.extra?.github,
            user.extra?.linkedin,
            user.extra?.designation,
            user.regForm,
            user.access,
            "someToken",
            3600000
          );
        }, 3000);

        sessionStorage.removeItem("prevPage"); // Clean up
      } else {
        setAlert({
          type: "error",
          message: response.data.message || "Invalid email or password",
          position: "bottom-right",
          duration: 3000,
        });
      }
    } catch (error) {
      setAlert({
        type: "error",
        message: "There was an error logging in. Please try again.",
        position: "bottom-right",
        duration: 3000,
      });
      console.error("Error logging in:", error);

      //using fallback data for testing
      const user = users.find(
        (user) => user.email === email && user.password === password
      );

      setAlert({
        type: "success",
        message: "Logging in using fallback data",
        position: "bottom-right",
        duration: 2800,
      });

      setNavigatePath(sessionStorage.getItem("prevPage") || "/");

      setTimeout(() => {
        setShouldNavigate(true);
      }, 2800);

      setTimeout(() => {
        if (user) {
          authCtx.login(
            user.name,
            user.email,
            user.img,
            user.rollNumber,
            user.school,
            user.college,
            user.contactNo,
            user.year,
            user.github,
            user.linkedin,
            user.designation,
            user.regForm,
            user.access,
            "someToken",
            3600000
          );
        }
      }, 3000);

      sessionStorage.removeItem("prevPage"); // Clean up
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgot = () => {
    setEmail(email);
    navigate("/ForgotPassword");
  };

  return (
    <div>
      <div className={style.container}>
        <Link to={"/"}>
          <div className={style.ArrowBackIcon}>
            <ArrowBackIcon />
          </div>
        </Link>
        <div className={style.circle}>
          <div></div>
        </div>
        <div className={style.circle1}></div>
        <div className={style.login}>
          <h1
            style={{
              paddingTop: "10px",
              background: "var(--primary)",
              width: "20%",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            Login
          </h1>
          <GoogleLogin />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <div className={style.divider} />
            <p
              style={{
                color: "#fff",
                textAlign: "center",
                marginBottom: "0.2rem",
              }}
            >
              or
            </p>
            <div className={style.divider} />
          </div>
          <form className={style.form} onSubmit={handleLogin}>
            <Input
              type="text"
              placeholder="eg:something@gmail.com"
              label="Email"
              name="email"
              value={email}
              onChange={(e) => setemail(e.target.value)}
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
              onClick={handleForgot}
              variant="secondary"
              style={{
                fontSize: "0.7rem",
                cursor: "pointer",
                width: "30%",
                background: "var(--primary)",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              Forget Password?
            </Text>
            <Button
              type="submit"
              style={{
                width: "98%",
                background: "var(--primary)",
                color: "#fff",
                height: "40px",
                marginTop: "20px",
                fontSize: "1rem",
                cursor: "pointer",
                marginLeft: "0.4rem",
              }}
              disabled={isLoading}
            >
              {isLoading ? <MicroLoading /> : "Login"}
            </Button>
            <Text
              style={{
                fontSize: "0.8rem",
                textAlign: "center",
                marginTop: "14px",
              }}
            >
              Don't have an account?{" "}
              <Link
                to="/signup"
                onClick={(e) => {
                  sessionStorage.setItem("prevPage", window.location.pathname);
                }}
                style={{
                  background: "var(--primary)",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                }}
              >
                Sign Up
              </Link>
            </Text>
          </form>
        </div>
      </div>
      <Alert />
    </div>
  );
};

export default Login;
