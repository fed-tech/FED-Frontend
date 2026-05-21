/* eslint-disable react/no-unescaped-entities */
import React, { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import style from "./styles/Login.module.scss";
import Input from "../../components/Core/Input";
import Button from "../../components/Core/Button";
import Text from "../../components/Core/Text";
import { api } from "../../services";
import AuthContext from "../../context/AuthContext";
import { RecoveryContext } from "../../context/RecoveryContext";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import GoogleIcon from "@mui/icons-material/Google";
import { Alert, MicroLoading } from "../../microInteraction";
import heroBgImage from "../../assets/images/herobgimage.png";

const Login = () => {
  const navigate = useNavigate();
  const { setEmail } = useContext(RecoveryContext);
  const authCtx = useContext(AuthContext);

  const [mode, setMode] = useState("select");
  const [alert, setAlert] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [email, setEmailState] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (alert) Alert(alert);
  }, [alert]);

  /* ---------------- GOOGLE LOGIN ---------------- */

  const handleGoogleLogin = async (tokenResponse) => {
    setIsGoogleLoading(true);

    try {
      const response = await api.post("/api/auth/googleAuth", {
        access_token: tokenResponse.access_token,
      });

      const user = response.data.user;

      localStorage.setItem("token", response.data.token);

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
        user.access,
        user.editProfileCount,
        user.regForm,
        user.blurhash,
        response.data.token,
        9600000
      );

      setAlert({
        type: "success",
        message: "Login successful",
        position: "bottom-right",
        duration: 2400,
      });

      const nextPath = sessionStorage.getItem("prevPage") || "/";
      sessionStorage.removeItem("prevPage");

      setTimeout(() => navigate(nextPath), 600);
    } catch (error) {
      setAlert({
        type: "error",
        message: "There was an error logging in. Please try again.",
        position: "bottom-right",
        duration: 2500,
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: handleGoogleLogin,
    onError: () => {
      setAlert({
        type: "error",
        message: "Google login failed. Please try again.",
        position: "bottom-right",
        duration: 2500,
      });
    },
  });

  /* ---------------- EMAIL LOGIN ---------------- */

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setAlert({
        type: "error",
        message: "Fill all fields",
        position: "bottom-right",
        duration: 2500,
      });
      return;
    }

    setIsLoading(true);

    try {
      const res = await api.post("/api/auth/login", {
        email: email.toLowerCase(),
        password,
      });

      const user = res.data.user;

      localStorage.setItem("token", res.data.token);

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
        user.access,
        user.editProfileCount,
        user.regForm,
        user.blurhash,
        res.data.token,
        9600000
      );

      setAlert({
        type: "success",
        message: "Login successful",
        position: "bottom-right",
        duration: 2000,
      });

      const nextPath = sessionStorage.getItem("prevPage") || "/";
      sessionStorage.removeItem("prevPage");

      setTimeout(() => navigate(nextPath), 600);
    } catch (err) {
      setAlert({
        type: "error",
        message:
          err?.response?.data?.message || "Invalid email or password",
        position: "bottom-right",
        duration: 2500,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgot = () => {
    setEmail(email);
    navigate("/ForgotPassword");
  };

  /* ---------------- UI ---------------- */

  return (
    <div
      className={style.authShell}
      style={{ "--auth-bg-image": `url(${heroBgImage})` }}
    >
      <Link to="/" className={style.backBtn}>
        <ArrowBackIcon />
      </Link>

      <div className={style.card}>
        <h1 className={style.title}>Welcome Back</h1>
        <p className={style.subtitle}>Sign in to continue</p>

        {/* -------- SELECT MODE -------- */}
        {mode === "select" && (
          <div className={style.options}>
            <button
              className={style.socialButton}
              onClick={() => loginWithGoogle()}
              type="button"
              disabled={isGoogleLoading}
            >
              {isGoogleLoading ? (
                <MicroLoading />
              ) : (
                <>
                  <GoogleIcon className={style.socialIcon} />
                  Continue with Google
                </>
              )}
            </button>

            <div className={style.dividerRow}>
              <span className={style.line}></span>
              <span className={style.or}>OR</span>
              <span className={style.line}></span>
            </div>

            <button
              className={style.emailOption}
              onClick={() => setMode("email")}
              type="button"
            >
              <MailOutlineIcon className={style.mailIcon} />
              Continue with Email
            </button>

            <Text className={style.bottomText}>
              Don't have an account{" "}
              <Link to="/signup" className={style.linkAccent}>
                Sign Up
              </Link>
            </Text>
          </div>
        )}

        {/* -------- EMAIL MODE -------- */}
        {mode === "email" && (
          <div className={style.emailFormWrapper}>
            <button
              className={style.switchBack}
              onClick={() => setMode("select")}
              type="button"
            >
              <ArrowBackIcon className={style.backIcon} />
              <span>Back</span>
            </button>

            <form onSubmit={handleLogin} className={style.form}>
              <Input
                type="email"
                label="Email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmailState(e.target.value)}
                required
              />

              <Input
                type="password"
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <div className={style.formFooter}>
                <Text onClick={handleForgot} className={style.forgot}>
                  Forgot password?
                </Text>
              </div>

              <Button
                type="submit"
                className={style.submitBtn}
                disabled={isLoading}
              >
                {isLoading ? <MicroLoading /> : "Login"}
              </Button>
            </form>
          </div>
        )}
      </div>

      <Alert />
    </div>
  );
};

export default Login;