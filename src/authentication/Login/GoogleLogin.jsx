import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import style from "../SignUp/style/Signup.module.scss";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import users from "../../data/user.json";
import AuthContext from "../../context/AuthContext";
import google from "../../assets/images/google.png";
import { Alert, MicroLoading } from "../../microInteraction";
import { api } from "../../services";

export default function GoogleLogin() {
  const [alert, setAlert] = useState(null);
  const [codeResponse, setCodeResponse] = useState(null);
  const [shouldNavigate, setShouldNavigate] = useState(false);
  const [navigatePath, setNavigatePath] = useState("/");
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => setCodeResponse(tokenResponse),
    onError: (error) => console.error("Login failed:", error),
  });

  useEffect(() => {
    if (codeResponse) {
      handleLoginSuccess();
    }
  }, [codeResponse]);

  useEffect(() => {
    if (alert) {
      const { type, message, position, duration } = alert;
      Alert({ type, message, position, duration });
      setAlert(null); // Reset alert after displaying it
    }
  }, [alert]);

  useEffect(() => {
    if (shouldNavigate) {
      navigate(navigatePath);
      setShouldNavigate(false); // Reset state after navigation
    }
  }, [shouldNavigate, navigatePath, navigate]);

  const handleLoginSuccess = async () => {
    setIsLoading(true);
    try {
      const googleResponse = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${codeResponse.access_token}`
      );

      if (googleResponse.status !== 200) {
        // Handle the case where Google response is not successful
        console.error("Google login failed:", googleResponse);
        setAlert({
          type: "error",
          message: "Google login failed. Please try again.",
          position: "bottom-right",
          duration: 3000,
        });
        return;
      }

      const googleUserData = {
        email: googleResponse.data.email,
        image: googleResponse.data.picture,
      };

      console.log("Google User Data:", googleUserData);

      try {
        // Send a POST request to the backend to check if the user exists
        const response = await api.post("/api/auth/googleLogin", {
          email: googleUserData.email,
        });

        if (response.status === 200 || response.status === 201) {
          // User exists in the backend
          const userData = response.data.user;

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
              userData.name,
              userData.email,
              userData.image,
              userData.rollNo,
              userData.school,
              userData.college,
              userData.mobileNo,
              userData.year,
              userData.github,
              userData.linkedin,
              userData.designation,
              userData.regForm,
              userData.access,
              "someToken",
              3600000
            );
            setShouldNavigate(true);
          }, 3000);

          sessionStorage.removeItem("prevPage"); // Clean up
        } else {
          // Handle unexpected response status
          console.log("Unexpected backend response status:", response.status);
          handleFallbackOrSignup(googleUserData);
        }
      } catch (error) {
        // API call error, fallback to local data
        console.error("Backend API call failed:", error);
        handleFallbackOrSignup(googleUserData);
      }
    } catch (error) {
      console.error("Login error:", error);
      setAlert({
        type: "error",
        message: "There was an error logging in. Please try again.",
        position: "bottom-right",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFallbackOrSignup = async (googleUserData) => {
    // User does not exist in the backend, use fallback local data
    console.log("User not registered in backend, using fallback data");
    const fallbackUser = users.find(
      (user) => user.email === googleUserData.email
    );

    if (fallbackUser) {
      setAlert({
        type: "success",
        message:
          "User not registered in backend, Logging In using fallback data",
        position: "bottom-right",
        duration: 2800,
      });

      setNavigatePath(sessionStorage.getItem("prevPage") || "/");

      setTimeout(() => {
        setShouldNavigate(true);
      }, 2800);

      setTimeout(() => {
        authCtx.login(
          fallbackUser.name,
          fallbackUser.email,
          googleUserData.image,
          fallbackUser.rollNo,
          fallbackUser.school,
          fallbackUser.college,
          fallbackUser.mobileNo,
          fallbackUser.year,
          fallbackUser.github,
          fallbackUser.linkedin,
          fallbackUser.designation,
          fallbackUser.regForm,
          fallbackUser.access,
          "someToken",
          3600000
        );
      }, 3000);

      sessionStorage.removeItem("prevPage"); // Clean up
    } else {
      setAlert({
        type: "info",
        message: "User not registered, kindly register first",
        position: "bottom-right",
        duration: 3000,
      });
      setNavigatePath("/signup");
      setTimeout(() => {
        setShouldNavigate(true);
      }, 3000);
    }
  };

  return (
    <>
      <button
        style={{
          backgroundColor: "transparent",
          color: "#fff",
          height: "40px",
          marginTop: "20px",
          fontSize: ".77rem",
          cursor: "pointer",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        className={style.google_btn}
        onClick={login}
      >
        {isLoading ? (
          <MicroLoading />
        ) : (
          <>
            <img
              src={google}
              alt="google"
              style={{
                width: "18px",
                height: "18px",
                marginRight: "6px",
              }}
            />
            <span>Login with Google</span>
          </>
        )}
      </button>
      <Alert />
    </>
  );
}
