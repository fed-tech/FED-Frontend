import { useContext, useState } from "react";
import styles from "./style/Signup.module.scss";
import { Input, Button, Text } from "../../components";
import GoogleSignup from "./GoogleSignup";
import bcrypt from "bcryptjs";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import OtpInputModal from "../../features/Modals/authentication/OtpInputModal";
import { Alert, MicroLoading } from "../../microInteraction";
import { RecoveryContext } from "../../context/RecoveryContext";
import { api } from "../../services";

const SignUp = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [userObject, setUserObject] = useState({});
  const { setEmail } = useContext(RecoveryContext);
  const [OTP, setOTP] = useState("");
  const [isTandChecked, setTandC] = useState(false);
  const [alert, setAlert] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [shouldNavigate, setShouldNavigate] = useState(false);
  const [navigatePath, setNavigatePath] = useState("/");

  const [showUser, setUser] = useState({
    email: "",
    Password: "",
    FirstName: "",
    LastName: "",
    RollNumber: "",
    School: "",
    College: "",
    MobileNo: "+91",
    year: "",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  const DataInp = (name, value) => {
    setUser({ ...showUser, [name]: value });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);

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

    // setEmail(showUser.email);
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
      year !== "" &&
      isTandChecked
    ) {
      // setLoad(true);
      const password = bcrypt.hashSync(Password, import.meta.env.VITE_BCRYPT);
      const user = {
        name,
        email,
        password,
        RollNumber,
        School,
        College,
        MobileNo,
        year,
      };

      setUserObject(user);

      if (email) {
        setEmail(email);
        // if (!emailRegex.test(email)) {
        // toast.error("please enter a valid email address");
        //   return;
        // }
        const OTP = Math.floor(Math.random() * 9000 + 1000);
        console.log(OTP);
        // setOTP(OTP); // Set OTP in context and local storage

        // setLoading(true);

        // await axios.post('/api/send_otp', { email: user.email, OTP: generatedOTP });
        setShowModal(true);
        console.log(showModal);

        // navigate('/otp')
        // setLoading(false);

        // axios
        //   .post("http://localhost:5000/send_recovery_email", { OTP, recipient_email: email })
        //   .then(() => {
        //     setPage("otp");
        //     toast.success("otp is sent to your email")
        //     setLoading(false);
        //   })
        //   .catch(error => {
        //     console.error("Error sending recovery email:", error);
        //     alert("Failed to send recovery email. Please try again later.");
        //     setLoading(false);
        //   });
      } else {
        setAlert({
          type: "error",
          message: "Enter a Valid Email Address",
          position: "bottom-right",
          duration: 3000,
        });
      }
    } else {
      setAlert({
        type: "error",
        message: "Invalid Details! Enter Again",
        position: "bottom-right",
        duration: 3000,
      });

      if (!isTandChecked) {
        setAlert({
          type: "error",
          message: "Please check the terms and conditions",
          position: "bottom-right",
          duration: 3000,
        });
      }
    }
  };

  const handleVerifyOTP = async (enteredOTP) => {
    console.log(userObject);
    console.log(enteredOTP);
    // console.log(password);
    console.log(enteredOTP === String(OTP));
    setShowModal(false);
    navigate("/profile");
    if (enteredOTP === String(OTP)) {
      try {
        // const response = await axios.post('/api/verify_otp_signup', { email, OTP: enteredOTP, password,data:userObject });
        // console.log(response);
        // if (response.status == 200) {
        //   setLoad(false);
        //   console.log("verifiatin Link has been sent");
        // }
      } catch (error) {
        //  setLoad(false);
        // if (error.response.data.code === 1) {
        //   console.log("user already axist");
        //   return;
        // }
        // if (error.response.data.code === 2) {
        //   console.log("invalid email format");
        //   return;
        // } else {
        //   console.log("An unexpected error occured");
        //   return;
        // }
      }

      // Handle successful verification
    } else {
      // Handle incorrect OTP
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleCheckBox = () => {
    setTandC((prevState) => !prevState);
  };

  // console.log(alert)

  return (
    <>
      <div style={{ width: "100vw" }}>
        <Link to={"/"}>
          <div className={styles.ArrowBackIcon}>
            <ArrowBackIcon />
          </div>
        </Link>

        <div className={styles.circle}></div>

        <div className={styles.circle1}></div>
        <div
          className={styles.container}
          style={{
            zIndex: "10",
          }}
        >
          <div className={styles.signin}>
            <h1
              style={{
                paddingTop: "10px",
                background: "var(--primary)",
                width: "20%",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              SignUp
            </h1>
            <GoogleSignup setAlert={setAlert} />
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: "8 px 0 4px 0",
              }}
            >
              <div className={styles.divider} />
              <p style={{ color: "#fff", textAlign: "center" }}>or</p>
              <div className={styles.divider} />
            </div>
            <form onSubmit={handleSignUp}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ width: "48%" }}>
                  <Input
                    type="text"
                    placeholder="First Name"
                    label="First Name"
                    name="FirstName"
                    onChange={(e) => DataInp(e.target.name, e.target.value)}
                    required
                    style={{ width: "96%" }}
                    className={styles.input}
                  />
                </div>
                <div style={{ width: "48%" }}>
                  <Input
                    type="text"
                    placeholder="Last Name"
                    label="Last Name"
                    name="LastName"
                    onChange={(e) => DataInp(e.target.name, e.target.value)}
                    required
                    style={{ width: "96%" }}
                    className={styles.input}
                  />
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ width: "48%" }}>
                  <Input
                    type="email"
                    placeholder="eg.-myemail@gmail.com"
                    label="Email"
                    name="email"
                    className={styles.input}
                    onChange={(e) => DataInp(e.target.name, e.target.value)}
                    required
                    style={{ width: "96%" }}
                  />
                </div>
                <div style={{ width: "48%" }}>
                  <Input
                    type="text"
                    placeholder="1234567890"
                    label="Mobile"
                    name="MobileNo"
                    onChange={(e) => DataInp(e.target.name, e.target.value)}
                    required
                    style={{ width: "96%" }}
                    className={styles.input}
                  />
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "2%",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ width: "46%" }}>
                  <Input
                    type="select"
                    placeholder="College Name"
                    label="College"
                    name="College"
                    className={styles.input}
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
                <div style={{ width: "48%" }}>
                  <Input
                    type="text"
                    placeholder="School"
                    label="School"
                    name="School"
                    className={styles.input}
                    onChange={(e) => DataInp(e.target.name, e.target.value)}
                    required
                    style={{ width: "96%" }}
                  />
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ width: "46%" }}>
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
                      { value: "Passout", label: "Passout" },
                    ]}
                    value={showUser.year}
                    onChange={(value) => DataInp("year", value)}
                    required
                    style={{ width: "96%" }}
                    className={styles.input}
                  />
                </div>
                <div style={{ width: "48%" }}>
                  <Input
                    type="text"
                    placeholder="Roll Number"
                    label="Roll Number"
                    name="RollNumber"
                    onChange={(e) => DataInp(e.target.name, e.target.value)}
                    required
                    style={{ width: "96%" }}
                    className={styles.input}
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
                className={styles.input}
              />

              <div
                style={{
                  display: "flex",
                  marginTop: "15px",
                  marginLeft: "5px",
                }}
              >
                <input
                  type="checkbox"
                  style={{ height: "17px", width: "17px", cursor: "pointer" }}
                  checked={isTandChecked}
                  onClick={handleCheckBox}
                />

                <Text
                  style={{
                    fontSize: "0.7rem",
                    textAlign: "center",
                    marginLeft: "5px",
                    textAlign: "left",
                  }}
                >
                  agree to FED's
                  <Link
                    to="/TermsAndConditions"
                    style={{
                      background: "var(--primary)",
                      WebkitBackgroundClip: "text",
                      color: "transparent",
                      marginLeft: "7px",
                      marginRight: "7px",
                    }}
                  >
                    Terms and Conditions
                  </Link>
                  And
                  <Link
                    to="/PrivacyPolicy"
                    style={{
                      background: "var(--primary)",
                      WebkitBackgroundClip: "text",
                      color: "transparent",
                      marginLeft: "7px",
                    }}
                  >
                    FED's Privacy Policy.
                  </Link>
                </Text>
              </div>

              <Button
                type="submit"
                style={{
                  width: "100%",
                  background: "var(--primary)",
                  color: "#fff",
                  height: "40px",
                  marginTop: "20px",
                  fontSize: "1rem",
                  cursor: "pointer",
                  // border: "1px solid #fff",
                }}
                disabled={isLoading}
              >
                {isLoading ? <MicroLoading /> : "Sign Up"}
              </Button>
              <Text
                style={{
                  fontSize: "0.9rem",
                  textAlign: "center",
                  marginTop: "14px",
                }}
              >
                Already Have an account?{" "}
                <Link
                  to="/Login"
                  style={{
                    background: "var(--primary)",
                    WebkitBackgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  Login
                </Link>
              </Text>
            </form>
          </div>
          <div className={styles.sideImage}></div>
        </div>
      </div>

      {showModal && (
        <OtpInputModal
          onVerify={handleVerifyOTP}
          handleClose={handleModalClose}
        />
      )}
      <Alert />
    </>
  );
};

export default SignUp;
