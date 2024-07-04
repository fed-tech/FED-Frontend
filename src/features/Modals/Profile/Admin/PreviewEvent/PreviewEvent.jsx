import React, { useEffect, useRef, useState } from "react";
import styles from "./styles/Preview.module.scss";
import Button from "../../../../../components/Core/Button";
import Section from "./Section";
import { Link } from 'react-router-dom';
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import { X } from "lucide-react";

const PreviewEvent = ({ sections, open, handleClose ,showCloseBtn}) => {
  const [data, setdata] = useState(sections);
  const [activeSection, setactiveSection] = useState(
    data !== undefined ? data[0] : ""
  );
  const [isCompleted, setisCompleted] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const wrapperRef = useRef(null);
  let currentSection =
    data !== undefined
      ? data.find((section) => section._id === activeSection._id)
      : null;

  useEffect(() => {
    window.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  });

  useEffect(() => {
    constructSections();
  }, [sections]);

  const constructSections = () => {
    const newSections = data.map((section) => {
      return {
        ...section,
        show: section._id === data[0]._id,
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

  const handleClickOutside = (e) => {
    const { current: wrap } = wrapperRef;
    if (wrap && !wrap.contains(e.target)) {
      handleClose();
    }
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
      section.fields.forEach((fld) => {
        const lastField = section.fields[section.fields.length - 1];

        if (lastField && lastField._id === fld._id) {
          if (fld.validations.length > 0) {
            fld.validations.forEach((validation) => {
              const targetSection = updatedSections.find(
                (sec) => sec._id === validation.target
              );

              if (targetSection) {
                if (fld.type === "checkbox") {
                  const conditions = validation.condition.split(",");
                  if (
                    conditions.length === 1 &&
                    fld.onChangeValue.length === 1
                  ) {
                    targetSection.show = fld.onChangeValue.includes(
                      validation.condition
                    );
                  } else if (
                    conditions.length > 1 &&
                    fld.onChangeValue.length > 1
                  ) {
                    const hasElem = conditions.filter((elm) =>
                      fld.onChangeValue.includes(elm)
                    );
                    targetSection.show = hasElem.length > 0;
                    updatedSections.forEach((sec) => {
                      if (
                        sec._id !== targetSection._id &&
                        sec._id !== currentSection._id
                      ) {
                        sec.show = false;
                      }
                    });
                  }
                } else {
                  targetSection.show =
                    fld.onChangeValue?.trim() === validation.condition?.trim();
                }
              }
            });
          } else {
            const currentSectionIndex = updatedSections.findIndex(
              (sec) => sec._id === currentSection._id && sec.show
            );
            if (updatedSections[currentSectionIndex + 1] !== undefined) {
              const isIncludedType = ["text", "number", "date"];
              const nextSection = updatedSections[currentSectionIndex + 1];
              const hasFieldWithValidations = nextSection.fields.some(
                (fld) => fld.validations.length > 0
              );
              const nxtSecFields = nextSection.fields.some(
                (fl) =>
                  isIncludedType.includes(fl.type) &&
                  fl.validations.length === 0
              );
              if (hasFieldWithValidations) {
                nextSection.show = true;
              } else if (nxtSecFields) {
                nextSection.show = true;
              }
            } else {
              console.log("no next section");
            }
          }
        }
      });
      return section;
    });

    setdata(newSections);
  };


  const handleSubmit = () => {
    console.log("Form data:", data);
    alert("Form submitted! Check the console for form data.");
  
  };

  const areRequiredFieldsFilled = () => {
    if (currentSection) {
      return currentSection.fields.every((field) => {
        return !field.isRequired || field.onChangeValue;
      });
    }
    return true;
  };

  const getNextSection = () => {
    const currentSectionIndex = data.findIndex(
      (sec) => sec._id === currentSection._id && sec.show
    );
    const nextSection = data.slice(currentSectionIndex + 1).find((sec) => {
      if (sec.show) {
        return sec;
      }
    });

    return nextSection || null;
  };

  const onNext = () => {
    const hasOptions = ["select", "checkbox", "radio"];

    if (!currentSection) {
      return false;
    }

    if (!areRequiredFieldsFilled()) {
      alert("Please fill all fields");
      return false;
    }

    const lastField = currentSection.fields[currentSection.fields.length - 1];

    if (
      lastField &&
      hasOptions.includes(lastField.type) &&
      lastField.onChangeValue
    ) {
      const validValidations = lastField.validations.filter((valid) => {
        if (lastField.type === "checkbox") {
          const conditions = valid.condition.split(",");
          if (conditions.length === 1 && lastField.onChangeValue.length === 1) {
            return lastField.onChangeValue.includes(valid.condition);
          }

          if (lastField.onChangeValue.length > 1 && conditions.length > 1) {
            const hasElem = conditions.filter((elm) =>
              lastField.onChangeValue.includes(elm)
            );
            return hasElem.length > 0;
          }
        } else {
          return lastField.onChangeValue?.trim() === valid.condition?.trim();
        }
      });

      const nextSectionValidation = validValidations.find(
        (valid) => valid.target !== "Submit"
      );

      if (nextSectionValidation) {
        const nextSection = data.find(
          (sec) => sec._id === nextSectionValidation.target
        );
        setactiveSection(nextSection);
        console.log("221");
        setisCompleted((prev) => [...prev, currentSection._id]);
        return true;
      }

      if (
        validValidations.length === 0 ||
        validValidations.some((valid) => valid.target === "Submit")
      ) {
        setisCompleted((prev) => [...prev, currentSection._id, "Done"]);
        handleSubmit(); 
        return true;
      } else {
        const nextSection = getNextSection();
        if (nextSection !== null) {
          setactiveSection(nextSection);
          console.log("232");
        } else {
          setisCompleted((prev) => [...prev, currentSection._id, "Done"]);
          handleSubmit(); 
        }
      }
    } else {
      const nextSection = getNextSection();
      if (nextSection !== null) {
        setactiveSection(nextSection);
        setisCompleted((prev) => [...prev, currentSection._id]);
      } else {
        setisCompleted((prev) => [...prev, currentSection._id, "Done"]);
        handleSubmit();
      }
      return true;
    }

    return false;
  };

  const onBack = () => {
    const lastSection = data[isCompleted.length - 1];
    const removeLastSection = data.find(
      (section) =>
        section._id === lastSection._id && isCompleted.includes(section._id)
    );
    setisCompleted((prev) => prev.filter((id) => id !== lastSection._id));
    setactiveSection(removeLastSection);
  };

  return (
    open && (
      <div className={styles.mainPreview}>
        <div ref={wrapperRef} className={styles.previewContainer}>
       {showCloseBtn && <Link onClick={handleClose} to={'/Events'}>
          <div className={styles.closeBtn}>
            <X/>
          </div>
        </Link>
        }
          {!isCompleted.includes(currentSection._id) ? (
            <Section section={currentSection} handleChange={handleChange} />
          ) : (
            <div>Submit</div>
          )}
          {!isCompleted.includes("Done") && (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
              }}
            >
              {data[isCompleted.length - 1] && (
                <Button onClick={onBack}>Back</Button>
              )}

              <Button onClick={onNext}>
                {areRequiredFieldsFilled() && getNextSection() === null
                  ? "Submit"
                  : "Next"}
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  );
};

export default PreviewEvent;
