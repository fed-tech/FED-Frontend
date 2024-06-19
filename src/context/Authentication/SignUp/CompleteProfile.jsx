import React, { useState, useEffect, useRef, useContext } from "react";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../../components/Core/Input";
import Button from "../../../components/Core/Button";
// import bcrypt from "bcryptjs-react";

import Load from "../../../microInteraction/Load/Load";
import axios from "axios";
import CPCss from "./style/CompleteProfile.module.scss";
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import AuthContext from "../../../store/AuthContext";

function CompleteProfile(props) {
  const [loadingEffect, setLoad] = useState(false);
  // const [DropShow, hideDrop] = useState(false);
  const [year, setYear] = useState("");
  const [showUser, setUser] = useState({
    email: "",
    Password: "",
    name: "",
    RollNumber: "",
    School: "",
    College: "",
    MobileNo: "",
    img: "",
    year:"",

  });



  
  // var setError = props.setError;
  

  const authCtx = useContext(AuthContext);

  const navigate = useNavigate();

  const DataInp = (name, value) => {
    setUser({ ...showUser, [name]: value });
  };



  const handleChange = (event) => {
    setYear(event.target.value);
  };

  const options = [
    { value: "1st", text: "1st year" },
    { value: "2nd", text: "2nd year" },
    { value: "3rd", text: "3rd year" },
    { value: "4th", text: "4th year" },
    { value: "5th", text: "5th year" },
  ];





  const handleCreateProfile = async (e) => {
    e.preventDefault();
    console.log(showUser);

    
    

    const { RollNumber, School, College, MobileNo, tandC } = showUser;

    // if (
    //   props.data.name !== "" &&
    //   props.data.id !== "" &&
    //   props.data.email !== "" &&
    //   props.data.picture !== "" &&
    //   RollNumber !== "" &&
    //   School !== "" &&
    //   College !== "" &&
    //   MobileNo.length === 10 &&
    //   tandC
    // ) {
    //   setLoad(true);
    alert("profile created");

      const password = props.data.id;
      console.log(props.data.email);
  
      const userObject = {
        name: props.data.name,
        email: props.data.email,
        password: password,
        img: props.data.picture,
        RollNumber,
        School,
        College,
        MobileNo,
        year,
      };
      console.log(userObject);

      // try {
      //   const response = await axios.post(`/auth/googleregister`, userObject);

      //   if (response.data.status === true) {
      //     authCtx.login(
      //       response.data.user.name,
      //       response.data.user.email,
      //       response.data.user.img,
      //       response.data.user.RollNumber,
      //       response.data.user.School,
      //       response.data.user.College,
      //       response.data.user.MobileNo,
      //       response.data.user.selected,
      //       response.data.user.regForm,
      //       Number(response.data.user.access),
      //       response.data.token,
      //       10800000
      //     );

      //     props.set(false);

      //     if (authCtx.target == "" || (authCtx.target == null) == "") {
      //       // navigate("/MyProfile");
      //       window.history.back();
      //     } else {
      //       navigate(`/${authCtx.target}`);
      //       authCtx.settarget(null);
      //     }

      //     return;
      //   } else {
      //     setLoad(false);
      //   }
      // } catch (error) {
      //   setLoad(false);

      //   if (error.response.data.code === 1) {
      //     console.log("error code 1");
      //   }
      //   if (error.response.data.code === 2) {
      //     console.log("error code 2");
      //   }
      // }
    // } else {
    //   setLoad(false);

      // if (MobileNo.length !== 10) {
      //   console.log("enter correct mobile no");
      // } else {
      //   console.log("fill all details");
      // }
    
    // }
  };

  return (
<div className={CPCss.mDiv} id={Object.keys(props.data).length > 0 ? CPCss.showCreate : CPCss.hideCreate}>

      <div className={CPCss.mDivCon}>
        <div className={CPCss.ArrowBackIcon} onClick={() => props.set(false)}>
          <ArrowBackIcon />
        </div>
        <div className={CPCss.BackGround}>
        <div>
          <p className={CPCss.CreateProfile}>Create Profile</p>
          <p className={CPCss.Please}>Please enter Your Details</p>
        </div>

       
          <form className={CPCss.FormTag}>
            {/* college */}

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

            {/* Roll number */}

            <Input
              type="text"
              placeholder="Roll Number"
              label="Roll Number"
              name="RollNumber"
              onChange={(e) => DataInp(e.target.name, e.target.value)}
              required
              style={{ width: "100%" }}
            />

            {/* school */}
            <Input
              type="text"
              placeholder="School"
              label="School"
              name="School"
              onChange={(e) => DataInp(e.target.name, e.target.value)}
              required
              style={{ width: "100%" }}
            />
                      

            {/* Phone Number */}

            <Input
                  type="text"
                  placeholder="1234567890"
                  label="Mobile"
                  name="MobileNo"
                  onChange={(e) => DataInp(e.target.name, e.target.value)}
                  required
                  style={{ width: "100%" }}
                />

            <div>
            <label style={{marginLeft:"2%"}} htmlFor="year">year</label>
            <select
              value={year}
              name="year"
              onChange={handleChange}
              className={CPCss.year}
            >
              <option hidden>Year</option>
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.text}
                </option>
              ))}
            </select>
            </div>
        
           <div style={{
            marginLeft:"8px"
           }}>
           <Button
              style={{
                width: "102%",
                backgroundColor: "#ff6b00",
                color: "#fff",
                height: "40px",
                marginTop: "20px",
                fontSize: "1rem",
                cursor: "pointer",
                border: "1px solid #fff",

              }}
              type="submit"
              onClick={handleCreateProfile}
            >
              {loadingEffect ? <Load /> : "Create Profile"}
            </Button>
           </div>
         
          </form>
        </div>
      </div>
    </div>
  );
}

CompleteProfile.propTypes = {};

export default CompleteProfile;
