/* eslint-disable no-unused-vars */
/* eslint-disable no-dupe-keys */
/* eslint-disable react/no-unescaped-entities */
import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import styles from "./style/Signup.module.scss";
import { Input, Button, Text } from "../../components";
import bcrypt from "bcryptjs";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import OtpInputModal from "../../features/Modals/authentication/OtpInputModal";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { Alert, MicroLoading } from "../../microInteraction";
import { RecoveryContext } from "../../context/RecoveryContext";
import { api } from "../../services";
import AuthContext from "../../context/AuthContext";
import heroBgImage from "../../assets/images/herobgimage.png";
import GoogleIcon from "@mui/icons-material/Google";

const SignUp = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [userObject, setUserObject] = useState({});
  const { setEmail } = useContext(RecoveryContext);
  const [isTandChecked, setTandC] = useState(false);
  const [alert, setAlert] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [mode, setMode] = useState("select");
  const [showDropdown, setShowDropdown] = useState(false);
  const authCtx = useContext(AuthContext);

  const [showUser, setUser] = useState({
    email: "",
    Password: "",
    FirstName: "",
    LastName: "",
    rollNumber: "",
    school: "",
    college: "",
    contactNo: "+91",
    year: "",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (alert) {
      const { type, message, position, duration } = alert;
      Alert({ type, message, position, duration });
      setAlert(null);
    }
  }, [alert]);

  const handleGoogleSignup = async (tokenResponse) => {
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
        message:
          response.status === 200
            ? "User already registered. Logged in successfully"
            : "User registered. Logged in successfully",
        position: "bottom-right",
        duration: 2800,
      });

      setTimeout(() => navigate("/"), 600);
    } catch (error) {
      setAlert({
        type: "error",
        message: "There was an error signing up with Google.",
        position: "bottom-right",
        duration: 2800,
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const signupWithGoogle = useGoogleLogin({
    onSuccess: handleGoogleSignup,
    onError: () => {
      setAlert({
        type: "error",
        message: "Google signup failed. Please try again.",
        position: "bottom-right",
        duration: 2500,
      });
    },
  });

  const DataInp = (name, value) => {
    if (name === "college" && value.toLowerCase().startsWith("k")) {
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }

    setUser({ ...showUser, [name]: value });
  };

  const handleSelectCollege = () => {
    setUser({
      ...showUser,
      college: "Kalinga Institute of Industrial Technology",
    });
    setShowDropdown(false);
  };

  const validateData = (data, acceptedTerms) => {
    const errors = [];

    if (!data.FirstName) errors.push("First Name is required.");
    if (!data.LastName) errors.push("Last Name is required.");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) errors.push("Enter a valid email address.");

    if (data.contactNo.length < 10 || data.contactNo.length > 12) {
      errors.push("Contact Number must be between 10 and 12 digits.");
    }

    if (!data.college) errors.push("College is required.");
    if (!data.school) errors.push("School is required.");
    if (!data.rollNumber) errors.push("Roll Number is required.");
    if (!data.year) errors.push("Year is required.");
    if (!data.Password) errors.push("Password is required.");
    if (!acceptedTerms) errors.push("Please check the terms and conditions.");

    return errors;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const validationResult = validateData(showUser, isTandChecked);

    if (validationResult.length > 0) {
      setAlert({
        type: "error",
        message: validationResult.join(" "),
        position: "bottom-right",
        duration: 3000,
      });
      setIsLoading(false);
      return;
    }

    const {
      email,
      Password,
      FirstName,
      LastName,
      rollNumber,
      school,
      college,
      contactNo,
      year,
    } = showUser;

    const name = `${FirstName} ${LastName}`;
    const saltRounds = parseInt(import.meta.env.VITE_BCRYPT, 10);
    const password = bcrypt.hashSync(Password, saltRounds);
    const user = {
      name,
      email,
      password,
      rollNumber,
      school,
      college,
      contactNo,
      year,
    };

    setUserObject(user);

    try {
      setAlert({
        type: "info",
        message: "Verifying Email...",
        position: "bottom-right",
        duration: 3000,
      });

      setEmail(user.email);

      const response = await api.post(
        "/api/auth/verifyEmail",
        { email: user.email },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200 || response.status === 201) {
        setTimeout(() => {
          setShowModal(true);
        }, 3000);

        setAlert({
          type: "success",
          message: response.data.message || "Otp sent to email",
          position: "bottom-right",
          duration: 3000,
        });
      } else {
        setAlert({
          type: "error",
          message: response.data.message || "Error in sending OTP",
          position: "bottom-right",
          duration: 3000,
        });
      }
    } catch (error) {
      setAlert({
        type: "error",
        message:
          error?.response?.data?.message ||
          "Failed to send OTP. Please try again.",
        position: "bottom-right",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (enteredOTP) => {
    if (!enteredOTP) {
      setAlert({
        type: "error",
        message: "Validation Failed! Enter Valid OTP",
        position: "bottom-right",
        duration: 3000,
      });
      return;
    }

    try {
      const response = await api.post("/api/auth/register", {
        ...userObject,
        otp: enteredOTP,
      });

      if (response.status === 200 || response.status === 201) {
        localStorage.setItem("token", response.data.token);

        authCtx.login(
          response.data.user.name,
          response.data.user.email,
          response.data.user.img,
          response.data.user.rollNumber,
          response.data.user.school,
          response.data.user.college,
          response.data.user.contactNo,
          response.data.user.year,
          response.data.user.extra?.github,
          response.data.user.extra?.linkedin,
          response.data.user.extra?.designation,
          response.data.user.access,
          response.data.user.editProfileCount,
          response.data.user.regForm,
          response.data.user.blurhash,
          response.data.token,
          10800000
        );

        navigate("/");
      }
    } catch (error) {
      setAlert({
        type: "error",
        message: error?.response?.data?.message || "Enter valid details",
        position: "bottom-right",
        duration: 3000,
      });
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleCheckBox = () => {
    setTandC((prevState) => !prevState);
  };

  return (
    <>
      <div
        className={styles.authShell}
        style={{ "--auth-bg-image": `url(${heroBgImage})` }}
      >
        <Link to="/" className={styles.backBtn}>
          <ArrowBackIcon />
        </Link>

        <div className={styles.card}>
          <h1 className={styles.title}>Sign Up</h1>
          <p className={styles.subtitle}>Create your account to continue</p>

          {mode === "select" && (
            <div className={styles.options}>
              <button
                className={styles.socialButton}
                onClick={() => signupWithGoogle()}
                type="button"
                disabled={isGoogleLoading}
              >
                {isGoogleLoading ? (
                  <MicroLoading />
                ) : (
                  <>
                    <GoogleIcon className={styles.socialIcon} />
                    Continue with Google
                  </>
                )}
              </button>

              <div className={styles.dividerRow}>
                <div className={styles.divider} />
                <p className={styles.dividerLabel}>OR</p>
                <div className={styles.divider} />
              </div>

              <button
                className={styles.emailOption}
                onClick={() => setMode("email")}
                type="button"
              >
                <MailOutlineIcon className={styles.mailIcon} />
                Continue with Email
              </button>

              <Text className={styles.bottomText}>
                Already have an account?{" "}
                <Link to="/Login" className={styles.linkAccent}>
                  Login
                </Link>
              </Text>
            </div>
          )}

          {mode === "email" && (
            <>
              <button
                className={styles.switchBack}
                onClick={() => setMode("select")}
                type="button"
              >
                {"<- Back"}
              </button>

              <form onSubmit={handleSignUp} className={styles.form}>
                <div className={styles.formRow}>
                  <div className={styles.formCol}>
                    <Input
                      type="text"
                      placeholder="First Name"
                      label="First Name"
                      name="FirstName"
                      onChange={(e) => DataInp(e.target.name, e.target.value)}
                      required
                      style={{ width: "100%" }}
                    />
                  </div>
                  <div className={styles.formCol}>
                    <Input
                      type="text"
                      placeholder="Last Name"
                      label="Last Name"
                      name="LastName"
                      onChange={(e) => DataInp(e.target.name, e.target.value)}
                      required
                      style={{ width: "100%" }}
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formCol}>
                    <Input
                      type="email"
                      placeholder="eg.-myemail@gmail.com"
                      label="Email"
                      name="email"
                      onChange={(e) => DataInp(e.target.name, e.target.value)}
                      required
                      style={{ width: "100%" }}
                    />
                  </div>
                  <div className={styles.formCol}>
                    <Input
                      type="number"
                      placeholder="1234567890"
                      label="Mobile"
                      name="contactNo"
                      onChange={(e) => DataInp(e.target.name, e.target.value)}
                      required
                      style={{ width: "100%" }}
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formCol}>
                    <Input
                      type="text"
                      placeholder="College Name"
                      label="college"
                      name="college"
                      value={showUser.college}
                      onChange={(e) => DataInp(e.target.name, e.target.value)}
                      required
                      style={{ width: "100%" }}
                    />
                    {showDropdown && (
                      <div className={styles.dropdown}>
                        <div
                          className={styles.dropdownItem}
                          onClick={handleSelectCollege}
                        >
                          Kalinga Institute of Industrial Technology
                        </div>
                      </div>
                    )}
                  </div>
                  <div className={styles.formCol}>
                    <Input
                      type="text"
                      placeholder="School"
                      label="School"
                      name="school"
                      onChange={(e) => DataInp(e.target.name, e.target.value)}
                      required
                      style={{ width: "100%" }}
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formCol}>
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
                      style={{ width: "100%" }}
                    />
                  </div>
                  <div className={styles.formCol}>
                    <Input
                      type="text"
                      placeholder="Roll Number"
                      label="Roll Number"
                      name="rollNumber"
                      onChange={(e) => DataInp(e.target.name, e.target.value)}
                      required
                      style={{ width: "100%" }}
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
                  style={{ width: "100%" }}
                />

                <div className={styles.termsRow}>
                  <input
                    type="checkbox"
                    className={styles.termsCheckbox}
                    checked={isTandChecked}
                    onChange={handleCheckBox}
                    id="custom-checkbox"
                  />

                  <Text className={styles.termsText}>
                    Agree to FED's
                    <Link to="/TermsAndConditions" className={styles.linkAccent}>
                      Terms and Conditions
                    </Link>
                    And
                    <Link to="/PrivacyPolicy" className={styles.linkAccent}>
                      FED's Privacy Policy.
                    </Link>
                  </Text>
                </div>

                <Button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={isLoading}
                >
                  {isLoading ? <MicroLoading /> : "Sign Up"}
                </Button>

                <Text className={styles.bottomText}>
                  Already have an account?{" "}
                  <Link to="/Login" className={styles.linkAccent}>
                    Login
                  </Link>
                </Text>
              </form>
            </>
          )}
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

