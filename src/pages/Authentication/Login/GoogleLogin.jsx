// import React, { useContext, useState,useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import style from "../../../context/Authentication/SignUp/style/signup.module.scss";

// // OAuth
// import { useGoogleLogin } from "@react-oauth/google";

// // Axios for HTTP requests
// import axios from "axios";

// //mockjson
// import  users from "../../../data/user.json"

// // State
// import AuthContext from "../../../store/AuthContext";

// import google from "../../../assets/images/google.png";
// import CompleteProfile from "../../../context/Authentication/SignUp/CompleteProfile";

// export default function GoogleSignup() {
//   const [passData, setGoogleData] = useState([]);
//   const [codeResponse,setCodeResponse]=useState();
//   const authCtx = useContext(AuthContext);
//   const navigate = useNavigate();

//   const login = useGoogleLogin({
//     onSuccess: (tokenResponse) => setCodeResponse(tokenResponse),
//     onError: (error) => console.error('Login failed:', error),
//   });

//   useEffect(()=>{
//     handleLoginSuccess()
//     },[codeResponse]);

//   const handleLoginSuccess = async () => {
//     try {
//       // Fetch user info from Google API using the access token with axios
//       const googleResponse = await axios.get(
//         `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${codeResponse.access_token}`
//       );
     
   

//        const data ={
//         email:googleResponse.data.email,
//         image:googleResponse.data.picture,
//        };
//        console.log(data);


     
//     //   const response = await axios.post("/auth/googleverification",data
//     //   );

//     // if (response.status===202) {
//     //   authCtx.login(
//     //     response.data.user.name,
//     //     response.data.user.email,
//     //     response.data.user.img,
//     //     response.data.user.RollNumber,
//     //     response.data.user.School,
//     //     response.data.user.College,
//     //     response.data.user.MobileNo,
//     //     response.data.user.selected,
//     //     response.data.user.regForm,
//     //     Number(response.data.user.access),
//     //     response.data.token,
//     //   //   10800000
//     //   );

//     const response = users.find(
//         (user) => user.email === data.email 
//       );
    
//       console.log(response);
//     if (response) {
//       authCtx.login(
//          response.name,
//          response.email,
//         data.image,
//         response.rollNo,
//         response.school,
//         response.college,
//         response.mobileNo,
//         response.selected,
//         response.regForm,
//         Number(response.access),
//         response.token,
//       //   10800000
//       );
//       console.log(authCtx);

     

//       navigate("/profile");
//     //     if (!authCtx.target) {
//     //       window.history.back();
//     //     } else {
//     //       navigate(`/${authCtx.target}`);
//     //       authCtx.settarget(null);
//     //     }
//       } 
//     else {
//         handleLoginError(response);
//       }
//     } catch (error) {
//       console.error('Login error:', error);
//     }
//   };

//   const handleLoginError = (data) => {
//       setGoogleData(data);
//   };
//   // console.log(passData);

//   return (
//     <>
//     <button
//       style={{
//         backgroundColor: "transparent",
//         color: "#fff",
//         height: "40px",
//         marginTop: "20px",
//         fontSize: ".77rem",
//         cursor: "pointer",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//       }}
//       className={style.google_btn}
//       onClick={login}
//     >
//       <img
//         src={google}
//         alt="google"
//         style={{
//           width: "18px",
//           height: "18px",
//           marginRight: "6px",
//         }}
//       />
//       <span>Login with Google</span>
//     </button>
//   <CompleteProfile data={passData} set={setGoogleData}/>
//     </>
//   );
// }




import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import style from "../../../context/Authentication/SignUp/style/Signup.module.scss";

// OAuth
import { useGoogleLogin } from "@react-oauth/google";

// Axios for HTTP requests
import axios from "axios";

// Mock user data
import users from "../../../data/user.json";

// State
import AuthContext from "../../../store/AuthContext";

import google from "../../../assets/images/google.png";
import CompleteProfile from "../../../context/Authentication/SignUp/CompleteProfile";

export default function GoogleLogin() {
  const [passData, setGoogleData] = useState([]);
  const [codeResponse, setCodeResponse] = useState(null);
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => setCodeResponse(tokenResponse),
    onError: (error) => console.error("Login failed:", error),
  });

  useEffect(() => {
    if (codeResponse) {
      handleLoginSuccess();
    }
  }, [codeResponse]);

  const handleLoginSuccess = async () => {
    try {
      // Fetch user info from Google API using the access token with axios
      const googleResponse = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${codeResponse.access_token}`
      );

      const data = {
        email: googleResponse.data.email,
        image: googleResponse.data.picture,
      };

      console.log("Google User Data:", data);

      const user = users.find((user) => user.email === data.email);

      if (user) {
        console.log("User found:", user);

        authCtx.login(
          user.name,
          user.email,
          data.image,
          user.rollNo,
          user.school,
          user.college,
          user.mobileNo,
          user.selected,
          user.regForm,
          user.access,
          "someToken", // Replace with actual token if available
          3600000 // 1 hour expiration time
        );

        console.log("Auth Context after login:", authCtx);
        navigate("/profile");
      } else {
        handleLoginError(data);
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleLoginError = (data) => {
    setGoogleData(data);
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
      </button>
      <CompleteProfile data={passData} set={setGoogleData} />
    </>
  );
}

