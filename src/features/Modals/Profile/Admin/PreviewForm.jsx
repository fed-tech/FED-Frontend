import { useContext, useEffect, useRef, useState } from "react";
import styles from "./styles/Preview.module.scss";
import AuthContext from "../../../../context/AuthContext";
import { Button, Text } from "../../../../components";
import Section from "./SectionModal";
import { Link, useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { getOutboundList } from "../../../../sections/Profile/Admin/Form/NewForm/NewForm";
import Complete from "../../../../assets/images/Complete.svg";
import { api } from "../../../../services";
import {
  Alert,
  MicroLoading,
  ComponentLoading,
} from "../../../../microInteraction";
// import AuthContext from "../../../../context/AuthContext";
import { RecoveryContext } from "../../../../context/RecoveryContext";

const operators = [
  { label: "match", value: "===" },
  { label: "match not", value: "!==" },
  { label: "less than", value: "<" },
  { label: "greater than", value: ">" },
  { label: "less than or equal to", value: "<=" },
  { label: "greater than or equal to", value: ">=" },
];
const hasOptions = ["select", "checkbox", "radio"];

const PreviewForm = ({
  isEditing,
  eventData,
  form,
  sections = [],
  open,
  meta = [],
  handleClose,
  showCloseBtn,
}) => {
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
  const [data, setdata] = useState(sections);
  const [activeSection, setactiveSection] = useState(
    data !== undefined ? data[0] : ""
  );
  const [isCompleted, setisCompleted] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMicroLoading, setIsMicroLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFormFilled, setIsFormFilled] = useState(false);
  const [alert, setAlert] = useState(null);
  const wrapperRef = useRef(null);
  const recoveryCtx = useContext(RecoveryContext);
  const { setTeamCode, setTeamName, setSuccessMessage } = recoveryCtx;
  const [formData, setFormData] = useState(eventData);
  const [code, setcode] = useState(null);
  const [team, setTeam] = useState(null);
  const [message, setMessage] = useState(null);

  let currentSection =
    data !== undefined
      ? data.find((section) => section._id === activeSection._id)
      : null;

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.classList.add(styles.noScroll);
    } else {
      document.body.classList.remove(styles.noScroll);
    }

    return () => {
      document.body.classList.remove(styles.noScroll);
    };
  }, [open]);

  useEffect(() => {
    constructSections();
  }, [sections]);

  useEffect(() => {
    if (alert) {
      const { type, message, position, duration } = alert;
      Alert({ type, message, position, duration });
      setAlert(null); // Reset alert after displaying it
    }
  }, [alert]);

  const constructSections = () => {
    const newSections = data.map((section) => {
      return {
        ...section,
        isDisabled: section._id !== data[0]._id,
        fields: section.fields.map((field) => {
          return {
            ...field,
            onChangeValue: "",
          };
        }),
      };
    });
    setdata(newSections);
    setactiveSection(newSections[0]);
  };

  const handleChange = (field, value) => {
    const updatedSections = data.map((section) => {
      const updatedFields = section.fields.map((fld) => {
        if (field._id === fld._id) {
          if (fld.type === "checkbox") {
            const updatedOnChangeValue = fld.onChangeValue.includes(value)
              ? fld.onChangeValue.filter((val) => val !== value)
              : [...fld.onChangeValue, value];

            return {
              ...fld,
              onChangeValue: updatedOnChangeValue,
            };
          } else {
            return {
              ...fld,
              onChangeValue: value,
            };
          }
        }
        return fld;
      });

      return {
        ...section,
        fields: updatedFields,
      };
    });

    const newSections = updatedSections.map((section) => {
      const isHavingFieldValidations = section?.validations?.filter(
        (valid) => valid.field_id
      );

      let isMatched = false;
      if (isHavingFieldValidations.length > 0) {
        isMatched = isHavingFieldValidations.some((valid) => {
          return section.fields.some((fld) => {
            return fld.onChangeValue === valid.values;
          });
        });
      }

      const nextSection = getOutboundList(data, section._id)?.nextSection;

      return {
        ...section,
        isDisabled: !(isMatched && nextSection),
      };
    });

    setdata(newSections);
  };

  useEffect(() => {
    if (isSuccess) {
      const participationType = eventData?.participationType;
      const successMessage = eventData?.successMessage;
      console.log(participationType);
      const handleAutoClose = () => {
        setTimeout(() => {
          if (participationType === "Team") {
            setTeamCode(code);
            setTeamName(team);
          }
          if (successMessage) {
            setSuccessMessage(successMessage);
          }
          navigate("/Events");
        }, 1000);
      };

      handleAutoClose();
    }
  }, [isSuccess, navigate]);

  const areRequiredFieldsFilled = () => {
    let isFilled = {
      status: true,
    };

    if (currentSection) {
      currentSection.fields.forEach((field) => {
        if (field.isRequired && !field.onChangeValue) {
          setAlert({
            type: "error",
            message: "Please fill all the details",
            position: "bottom-right",
            duration: 3000,
          });
          isFilled = {
            status: false,
          };
          return;
        }

        field.validations.forEach((valid) => {
          if (valid.type === "length") {
            if (!matchCondition(field, valid)) {
              const op = operators.find((op) => op.value === valid.operator);
              setAlert({
                type: "error",
                message: `${field.name} should ${op?.label} ${valid.type} ${valid.value}`,
                position: "bottom-right",
                duration: 3000,
              });
              isFilled = {
                status: false,
              };
            }
          }
        });
      });
    }

    if (!isFilled.status) {
      return false;
    }

    return true;
  };

  const matchCondition = (field, valid) => {
    const fieldLength = hasOptions.includes(field.type)
      ? field.type === "checkbox"
        ? field.onChangeValue.length
        : field.onChangeValue.split(",").length
      : field.onChangeValue.length;

    const operator = valid?.operator;
    const validLength =
      valid.type === "length" ? Number(valid?.value) : valid?.value;

    switch (operator) {
      case "===":
        return fieldLength === validLength;
      case "!==":
        return fieldLength !== validLength;
      case "includes":
        return field.onChangeValue?.includes(valid?.value);
      case "!includes":
        return !field.onChangeValue?.includes(valid.value);
      case "<":
        return fieldLength < validLength;
      case ">":
        return fieldLength > validLength;
      case "<=":
        return fieldLength <= validLength;
      case ">=":
        return fieldLength >= validLength;
      default:
        throw new Error(`Unsupported operator: ${operator}`);
    }
  };

  const isMetaExist = () => {
    if (meta?.length === 0) return null;
    const paymentSection = meta.find((sec) => sec?.name === "Payment Details");
    if (paymentSection) {
      paymentSection.isDisabled = false;
      paymentSection.validations[0].onBack = currentSection._id;
      return paymentSection;
    }
  };

  const inboundList = () => {
    if (!currentSection) return null;
    let nextSection = currentSection?.validations[0]?.onNext;
    let backSection = currentSection.validations[0]?.onBack;
    const isHavingFieldValidations = currentSection?.validations?.filter(
      (valid) => valid.field_id
    );

    if (isHavingFieldValidations.length > 0) {
      const isMatched = isHavingFieldValidations.find((valid) => {
        return currentSection.fields?.find((fld) => {
          return fld?.onChangeValue?.trim() === valid?.values?.trim();
        });
      });
      nextSection = isMatched ? isMatched?.onNext : nextSection;
      backSection = isMatched ? isMatched?.onBack : backSection;
    }

    if (isMetaExist() && currentSection?.name === "Payment Details") {
      const lastIsCompleted = isCompleted[isCompleted.length - 1];
      backSection = lastIsCompleted;
    }

    return {
      nextSection: data.find((sec) => sec._id === nextSection) || null,
      backSection: data.find((sec) => sec._id === backSection) || null,
    };
  };

  const constructToSave = () => {
    const newSections = [...data, ...meta];
    return newSections.map((section) => {
      if (
        (section !== null && isCompleted.includes(section._id)) ||
        (section !== null && currentSection._id === section._id)
      ) {
        return {
          _id: section._id,
          name: section.name,
          fields: section.fields.map((field) => {
            return {
              _id: field._id,
              name: field.name,
              type: field.type,
              value: field.onChangeValue,
            };
          }),
        };
      }
    });
  };

  const filterMediaFields = () => {
    return (
      data
        .filter(
          (section) =>
            currentSection._id === section._id ||
            isCompleted.includes(section._id)
        )
        .map((section) =>
          section.fields.filter(
            (field) => field.type === "file" || field.type === "image"
          )
        )
        .flat() || []
    );
  };

  const handleSubmit = async () => {
    if (!currentSection || !areRequiredFieldsFilled()) {
      return;
    }

    const formData = new FormData();
    const mediaFields = filterMediaFields() || [];
    const isCreateTeam = data.some(
      (sec) =>
        (sec.name === "Create Team" && currentSection._id === sec._id) ||
        (sec.name === "Create Team" && isCompleted.includes(sec._id))
    );
    const isJoinTeam = data.some(
      (sec) =>
        (sec.name === "Join Team" && currentSection._id === sec._id) ||
        (sec.name === "Join Team" && isCompleted.includes(sec._id))
    );

    formData.append("_id", form.id);
    formData.append("sections", JSON.stringify(constructToSave()));
    formData.append("createTeam", isCreateTeam);
    formData.append("joinTeam", isJoinTeam);

    mediaFields.forEach((field) => {
      if (field.onChangeValue) {
        formData.append(field.name, field.onChangeValue);
      }
    });

    try {
      setIsLoading(true);
      setIsMicroLoading(true);

      if (isEditing) {
        setIsSuccess(true);
        setIsPaymentLocked(false);
        return;
      }
      const response = await api.post("/api/form/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        },
      });

      if (response.status === 200 || response.status === 201) {
        const updatedRegForm = [...authCtx.user.regForm, form.id];
        authCtx.update(
          authCtx.user.name,
          authCtx.user.email,
          authCtx.user.img,
          authCtx.user.rollNumber,
          authCtx.user.school,
          authCtx.user.college,
          authCtx.user.contactNo,
          authCtx.user.year,
          authCtx.user.github,
          authCtx.user.linkedin,
          authCtx.user.extra.designation,
          authCtx.user.access,
          authCtx.user.editProfileCount,
          updatedRegForm // Pass the updated regForm
        );

        setAlert({
          type: "success",
          message: "Form submitted successfully! Payment section unlocked.",
          position: "bottom-right",
          duration: 3000,
        });

        setIsPaymentLocked(false);
        setIsFormFilled(true);
        setCurrentStage(2);
      } else {
        throw new Error("Unexpected response status");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setAlert({
        type: "error",
        message:
          error?.response?.data?.message ||
          "There was an error submitting the form. Please try again.",
        position: "bottom-right",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
      setIsMicroLoading(false);
    }
  };

  const onNext = () => {
    if (!currentSection) {
      return false;
    }

    if (!areRequiredFieldsFilled()) {
      return false;
    }

    const { nextSection } = inboundList();

    if (nextSection) {
      setisCompleted((prev) => [...prev, currentSection._id]);
      setactiveSection(nextSection);
    }

    if (!nextSection || nextSection === "submit") {
      setisCompleted((prev) => [...prev, currentSection._id, "Submitted"]);
      return handleSubmit();
    }
  };

  const onBack = () => {
    const { backSection } = inboundList();
    if (backSection) {
      setisCompleted((prev) => prev.filter((id) => id !== backSection._id));
      setactiveSection(backSection);
    }
  };

  // const renderPaymentScreen = () => {
  //   const { eventType, receiverDetails, eventAmount } = formData;

  //   if (eventType === "Paid" && currentSection.name === "Payment Details") {
  //     return (
  //       <div
  //         style={{
  //           margin: "8px auto",
  //           display: "flex",
  //           flexDirection: "column",
  //           justifyContent: "center",
  //           alignItems: "center",
  //         }}
  //       >
  //         {receiverDetails.media && (
  //           <img
  //             src={
  //               typeof receiverDetails.media === "string"
  //                 ? receiverDetails.media
  //                 : URL.createObjectURL(receiverDetails.media)
  //             }
  //             alt={"QR-Code"}
  //             style={{
  //               width: 200,
  //               height: 200,
  //               objectFit: "contain",
  //             }}
  //           />
  //         )}
  //         <p
  //           style={{
  //             fontSize: 12,
  //             marginTop: 12,
  //             color: "lightgray",
  //           }}
  //         >
  //           Make the payment of{" "}
  //           <strong
  //             style={{
  //               color: "#fff",
  //             }}
  //           >
  //             &#8377;{eventAmount}
  //           </strong>{" "}
  //           using QR-Code or UPI Id{" "}
  //           <strong
  //             style={{
  //               color: "#fff",
  //             }}
  //           >
  //             {receiverDetails.upi}
  //           </strong>
  //         </p>
  //       </div>
  //     );
  //   }
  //   return null;
  // };

  // payment window
  const [isPaymentLocked, setIsPaymentLocked] = useState(true);

  //progress bar
  const [currentStage, setCurrentStage] = useState(1);
  // if (isCompleted.includes("Submitted")) {
  //   setCurrentStage(2);
  // }
  if (isSuccess) {
    setCurrentStage(3);
  }

  //razorpay implement

  useEffect(() => {
    // Load Razorpay SDK
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handlePayNow = async () => {
    try {
      console.log("inside handlePayNow");
      // Create order on backend
      // const response = await api.post("/api/payment/create-order", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ amount: 100 }),
      // });

      // Create order on backend
    const response = await api.post("/api/payment/create-order", { amount: 100 });

    // Ensure response contains data
    if (!response || !response.data || !response.data.orderId) {
      throw new Error("Invalid order response from backend");
    }

    const { orderId } = response.data;
    console.log("orderId", orderId);


      // Initialize Razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_PUBLIC_KEY,
        amount: 100, // amount in paisa
        currency: "INR",
        // name: "Your Organization Name",
        // description: `Payment for ${teamName}`,
        order_id: orderId,
        handler: async (response) => {
          try {
            // Verify payment on backend
            const verifyResponse = await api.post("/api/payment/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                registrationId,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            if (verifyResponse.ok) {
              setAlert({
                type: "success",
                message: "Payment successful!",
                position: "bottom-right",
                duration: 3000,
              });
              router.push("/registration/success");
            } else {
              throw new Error("Payment verification failed");
            }
          } catch (error) {
            setAlert({
              type: "error",
              message: "Payment verification failed. Please contact support.",
              position: "bottom-right",
              duration: 3000,
            });
          }
        },
        prefill: {
          email: authCtx.user.email,
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment error:", error);
      setAlert({
        type: "error",
        message: "Failed to initiate payment. Please try again.",
        position: "bottom-right",
        duration: 3000,
      });
    }
  };

  const handlePayLater = async () => {
    try {
      await api.post("/api/payment/pay-later", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          registrationId,
        }),
      });

      setAlert({
        type: "success",
        message: "Registration completed! Remember to pay before the deadline.",
        position: "bottom-right",
        duration: 3000,
      });

      router.push("/dashboard");
    } catch (error) {
      setAlert({
        type: "error",
        message: "Failed to process request. Please try again.",
        position: "bottom-right",
        duration: 3000,
      });
    }
  };

  return (
    <>
      open && (
      <div className={styles.mainPreview}>
        <div className={styles.box}>
          {/* progress bar */}
          <div className={styles.progressBar}>
            <div className={styles.progressWrapper}>
              <div className={styles.step}>
                <div
                  className={`${styles.circle} ${
                    currentStage >= 1 ? styles.active : ""
                  }`}
                />
                <span>Register</span>
              </div>
              <div
                className={`${styles.line} ${
                  currentStage >= 2 ? styles.active : ""
                }`}
              />
              <div className={styles.step}>
                <div
                  className={`${styles.circle} ${
                    currentStage >= 2 ? styles.active : ""
                  }`}
                />
                <span>Payment</span>
              </div>
              <div
                className={`${styles.line} ${
                  currentStage === 3 ? styles.active : ""
                }`}
              />
              <div className={styles.step}>
                <div
                  className={`${styles.circle} ${
                    currentStage === 3 ? styles.active : ""
                  }`}
                />
                <span>Successful</span>
              </div>
            </div>
          </div>

          <div className={styles.previewContainerWrapper}>
            <div
              ref={wrapperRef}
              className={styles.previewContainer}
              style={{
                backgroundColor: isFormFilled ? "#000" : "initial",
                width: isFormFilled ? "32%" : "68%",
              }}
            >
              {showCloseBtn &&
                (isEditing ? (
                  <div onClick={handleClose} className={styles.closeBtn}>
                    <X />
                  </div>
                ) : (
                  <Link to="/Events" onClick={handleClose}>
                    <div className={styles.closeBtn}>
                      <X />
                    </div>
                  </Link>
                ))}
              <Text
                style={{
                  marginBottom: "20px",
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  fontSize: "25px",
                }}
              >
                {eventData?.eventTitle || "Preview Event"}
              </Text>

              {/* Check if the form is already submitted */}
              {isFormFilled ? (
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    pointerEvents: "none",
                    // opacity: "0.4",
                    backgroundPosition: "center",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "white",
                  }}
                >
                  {/* Content */}
                  <div
                    style={{
                      position: "relative",
                      zIndex: 2,
                      textAlign: "center",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src="https://cdn.prod.website-files.com/663d1907e337de23e83c30b2/67925b3aee82a92d1d9bac2f_image%20(47).png"
                      alt="Success Logo"
                      style={{
                        width: "150px",
                        marginBottom: "1rem",
                        opacity: "0.4",
                      }}
                    />
                    <i
                      style={{
                        fontSize: "2rem",
                        position: "absolute",
                        top: "20%",
                        left: "35%",
                      }}
                      className={styles.tickIcon}
                    >
                      ✅
                    </i>
                    {/* <p
                    style={{
                      fontSize: "1rem",
                      lineHeight: "1.3",
                      marginBottom: "1rem",
                    }}
                  >
                    Your form has been submitted Tempuraliry, and the payment section is now
                    unlocked.
                  </p> */}
                    <Button style={{ opacity: "0.4" }}>Registered</Button>
                  </div>
                </div>
              ) : isLoading ? (
                <ComponentLoading
                  customStyles={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginLeft: "0rem",
                    marginTop: "5rem",
                  }}
                />
              ) : (
                // Render form and sections here
                <div style={{ width: "100%" }}>
                  <div>
                    <Text style={{ alignSelf: "center" }} variant="secondary">
                      {currentSection.name}
                    </Text>
                    <Text
                      style={{
                        cursor: "pointer",
                        padding: "6px 0",
                        fontSize: "11px",
                        opacity: "0.4",
                        marginBottom: "8px",
                      }}
                    >
                      {currentSection.description}
                    </Text>
                  </div>
                  {/* {renderPaymentScreen()} */}
                  <Section
                    section={currentSection}
                    handleChange={handleChange}
                  />
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                    }}
                  >
                    {inboundList() && inboundList().backSection && (
                      <Button style={{ marginRight: "10px" }} onClick={onBack}>
                        Back
                      </Button>
                    )}
                    <Button
                      onClick={
                        inboundList() && inboundList().nextSection
                          ? onNext
                          : handleSubmit
                      }
                    >
                      {inboundList() && inboundList().nextSection ? (
                        "Next"
                      ) : isMicroLoading ? (
                        <MicroLoading />
                      ) : (
                        "Submit"
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Payment Section */}
            {/* Payment Section */}
            <div
              className={`${styles.paymentSection} ${
                isPaymentLocked ? styles.locked : styles.unlock
              }`}
            >
              <h2>Payment</h2>
              {isPaymentLocked ? (
                <div className={styles.paySec}>
                  <div className={styles.lockedMessage}>
                    <img
                      src="https://cdn.prod.website-files.com/663d1907e337de23e83c30b2/6790c06ed4f090ff46f80a08_image%20(46).png"
                      alt=""
                      height={150}
                      width={170}
                    />
                    <i className={styles.lockIcon}>🔒</i>
                  </div>
                  <Button
                    style={{ fontSize: "12px" }}
                    className={styles.payNow}
                  >
                    Pay Now
                  </Button>
                </div>
              ) : (
                <div className={styles.paySecOpen}>
                  <div className={styles.unlockedMessage}>
                    <img
                      src="https://cdn.prod.website-files.com/663d1907e337de23e83c30b2/6790c06ed4f090ff46f80a08_image%20(46).png"
                      alt=""
                      height={150}
                      width={170}
                    />
                  </div>
                  <div className={styles.paybtn}>
                    <Button
                      style={{ fontSize: "12px" }}
                      className={styles.payNow}
                      onClick={handlePayNow}
                    >
                      Pay Now
                    </Button>
                    <Button
                      style={{ fontSize: "12px" }}
                      className={styles.payNow}
                      onClick={handlePayLater}
                    >
                      Pay Later
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      )
      <Alert />
    </>
  );
};
export default PreviewForm;
