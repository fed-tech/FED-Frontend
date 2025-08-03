import { useState, useEffect } from "react";
import { Input } from "../../../../components";
import styles from "./styles/Preview.module.scss";

const Section = ({ section, handleChange, handleSubmit }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const validateForm = () => {
    let isValid = true;
    let newErrors = {};
  
    section.fields.forEach((field) => {
      const value = String(field.onChangeValue ?? "").trim(); // Fix applied
      if (field.isRequired && value === "") {
        newErrors[field.name] = "This field is required";
        isValid = false;
      }
    });
  
    setErrors(newErrors);
    return isValid;
  };
  
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      alert("Please fill all required fields!");
      return;
    }
    handleSubmit();
  };

  const getInputFields = (field) => {
    if (field.type === "checkbox" || field.type === "radio") {
      const options = field.value ? field.value.split(",").map((option) => option.trim()) : [];
      return options.map((option, index) => (
        <div key={index} style={{ display: "flex", alignItems: "center", gap: ".5em", marginTop: index === 0 ? "-30px" : "0" }}>
          <Input
            type={field.type}
            value={option}
            checked={String(field.onChangeValue) === option} // Fix applied
            name={field.name}
            onChange={(e) => handleChange(field, e.target.value)}
            style={{ margin: 0 }}
          />
          <span style={{ marginTop: "21px" }}>{option}</span>
        </div>
      ));
    }
    return null;
  };
  
  return (
    <form onSubmit={handleFormSubmit} className={styles.formFieldContainer}>
      {section.fields.map((field) => (
        <div key={field._id} style={{ width: "100%", marginLeft: "-15px" }}>
          {field.type !== "checkbox" && field.type !== "radio" ? (
            <Input
              placeholder={field.type === "select" ? `Choose ${field.name}` : field.value}
              label={`${field.name} ${field.isRequired ? "*" : ""}`}
              type={field.type}
              name={field.name}
              value={String(field.onChangeValue) || ""} // Fix applied
              onChange={(e) => {
                const val = field.type === "select" ? e : e.target.value;
                handleChange(field, val);
              }}
              options={
                field.type === "select" && field.value
                  ? field.value.split(",").map((option) => ({ value: option.trim(), label: option.trim() }))
                  : []
              }
              style={{ width: windowWidth < 500 ? "100%" : "100%" }}
            />
          ) : (
            field.value && (
              <div>
                <label style={{ fontWeight: "bold" }}>{field.name}</label>
                {getInputFields(field)}
              </div>
            )
          )}
          {errors[field.name] && <p style={{ color: "red", fontSize: "0.8em" }}>{errors[field.name]}</p>}
        </div>
      ))}
    </form>
  );
};

export default Section;