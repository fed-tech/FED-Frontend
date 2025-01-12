import { useState, useRef, useEffect, useContext } from "react";
import { Button, Input, Text, Section } from "../../../../../components";
import { IoSettingsOutline, IoSettingsSharp } from "react-icons/io5";
import AuthContext from "../../../../../context/AuthContext";
import { PreviewForm } from "../../../../../features";
import styles from "./styles/NewForm.module.scss";
import Switch from "react-switch";
import moment from "moment";
import { nanoid } from "nanoid";
import { Alert, MicroLoading } from "../../../../../microInteraction";
import { api } from "../../../../../services";

export const getOutboundList = (array, index) => {
  const getIndex = array.findIndex((sec) => sec._id === index);

  const prv_element = array[getIndex - 1];
  const next_element = array[getIndex + 1];

  const outbound = {
    nextSection: next_element || null,
    backSection: prv_element || null,
  };
  return outbound;
};

const TEAM_SIZE = [
  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
  { label: "4", value: "4" },
  { label: "5", value: "5" },
  { label: "6", value: "6" },
  { label: "7", value: "7" },
];

function NewForm() {
  const scrollRef = useRef(null);
  const [isVisibility, setisVisibility] = useState(false);
  const authCtx = useContext(AuthContext);
  const [alert, setAlert] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setisEditing] = useState(false);
  const [data, setdata] = useState({
    _id: nanoid(),
    eventTitle: "",
    eventdescription: "",
    eventImg: "",
    eventDate: "",
    eventType: "Free",
    receiverDetails: {
      media: "",
      upi: "",
    },
    eventAmount: "",
    eventMaxReg: "",
    relatedEvent: "",
    participationType: "",
    maxTeamSize: "",
    minTeamSize: "",
    regDateAndTime: "",
    eventPriority: "",
    successMessage: "",
    isPublic: false,
    isRegistrationClosed: false,
    isEventPast: true,

    // eventName:"",
    // logoLink: "",
    // eventDate: "",
    // eventType: "Free",
    // receiverDetails: {
    //   media: "",
    //   upi: "",
    // },
    // eventPrice: "",
    // relatedEvent: "",
    // participationType: "",
    // minSize: "",
    // maxSize: "",
    // priority: "",
    // description: "",
    // successMessage: "",
    // maxReg: "",
    // regDateAndTime: "",
    // isRegEnd: false,
    // isEventPast: false,
    // isPublic: false,
  });

  const [sections, setsections] = useState([
    {
      _id: nanoid(),
      name: "Basic Details",
      description: "Enter your basic details here",
      isDisabled: false,
      validations: [
        {
          _id: nanoid(),
          field_id: null, // Field_ID
          onNext: null, // Submit, Section_ID
          onBack: null, // Back, Section_ID
          values: null, // [value1, value2]
        },
      ],
      fields: [
        {
          _id: nanoid(),
          name: "",
          type: "",
          value: "",
          isRequired: true,
          validations: [
            {
              _id: nanoid(),
              type: null, //length, pattern, range
              value: null,
              operator: null, //<,>,<=,>=,===,!==
              message: "",
            },
          ],
        },
      ],
    },
  ]);
  const [paymentSection, setpaymentSection] = useState(null);
  const [showPreview, setshowPreview] = useState(false);

  useEffect(() => {
    if (authCtx.eventData) {
      setdata({
        ...authCtx.eventData?.info,
        isPublic: authCtx.eventData?.info.isPublic,
        isRegistrationClosed: authCtx.eventData?.info.isRegistrationClosed,
        isEventPast: authCtx.eventData?.info.isEventPast,
      });
      setsections(authCtx.eventData?.sections);
      setisEditing(true);
    }
  }, []);

  useEffect(() => {
    if (alert) {
      const { type, message, position, duration } = alert;
      Alert({ type, message, position, duration });
    }
  }, [alert]);

  const isValidSections = () => {
    const sections = constructForPreview();
    return sections.every((section) =>
      section.fields?.every((field) => {
        if (
          !field.name ||
          !field.type ||
          (field.type !== "file" && field.type !== "image" && !field.value)
        ) {
          return false;
        }

        if (["radio", "checkbox", "select"].includes(field.type)) {
          return field.validations && field.validations.length > 0
            ? field.validations.every(
                (validation) =>
                  validation.type && validation.value && validation.operator
              )
            : true;
        }
        return true;
      })
    );
  };

  const isValidEvent = () => {
    if (!data.eventTitle) {
      setAlert({
        type: "error",
        message: "Event title is required.",
        position: "bottom-right",
        duration: 3000,
      });
      return false;
    }

    if (!data.eventImg) {
      setAlert({
        type: "error",
        message: "Event image is required.",
        position: "bottom-right",
        duration: 3000,
      });
      return false;
    }
    if (!data.eventDate) {
      setAlert({
        type: "error",
        message: "Event date is required.",
        position: "bottom-right",
        duration: 3000,
      });
      return false;
    }
    if (!data.eventType) {
      setAlert({
        type: "error",
        message: "Event type is required.",
        position: "bottom-right",
        duration: 3000,
      });
      return false;
    }
    if (!data.relatedEvent) {
      setAlert({
        type: "error",
        message: "Related event is required.",
        position: "bottom-right",
        duration: 3000,
      });
      return false;
    }
    if (!data.participationType) {
      setAlert({
        type: "error",
        message: "Participation type is required.",
        position: "bottom-right",
        duration: 3000,
      });
      return false;
    }
    if (!data.eventPriority) {
      setAlert({
        type: "error",
        message: "Event priority is required.",
        position: "bottom-right",
        duration: 3000,
      });
      return false;
    }
    if (!data.eventdescription) {
      setAlert({
        type: "error",
        message: "Event description is required.",
        position: "bottom-right",
        duration: 3000,
      });
      return false;
    }
    if (!data.successMessage) {
      setAlert({
        type: "error",
        message: "Success message is required.",
        position: "bottom-right",
        duration: 3000,
      });
      return false;
    }
    if (!data.eventMaxReg) {
      setAlert({
        type: "error",
        message: "Maximum registration is required.",
        position: "bottom-right",
        duration: 3000,
      });
      return false;
    }

    if (data.eventType === "Paid") {
      if (!data.eventAmount) {
        setAlert({
          type: "error",
          message: "Event amount is required.",
          position: "bottom-right",
          duration: 3000,
        });
        return false;
      }

      if (!data.receiverDetails.media) {
        setAlert({
          type: "error",
          message: "Media is required.",
          position: "bottom-right",
          duration: 3000,
        });
        return false;
      }

      if (!data.receiverDetails.upi) {
        setAlert({
          type: "error",
          message: "UPI is required.",
          position: "bottom-right",
          duration: 3000,
        });
        return false;
      }

      // if (!data.find((field) => field.name === "T&C Acceptance").value) {
      //   setAlert({
      //     type: "error",
      //     message: "You must accept the terms and conditions to proceed.",
      //     position: "bottom-right",
      //     duration: 3000,
      //   });
      //   return false;
      // }
    }

    if (data.participationType === "Team") {
      if (!data.maxTeamSize) {
        setAlert({
          type: "error",
          message: "Maximum team size is required.",
          position: "bottom-right",
          duration: 3000,
        });
        return false;
      }

      if (!data.minTeamSize) {
        setAlert({
          type: "error",
          message: "Minimum team size is required.",
          position: "bottom-right",
          duration: 3000,
        });
        return false;
      }
    }
    return true;
  };

  const onSaveEvent = async () => {
    if (sections === undefined) {
      setAlert({
        type: "error",
        message: "Please add atleast one section",
        position: "bottom-right",
        duration: 3000,
      });
      return;
    }
    if (isValidEvent()) {
      setIsLoading(true);
      const newSections = constructForPreview();
      const form = new FormData();

      if (data.eventImg && data.eventImg instanceof File) {
        form.append("eventImg", data.eventImg);
      }
      if (
        data.receiverDetails.media &&
        data.receiverDetails.media instanceof File
      ) {
        form.append("media", data.receiverDetails.media);
      }

      form.append("upi", data.receiverDetails.upi);

      Object.keys(data).forEach((key) => {
        const value = data[key];
        if (key !== "eventImg") {
          form.append(key, value);
        }
      });

      if (typeof data.eventImg === "string") {
        form.delete("eventImg");
      }

      if (typeof data.receiverDetails.media === "string") {
        form.delete("media");
      }

      if (data.receiverDetails) {
        form.delete("receiverDetails");
      }

      if (sections && sections !== undefined) {
        form.append("sections", JSON.stringify(newSections));
      }

      if (isEditing) {
        form.append("id", authCtx.eventData?.id);
      }

      if (data._id) {
        delete data._id;
      }

      if (isEditing) {
        try {
          const response = await api.put(
            `/api/form/editForm/${authCtx.eventData?.id}`,
            form,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${window.localStorage.getItem("token")}`,
              },
            }
          );

          if (response.status === 200 || response.status === 201) {
            setAlert({
              type: "success",
              message: "Form updated successfully",
              position: "bottom-right",
              duration: 3000,
            });
          } else {
            setAlert({
              type: "error",
              message: "There was an error editing the form. Please try again.",
              position: "bottom-right",
              duration: 3000,
            });
          }
        } catch (error) {
          setAlert({
            type: "error",
            message:
              "There was an error submitting the form. Please try again.",
            position: "bottom-right",
            duration: 3000,
          });
        } finally {
          setIsLoading(false);
        }
      } else {
        try {
          const response = await api.post("/api/form/addForm", form, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${window.localStorage.getItem("token")}`,
            },
          });

          if (response.status === 200 || response.status === 201) {
            setAlert({
              type: "success",
              message: "Form saved successfully",
              position: "bottom-right",
              duration: 3000,
            });
          } else {
            setAlert({
              type: "error",
              message:
                "There was an error submitting the form. Please try again.",
              position: "bottom-right",
              duration: 3000,
            });
          }
        } catch (error) {
          setAlert({
            type: "error",
            message:
              "There was an error submitting the form. Please try again.",
            position: "bottom-right",
            duration: 3000,
          });
        } finally {
          setIsLoading(false);
        }
      }
    }
  };

  const onAddSection = () => {
    const lastSection = sections[sections.length - 1];
    const sectionName = prompt("Enter Section Name");
    if (sectionName) {
      if (lastSection) {
        const newSectionID = nanoid();
        const updatedLastSection = {
          ...lastSection,
        };

        updatedLastSection.validations[0] = {
          _id: nanoid(),
          field_id: null,
          onNext: newSectionID,
          onBack: lastSection.validations[0]?.onBack || null,
          values: null,
        };

        const newSection = {
          name: sectionName,
          _id: newSectionID,
          description: "",
          isDisabled: false,
          validations: [
            {
              _id: nanoid(),
              field_id: null,
              onNext: null,
              onBack: lastSection._id,
              values: null,
            },
          ],
          fields: [
            {
              _id: nanoid(),
              name: "",
              type: "",
              value: "",
              isRequired: true,
              validations: [],
            },
          ],
        };
        setsections([
          ...sections.slice(0, sections.length - 1),
          updatedLastSection,
          newSection,
        ]);
      } else {
        setAlert({
          type: "error",
          message: "Please add atleast one section",
          position: "bottom-right",
          duration: 3000,
        });
      }
      setTimeout(() => {
        scrollRef.current.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }, 100);
    }
  };

  // const handleChangeTeamSize = (value) => {
  //   if (value < 1 || !value) {
  //     setdata({ ...data, maxTeamSize: "" });
  //     setsections(
  //       sections.filter((section) => section.name !== "Team Members")
  //     );
  //   }
  //   if (value === 0 || value > 7) {
  //     alert("Team size should be between 1 and 7.");
  //   } else {
  //     if (value > 0 && value <= 7) {
  //       setdata({ ...data, maxTeamSize: value });

  //       const fields = Array.from({ length: value }, (_, index) => [
  //         {
  //           _id: nanoid(),
  //           name: `Enter ${getOrdinalSuffix(index + 1)} Member Name`,
  //           type: "text",
  //           value: "Enter Member Name",
  //           isRequired: index < data.minTeamSize ? true : false,
  //           validations: [],
  //         },
  //         {
  //           _id: nanoid(),
  //           name: `Enter ${getOrdinalSuffix(index + 1)} Member Email`,
  //           type: "text",
  //           value: "Enter Member Email",
  //           isRequired: index < data.minTeamSize ? true : false,
  //           validations: [],
  //         },
  //         {
  //           _id: nanoid(),
  //           name: `Enter ${getOrdinalSuffix(index + 1)} Member Roll Number`,
  //           type: "number",
  //           value: "Enter Roll Number",
  //           isRequired: index < data.minTeamSize ? true : false,
  //           validations: [],
  //         },
  //       ]).flat();
  //       const lastSection = sections[sections.length - 1];
  //       if (lastSection) {
  //         const newSectionID = nanoid();
  //         const updatedLastSection = {
  //           ...lastSection,
  //           validations: [
  //             {
  //               _id: nanoid(),
  //               field_id: null,
  //               onNext: newSectionID,
  //               onBack: lastSection.validations[0]?.onBack || null,
  //               values: null,
  //             },
  //           ],
  //         };
  //         const newSection = {
  //           _id: newSectionID,
  //           name: "Team Members",
  //           fields: fields,
  //           description: "Enter your team members details here",
  //           isDisabled: true,
  //           validations: [
  //             {
  //               _id: nanoid(),
  //               field_id: null,
  //               onNext: null,
  //               onBack: lastSection._id,
  //               values: null,
  //             },
  //           ],
  //         };

  //         const isHavingTeamSection = sections.some(
  //           (section) => section.name === "Team Members"
  //         );

  //         if (isHavingTeamSection) {
  //           const updatedSections = sections.map((section) => {
  //             if (section.name === "Team Members") {
  //               return {
  //                 ...section,
  //                 fields: fields,
  //               };
  //             }
  //             return section;
  //           });
  //           setsections(updatedSections);
  //         } else {
  //           const removed = sections.filter(
  //             (section) => section._id !== lastSection._id
  //           );
  //           setsections([...removed, updatedLastSection, newSection]);
  //         }
  //       }
  //     }
  //     setTimeout(() => {
  //       scrollRef.current.scrollIntoView({
  //         behavior: "smooth",
  //         block: "nearest",
  //       });
  //     }, 100);
  //   }
  // };

  // const getOrdinalSuffix = (num) => {
  //   const suffixes = ["th", "st", "nd", "rd"];
  //   const remainder = num % 100;
  //   const suffix =
  //     suffixes[(remainder - 20) % 10] || suffixes[remainder] || suffixes[0];
  //   return `${num}${suffix}`;
  // };

  // const handleChangeMinSize = (value) => {
  //   if (value < 1 || !value) {
  //     setdata({ ...data, minTeamSize: "1" });
  //   }
  //   if (value === 0 || value >= 7) {
  //     alert("Team size should be between 1 and 7.");
  //     setdata({ ...data, minTeamSize: "1" });
  //   }
  //   if (data.maxTeamSize > 0 && data.maxTeamSize < value) {
  //     alert("Team min size should be less than max");
  //     setdata({ ...data, minTeamSize: "1" });
  //   } else {
  //     const isHavingTeamSection = sections.some(
  //       (section) => section.name === "Team Members"
  //     );
  //     if (isHavingTeamSection) {
  //       const updatedSections = sections.map((section) => {
  //         if (section.name === "Team Members") {
  //           const updatedFields = section.fields.map((fld, idx) => {
  //             return {
  //               ...fld,
  //               isRequired: idx < value * 3 ? true : false,
  //             };
  //           });

  //           return {
  //             ...section,
  //             fields: updatedFields,
  //           };
  //         }
  //         return section;
  //       });
  //       setsections(updatedSections);
  //     }
  //     setdata({ ...data, minTeamSize: value });
  //   }
  // };

  const onChangeEventType = (value) => {
    setdata({ ...data, eventType: value, eventAmount: "" });

    if (value === "Paid") {
      setpaymentSection({
        _id: nanoid(),
        name: "Payment Details",
        description:
          "Make the payment to attached UPI ID or Scan the QR code. In the end, Share the complete detailes with us!",
        isDisabled: true,
        validations: [
          {
            _id: nanoid(),
            field_id: null,
            onNext: null,
            onBack: null,
            values: null,
          },
        ],
        fields: [
          {
            _id: nanoid(),
            name: "Enter UPI ID",
            type: "text",
            value: "Enter UPI ID",
            isRequired: true,
            validations: [],
          },
          {
            _id: nanoid(),
            name: "Transaction ID (Last 4)",
            type: "number",
            value: "Last 4 digits of Transaction ID",
            isRequired: true,
            validations: [
              {
                _id: nanoid(),
                type: "length",
                value: 4,
                operator: "===",
                message: "Transaction ID should be at most 4 digits long",
              },
            ],
          },
          {
            _id: nanoid(),
            name: "Payment Screenshot",
            type: "image",
            value: "Upload Payment Screenshot",
            isRequired: true,
            validations: [],
          },
          {
            _id: nanoid(),
            name: "Terms & Conditions",
            type: "radio",
            value:
              "I acknowledge that all payments made are non-refundable once the form is submitted. For any further assistance contact fedkiit@gmail.com",
            isRequired: true,
            validations: [
              {
                _id: nanoid(),
                type: "length",
                value: 1,
                operator: "===",
                message:
                  "You need to agree to the terms and conditions to proceed.",
              },
            ],
          },
        ],
      });
    } else {
      setpaymentSection(null);
    }
  };

  const constructForPreview = () => {
    const formatedData =
      sections && sections !== undefined ? [...sections] : [];

    if (paymentSection && data.eventType === "Paid") {
      paymentSection.isDisabled = true;
      formatedData.forEach((section) => {
        section.validations.forEach((validation) => {
          if (!validation.onNext) {
            validation.onNext = paymentSection._id;
          }
        });
      });

      formatedData.push(paymentSection);
      return formatedData;
    }

    return formatedData;
  };

  const handleChangeParticipantType = (value) => {
    const isHavingTeamSection = sections.some(
      (section) => section.name === "Team Members"
    );
    if (isHavingTeamSection) {
      const isConfirm = confirm(
        "Are you sure you want to change the participation type? All the data will be lost."
      );
      if (isConfirm) {
        setdata({
          ...data,
          participationType: value,
          minTeamSize: "",
          maxTeamSize: "",
        });
        const removedSection = sections.filter(
          (section) => section.name !== "Team Members"
        );
        setsections(removedSection);
        if (removedSection.length === 0) {
          setsections([
            {
              _id: nanoid(),
              name: "Basic Details",
              description: "Enter your basic details here",
              isDisabled: false,
              validations: [
                {
                  _id: nanoid(),
                  field_id: null,
                  onNext: null,
                  onBack: null,
                  values: null,
                },
              ],
              fields: [
                {
                  _id: nanoid(),
                  name: "",
                  type: "",
                  value: "",
                  isRequired: true,
                  validations: [
                    {
                      _id: nanoid(),
                      type: null,
                      value: null,
                      operator: null,
                      message: "",
                    },
                  ],
                },
              ],
            },
          ]);
        }
      }
    } else {
      setdata({
        ...data,
        participationType: value,
        minTeamSize: "",
        maxTeamSize: "",
      });
    }
  };

  const handlePreview = () => {
    if (isValidEvent()) {
      if (isValidSections()) {
        setshowPreview(!showPreview);
      } else {
        setAlert({
          type: "error",
          message: "Section is not valid. Please fill all the fields.",
          position: "bottom-right",
          duration: 3000,
        });
      }
    } else {
      console.log("Invalid Event");
    }
  };

  return (
    <div
      style={{
        width: "100%",
        marginLeft: "70px",
      }}
    >
      <div className={styles.formHeader}>
        <div className={styles.buttonContainer}>
          <h3 className={styles.headInnerText}>
            <span>New</span> Form
          </h3>
        </div>
        <div
          style={{
            display: "flex",
            gap: "10px",
          }}
        >
          <div
            style={{
              marginTop: "auto",
              marginBottom: "auto",
              marginRight: "12px",
            }}
          >
            {isVisibility ? (
              <IoSettingsSharp
                size={20}
                color="#FF8A00"
                style={{ cursor: "pointer", marginTop: "10px" }}
                onClick={() => setisVisibility(!isVisibility)}
              />
            ) : (
              <IoSettingsOutline
                size={20}
                style={{ cursor: "pointer", marginTop: "10px" }}
                color="#fff"
                onClick={() => setisVisibility(!isVisibility)}
              />
            )}
          </div>

          <Button isLoading={isLoading} onClick={onSaveEvent}>
            {isEditing ? "Update" : "Save"}
          </Button>
          {sections && sections !== undefined ? (
            <Button
              isLoading={false}
              onClick={handlePreview}
              variant="secondary"
            >
              {showPreview ? "Hide" : "Preview"}
            </Button>
          ) : null}
        </div>
      </div>
      {isVisibility && (
        <div
          style={{
            backgroundColor: "rgba(128, 127, 126, 0.066)",
            width: "86%",
            margin: ".5em 0",
            padding: "1.6em",
            borderRadius: "8px",
            marginBottom: "1em",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <label
              style={{
                color: "#fff",
                margin: "4px 0",
                fontSize: ".8em",
                opacity: data.isPublic ? "1" : ".6",
                transition: "all .4s",
              }}
            >
              Event Form Privacy (
              <span style={{ color: !data.isPublic ? "#FF8A00" : "white" }}>
                Private
              </span>
              /
              <span style={{ color: data.isPublic ? "#FF8A00" : "white" }}>
                Public
              </span>
              )
            </label>
            <Switch
              checked={data.isPublic}
              width={36}
              height={18}
              onColor="#FF8A00"
              checkedIcon={false}
              placeholder="Mode (Public/Private)"
              uncheckedIcon={false}
              title="Mode (Public/Private)"
              onChange={() => {
                setdata({
                  ...data,
                  isPublic: !data.isPublic,
                });
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              margin: "1em 0",
            }}
          >
            <label
              style={{
                color: "#fff",
                margin: "4px 0",
                fontSize: ".8em",
                opacity: data.isRegistrationClosed ? "1" : ".6",
                transition: "all .4s",
              }}
            >
              Event Form Registration (
              <span
                style={{
                  color: !data.isRegistrationClosed ? "#FF8A00" : "white",
                }}
              >
                Open
              </span>
              /
              <span
                style={{
                  color: data.isRegistrationClosed ? "#FF8A00" : "white",
                }}
              >
                Close
              </span>
              )
            </label>
            <Switch
              checked={data.isRegistrationClosed}
              width={36}
              height={18}
              onColor="#FF8A00"
              checkedIcon={false}
              placeholder="Close Event Registration"
              uncheckedIcon={false}
              title="Close Event Registration"
              onChange={() => {
                setdata({
                  ...data,
                  isRegistrationClosed: !data.isRegistrationClosed,
                });
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <label
              style={{
                color: "#fff",
                margin: "4px 0",
                fontSize: ".8em",
                opacity: data.isEventPast ? "1" : ".6",
                transition: "all .4s",
              }}
            >
              Event Form Status (
              <span
                style={{
                  color: !data.isEventPast ? "#FF8A00" : "white",
                }}
              >
                Ongoing
              </span>
              /
              <span
                style={{
                  color: data.isEventPast ? "#FF8A00" : "white",
                }}
              >
                Past
              </span>
              )
            </label>
            <Switch
              checked={data.isEventPast}
              width={36}
              height={18}
              onColor="#FF8A00"
              checkedIcon={false}
              placeholder="Event Past/Ongoing"
              uncheckedIcon={false}
              title="Event Past/Ongoing"
              onChange={() => {
                setdata({
                  ...data,
                  isEventPast: !data.isEventPast,
                });
              }}
            />
          </div>
        </div>
      )}
      <div
        style={{
          height: "90vh",
          width: "90%",
          overflow: "hidden scroll",
          scrollbarWidth: "none",
          marginBottom: "50px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <div
            style={{
              width: "45%",
            }}
          >
            <Input
              placeholder="Enter Event Title or Name"
              label="Event Title"
              value={data.eventTitle}
              className={styles.formInput}
              onChange={(e) => setdata({ ...data, eventTitle: e.target.value })}
            />
            <Input
              placeholder="Attach Event Image"
              label="Event Image"
              type={"image"}
              value={
                typeof data.eventImg === "string"
                  ? data.eventImg
                  : data.eventImg?.name || ""
              }
              containerClassName={styles.formInput}
              onChange={(e) => setdata({ ...data, eventImg: e.target.value })}
              className={styles.formInput}
            />
            <Input
              placeholder="Select Date"
              className={styles.formInput}
              label="Event Date"
              type="date"
              style={{ width: "88%" }}
              value={data.eventDate}
              onChange={(date) => setdata({ ...data, eventDate: date })}
            />
            <Input
              placeholder="Select Event Type"
              label="Event Type"
              type="select"
              className={styles.formInput}
              options={[
                { label: "Paid", value: "Paid" },
                { label: "Free", value: "Free" },
              ]}
              style={{ width: "88%" }}
              value={data.eventType}
              onChange={(value) => onChangeEventType(value)}
            />
            {data.eventType === "Paid" && (
              <div>
                <Input
                  placeholder="Enter Event Registration Amount"
                  label="Event Registration Fee"
                  type="number"
                  value={data.eventAmount}
                  onChange={(e) =>
                    setdata({ ...data, eventAmount: e.target.value })
                  }
                  className={styles.formInput}
                />
                <Input
                  placeholder={"Upload Media/Images/Qr Code"}
                  label={"Receiver Payment QR Code"}
                  value={
                    typeof data.receiverDetails?.media === "string"
                      ? data.receiverDetails?.media
                      : data.receiverDetails?.media?.name || ""
                  }
                  className={styles.formInput}
                  containerClassName={styles.formInput}
                  type="image"
                  onChange={(e) =>
                    setdata({
                      ...data,
                      receiverDetails: {
                        ...data.receiverDetails,
                        media: e.target.value,
                      },
                    })
                  }
                />

                <Input
                  placeholder={"Enter UPI ID"}
                  label={"Receiver UPI ID"}
                  value={data?.receiverDetails?.upi}
                  className={styles.formInput}
                  onChange={(e) =>
                    setdata({
                      ...data,
                      receiverDetails: {
                        ...data.receiverDetails,
                        upi: e.target.value,
                      },
                    })
                  }
                />
              </div>
            )}
            <Input
              placeholder="Enter Event Name"
              label="Related Event Name"
              value={data.relatedEvent}
              className={styles.formInput}
              onChange={(e) =>
                setdata({ ...data, relatedEvent: e.target.value })
              }
            />
            <Input
              label="Participation Type"
              placeholder="Select Type"
              className={styles.formInput}
              type="select"
              options={[
                { label: "Individual", value: "Individual" },
                { label: "Team", value: "Team" },
              ]}
              style={{ width: "88%" }}
              value={data.participationType}
              onChange={(value) => {
                handleChangeParticipantType(value);
              }}
            />
            {data.participationType === "Team" && (
              <div>
                <Input
                  placeholder="Enter Team Size "
                  label="Team Size (Min)"
                  type="select"
                  options={TEAM_SIZE.filter(
                    (item) => item.value <= (data.maxTeamSize || 7)
                  )}
                  className={styles.formInput}
                  value={data.minTeamSize}
                  onChange={(value) => setdata({ ...data, minTeamSize: value })}
                />
                {data.minTeamSize && (
                  <Input
                    placeholder="Enter Team Size "
                    label="Team Size (Max)"
                    type="select"
                    options={TEAM_SIZE.filter(
                      (item) => item.value >= (data.minTeamSize || 1)
                    )}
                    className={styles.formInput}
                    value={data.maxTeamSize}
                    onChange={(value) =>
                      setdata({ ...data, maxTeamSize: value })
                    }
                  />
                )}
              </div>
            )}
            <Input
              placeholder="Enter Priority Number"
              className={styles.formInput}
              label="Event Priority"
              value={data.eventPriority}
              onChange={(e) =>
                setdata({ ...data, eventPriority: e.target.value })
              }
            />
            <Input
              placeholder="Open Date & Time"
              className={styles.formInput}
              label="Event Registration Open Date & Time"
              type="datetime-local"
              value={data.regDateAndTime}
              onChange={(date) => {
                setdata({
                  ...data,
                  regDateAndTime: moment(date).format(
                    "MMMM Do YYYY, h:mm:ss a"
                  ),
                });
              }}
            />
          </div>
          <div
            style={{
              width: "45%",
            }}
          >
            <Input
              placeholder="Enter Event Description"
              label="Event Description"
              type="textArea"
              className={` ${styles.formInputTxtArea}`}
              value={data.eventdescription}
              onChange={(e) =>
                setdata({ ...data, eventdescription: e.target.value })
              }
            />
            <Input
              placeholder="Enter Message"
              label="Registration Success Message"
              type="textArea"
              className={` ${styles.formInputTxtArea}`}
              value={data.successMessage}
              containerStyle={{ marginTop: "12px" }}
              onChange={(e) =>
                setdata({ ...data, successMessage: e.target.value })
              }
            />
            <Input
              placeholder="Enter Number"
              className={styles.formInput}
              label="Maximum Registrations Allowed"
              type="number"
              value={data.eventMaxReg}
              containerStyle={{ marginTop: "12px" }}
              onChange={(e) =>
                setdata({ ...data, eventMaxReg: e.target.value })
              }
            />
          </div>
        </div>
        {sections && sections !== undefined ? (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              width: "86%",
              marginBottom: "12px",
            }}
          >
            <Text
              style={{
                fontSize: "14px",
                margin: "auto 6px",
                marginRight: "auto",
              }}
            >
              Sections
            </Text>
            <Button
              variant="secondary"
              style={{ marginLeft: "auto" }}
              onClick={onAddSection}
            >
              Add Section
            </Button>
          </div>
        ) : null}

        {sections && sections !== undefined
          ? sections.map((section) => (
              <div key={section._id} ref={scrollRef}>
                <Section
                  section={section}
                  sections={sections}
                  setsections={setsections}
                  meta={paymentSection ? [paymentSection] : []}
                  showAddButton={!section.isDisabled}
                  disabled={section.isDisabled}
                />
              </div>
            ))
          : null}

        {paymentSection && (
          <Section
            section={paymentSection}
            sections={sections}
            setsections={setsections}
            showAddButton={false}
            disabled={true}
          />
        )}
        {showPreview && (
          <PreviewForm
            isEditing={true}
            open={showPreview}
            handleClose={() => setshowPreview(false)}
            sections={constructForPreview()}
            eventData={{ ...data, id: authCtx.eventData?.id }}
            meta={paymentSection ? [paymentSection] : []}
            form={data}
            showCloseBtn={true}
          />
        )}
      </div>
      <Alert />
    </div>
  );
}

export default NewForm;