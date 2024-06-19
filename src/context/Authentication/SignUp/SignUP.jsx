import  { useState } from "react";
import style from "./style/Signup.module.scss";
import Input from "../../../components/Core/Input";
import Button from "../../../components/Core/Button";
import Text from "../../../components/Core/Text";
import GoogleSignup from "./GoogleSignup";
import bcrypt from "bcryptjs"
import { useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
// import Load from "../../../microInteraction/Load/Load"
const SignUP = () => {

  useEffect(()=>{
    window.scrollTo(0,-20)
  })
 

  // const [loadingEffect, setLoad] = useState(false);

  const [showUser, setUser] = useState({
    email: "",
    Password: "",
    FirstName: "",
    LastName: "",
    RollNumber: "",
    School: "",
    College: "",
    MobileNo: "+91",
    year:""

  });

  const DataInp = (name, value) => {
    setUser({ ...showUser, [name]: value });
  };

  const handleSignup = async(e) => {
    e.preventDefault();

    const {
      email,
      Password,
      FirstName,
      LastName,
      RollNumber,
      School,
      College,
      MobileNo,
      year,
    } = showUser;

    const name = FirstName + " " + LastName;

    if (
      name !== "" &&
      RollNumber !== "" &&
      School !== "" &&
      College !== "" &&
      MobileNo !== "" &&
      MobileNo.length <= 12 &&
      MobileNo.length >= 10 &&
      email !== "" &&
      Password !== "" &&
      year !== "" 
    ) {
        // setLoad(true);
        const password = bcrypt.hashSync(Password, import.meta.env.VITE_BCRYPT);
        const userObject = {
          name,
          email,
          password,
          RollNumber,
          School,
          College,
          MobileNo,
          year,
        };

        try {
           console.log(userObject);
          const response = await axios.post(`/auth/register`, userObject);
           console.log(response);  
          if(response.status==200){
            setLoad(false);
            console.log("verifiatin Link has been sent");
          }


    }
    catch(error){
      //  setLoad(false);

       if(error.response.data.code===1){
         console.log("user already axist");
         return;
       }
       if(error.response.data.code===2){
          console.log("invalid email format");
          return;
       }else{
        console.log("An unexpected error occured");
        return;
       }

    }

  }else{
    console.log("invalid details enter again");
  }
};

  return (
    <div style={{width:"100vw" ,position:"relative"}}>
      <div className={style.container} style={{
        zIndex:"10",
      }}>
      <div className={style.circle}>
              <div></div>
             </div>

        <div className={style.circle1}></div>
        <Link to={'/'}>
          <div className={style.ArrowBackIcon}>
            <ArrowBackIcon />
          </div>
        </Link>
        <div className={style.signin}>
          <h2>Sign Up</h2>
    
       
            <GoogleSignup />
       
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: "15px 0 4px 0",
            }}
          >
            <div className={style.divider} />
            <p style={{ color: "#fff", textAlign: "center" }}>or</p>
            <div className={style.divider} />
          </div>
          <form onSubmit={handleSignup}>
            <div  style={{ display: "flex" }}>
              <div style={{ width: "50%" }}>
                <Input
                  type="text"
                  placeholder="First Name"
                  label="First Name"
                  name="FirstName"
                  onChange={(e) => DataInp(e.target.name, e.target.value)}
                  required
                  style={{ width: "96%" }}
                />
              </div>
              <div style={{ width: "50%" }}>
                <Input
                  type="text"
                  placeholder="Last Name"
                  label="Last Name"
                  name="LastName"
                  onChange={(e) => DataInp(e.target.name, e.target.value)}
                  required
                  style={{ width: "96%",height:"80%" }}
                />
              </div>
            </div>
            <div style={{ display: "flex" }}>
              <div style={{ width: "50%" }}>
                <Input
                  type="email"
                  placeholder="eg.-myemail@gmail.com"
                  label="Email"
                  name="email"
                  onChange={(e) => DataInp(e.target.name, e.target.value)}
                  required
                  style={{ width: "96%" }}
                />
              </div>
              <div style={{ width: "50%" }}>
                <Input
                  type="text"
                  placeholder="1234567890"
                  label="Mobile"
                  name="MobileNo"
                  onChange={(e) => DataInp(e.target.name, e.target.value)}
                  required
                  style={{ width: "96%" }}
                />
              </div>
            </div>
            <div style={{ display: "flex", gap: "2%" }}>
              <div style={{ width: "48%" }}>
                <Input
                  type="select"
                  placeholder="College Name"
                  label="College"
                  name="College"
                  options={[
                    {
                      label: "Kalinga Institute of Industrial Technology",
                      value: "Kalinga Institute of Industrial Technology",
                    },
                  ]}
                  value={showUser.College}
                  onChange={(value) => DataInp("College", value)}
                  required
                  style={{ width: "96%" }}
                />
              </div>
              <div style={{ width: "50%" }}>
                <Input
                  type="text"
                  placeholder="School"
                  label="School"
                  name="School"
                  onChange={(e) => DataInp(e.target.name, e.target.value)}
                  required
                  style={{ width: "96%" }}
                />
              </div>
            </div>
            <div style={{ display: "flex" }}>
              <div style={{ width: "50%" }}>
                <Input
                  type="text"
                  placeholder="Roll Number"
                  label="Roll Number"
                  name="RollNumber"
                  onChange={(e) => DataInp(e.target.name, e.target.value)}
                  required
                  style={{ width: "96%" }}
                />
              </div>
              <div style={{ width: "47%" }}>
                <Input
                  type="select"
                  placeholder="Select year"
                  label="Year"
                  name="year"
                  options={[
                    { value: "1st", label: "1st year" },
                    { value: "2nd", label: "2nd year" },
                    { value: "3rd", label: "3rd year" },
                    { value: "4th", label: "4th year" },
                    { value: "5th", label: "5th year" },
                  ]}
                  value={showUser.year}
                  onChange={(value) => DataInp("year", value)}
                  required
                  style={{ width: "96%" }}
                />
              </div>
            </div>
            <Input
              type="password"
              placeholder="Enter your password"
              label="Password"
              name="Password"
              onChange={(e) => DataInp(e.target.name, e.target.value)}
              required
              style={{ width: "98%" }}
            />
            <Button
              style={{
                width: "100%",
                backgroundColor: "#ff6b00",
                color: "#fff",
                height: "40px",
                marginTop: "20px",
                fontSize: "1rem",
                cursor: "pointer",
                // border: "1px solid #fff",
              }}
              type="submit"
            >
              Sign Up
            </Button>
            <Text
              style={{
                fontSize: "0.7rem",
                textAlign: "center",
                marginTop: "14px",
              }}
            >
              Already Have an account?{" "}
              <a
                href="/Login"
                style={{ color: "#FF8A00" }}
                
              >
                Login
              </a>
            </Text>
          </form>
        </div>
        <div className={style.sideImage}></div>
      </div>
    </div>
  );
};

export default SignUP;
