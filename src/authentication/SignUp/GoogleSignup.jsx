import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./style/Signup.module.scss";

import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import AuthContext from "../../context/AuthContext";
import google from "../../assets/images/google.png";
import users from "../../data/user.json";
import { Alert, MicroLoading } from "../../microInteraction";
import { api } from "../../services";

export default function GoogleSignup({setAlert}) {
  // const [alert, setAlert] = useState(null);
  const [codeResponse, setCodeResponse] = useState(null);
  const [shouldNavigate, setShouldNavigate] = useState(false);
  const [navigatePath, setNavigatePath] = useState("/");
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const signUp = useGoogleLogin({
    onSuccess: (tokenResponse) => setCodeResponse(tokenResponse),
    onError: (error) => console.error("SignUp failed:", error),
  });

  useEffect(() => {
    if (codeResponse) {
      handleSignUpSuccess();
    }
  }, [codeResponse]);

  // useEffect(() => {
  //   // if (alert) {
  //     // const { type, message, position, duration } = alert;
  //     // Alert({ type, message, position, duration });
  //     setAlert(null); // Reset alert after displaying it
  //   // }
  // }, []);

  useEffect(() => {
    if (shouldNavigate) {
      navigate(navigatePath);
      setShouldNavigate(false); // Reset state after navigation
    }
  }, [shouldNavigate, navigatePath, navigate]);

  const handleSignUpSuccess = async () => {
    setIsLoading(true);
    try {
      const googleResponse = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${codeResponse.access_token}`
      );

      if (googleResponse.status !== 200) {
        // Handle the case where Google response is not successful
        console.error("Google SignUp failed:", googleResponse);
        setAlert({
          type: "error",
          message: "Google SignUp failed. Please try again.",
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
        const response = await api.post("/api/auth/googleSignUp", {
          email: googleUserData.email,
        });

        if (response.status === 200 || response.status === 201) {
          // User exists in the backend
          const userData = response.data.user;

          setAlert({
            type: "success",
            message: "User Already Registered! Logged In successfully",
            position: "bottom-right",
            duration: 3000,
          });
          setNavigatePath("/");
          sessionStorage.removeItem("prevPage"); // Clean up

          setTimeout(() => {
            authCtx.login(
              userData.name,
              userData.email,
              userData.image,
              userData.rollNumber,
              userData.school,
              userData.college,
              userData.contactNo,
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
        } else {
          // Handle unexpected response status
          console.log("Unexpected backend response status:", response.status);
          handleFallbackOrCompleteProfile(googleUserData, googleResponse);
        }
      } catch (error) {
        // API call error, fallback to local data
        console.error("Backend API call failed:", error);
        handleFallbackOrCompleteProfile(googleUserData, googleResponse);
      }
    } catch (error) {
      console.error("SignUp error:", error);
      setAlert({
        type: "error",
        message: "There was an error Signing Up. Please try again.",
        position: "bottom-right",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFallbackOrCompleteProfile = async (
    googleUserData,
    googleResponse
  ) => {
    // User does not exist in the backend, use fallback local data
    console.log("User not registered in backend, using fallback data");
    const fallbackUser = users.find(
      (user) => user.email === googleUserData.email
    );

    if (fallbackUser) {

      setAlert({
        type: "success",
        message: "User already Registered, Logging In using fallback data",
        position: "bottom-right",
        duration: 3000,
      });
      setNavigatePath("/");
      sessionStorage.removeItem("prevPage");

      setTimeout(() => {
        authCtx.login(
          fallbackUser.name,
          fallbackUser.email,
          googleUserData.image,
          fallbackUser.rollNumber,
          fallbackUser.school,
          fallbackUser.college,
          fallbackUser.contactNo,
          fallbackUser.year,
          fallbackUser.github,
          fallbackUser.linkedin,
          fallbackUser.designation,
          fallbackUser.regForm,
          fallbackUser.access,
          "someToken",
          3600000
        );
        setShouldNavigate(true);
      }, 3000);
    } else {
      navigate("/completeProfile", {
        state: { data: googleResponse.data },
      });
    }
  };

  //     console.log("Google User Data:", data);
  //     const user = users.find((user) => user.email === data.email);

  //     if (user) {
  //       // setAlert({
  //       //   type: "info",
  //       //   message: "Already registered. Please log in.",
  //       //   position: "bottom-right",
  //       //   duration: 3000,
  //       // });
  //       setNavigatePath("/login");
  //       setShouldNavigate(true);
  //       // setTimeout(() => {
  //       //   setShouldNavigate(true);
  //       // }, 3000);
  //     } else {
  //       // User is not registered, navigate to CompleteProfile with state
  //       navigate("/completeProfile", { state: { data: userInfo } });
  //     }
  //   } catch (error) {
  //     console.error("SignUp error:", error);
  //     // setAlert({
  //     //   type: "info",
  //     //   message: "An error occurred during login. Please try again.",
  //     //   position: "bottom-right",
  //     //   duration: 3000,
  //     // });
  //   }
  // };

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
        className={styles.google_btn}
        onClick={signUp}
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
            <span>SignUp with Google</span>
          </>
        )}
      </button>
    </>
  );
}
