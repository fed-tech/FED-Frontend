import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import style from "./style/Signup.module.scss";

// OAuth
import { useGoogleLogin } from "@react-oauth/google";

// Axios for HTTP requests
import axios from "axios";

// State
import AuthContext from "../../../store/AuthContext";

import google from "../../../assets/images/google.png";
import CompleteProfile from "./CompleteProfile";
import { useEffect } from "react";

export default function GoogleSignup() {
  const [passData, setGoogleData] = useState([]);
  const [codeResponse,setCodeResponse]=useState();
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) =>setCodeResponse(tokenResponse),
    onError: (error) => console.error('Login failed:', error),
  });


    useEffect(()=>{
    handleLoginSuccess()
    },[codeResponse])
  const handleLoginSuccess = async () => {
    try {
      // Fetch user info from Google API using the access token with axios
      const googleResponse = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${codeResponse.access_token}`
      );
     
      const userInfo = googleResponse.data;
      const mail  = userInfo.email;
      console.log('Google user info:', userInfo);
       setGoogleData(userInfo);
      //  console.log(passData);
     
      const response = await axios.post("/auth/googleverification", {
        email: userInfo.email,
      });

      if (response.status===202) {
        authCtx.login(
          response.data.user.name,
          response.data.user.email,
          response.data.user.img,
          response.data.user.RollNumber,
          response.data.user.School,
          response.data.user.College,
          response.data.user.MobileNo,
          response.data.user.selected,
          response.data.user.regForm,
          Number(response.data.user.access),
          response.data.token,
          // 10800000
        );

        if (!authCtx.target) {
          window.history.back();
        } else {
          navigate(`/${authCtx.target}`);
          authCtx.settarget(null);
        }
      } else {
        setGoogleData(googleResponse.data);
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };


  // console.log(passData);

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
      <img
        src={google}
        alt="google"
        style={{
          width: "18px",
          height: "18px",
          marginRight: "6px",
        }}
      />
      <span>Sign Up with Google</span>
    </button>
  <CompleteProfile data={passData} set={setGoogleData}/>
    </>
  );
}
