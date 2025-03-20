import { useState, useEffect } from "react";
import { Input } from "../../../../components";
import styles from "./styles/Preview.module.scss";

const Section = ({ section, handleChange }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const renderField = (field, idx) => {
    return (
      <div
        key={idx}
        style={{
          width:
            field.type === "select" || field.type === "radio"
              ? windowWidth < 370
                ? "140%"
                : windowWidth < 400
                ? "130%"
                : windowWidth < 413
                ? "140%"
                : windowWidth < 500
                ? "155%"
                : "245%"
              : windowWidth < 400
              ? "115%"
              : windowWidth < 413
              ? "125%"
              : windowWidth < 500
              ? "145%"
              : "100%",
          margin: field.type === "select" || field.type === "radio" ? "1em 0" : "0 auto",
        }}
      >
        <Input
          placeholder={
            field.type === "select"
              ? `Choose ${field.name}`
              : field.value || ""
          }
          label={`${field.name} ${field.isRequired ? "*" : ""}`}
          type={field.type}
          name={field.name}
          value={
            field.type === "file" || field.type === "image"
              ? field.onChangeValue?.name || ""
              : field.onChangeValue || ""
          }
          onChange={(e) => {
            const val = field.type === "select" ? e : e.target.value;
            handleChange(field, val);
          }}
          options={
            field.type === "select" && field.value
              ? field.value.split(",").map((option) => ({
                  value: option,
                  label: option,
                }))
              : []
          }
          style={{
            width:
              field.type === "select" || field.type === "radio"
                ? windowWidth < 370
                  ? "123%"
                  : windowWidth < 400
                  ? "115%"
                  : windowWidth < 413
                  ? "115%"
                  : windowWidth < 500
                  ? "107.5%"
                  : "122%"
                : windowWidth < 400
                ? "115%"
                : windowWidth < 413
                ? "125%"
                : windowWidth < 500
                ? "145%"
                : "100%",
          }}
        />
      </div>
    );
  };

  const getInputFields = (field) => {
    const validTypes = ["checkbox", "radio"];
    if (validTypes.includes(field.type)) {
      const valueToArray = field.value.split(",");
      return valueToArray.map((value, index) => (
        <div
          key={index}
          style={{
            marginTop: index === 0 ? "0.5em" : "0",
          }}
        >
          <Input
            placeholder={value}
            label={value}
            showLabel={false}
            type={field.type}
            value={value} // Each radio button must have a distinct value
            checked={field.onChangeValue === value} // Check if the current value matches the selected one
            name={field.name}
            onChange={(e) => handleChange(field, e.target.value)} // Update the state with the selected value
            style={{
              width:
                windowWidth < 400
                  ? "135%"
                  : windowWidth < 413
                  ? "145%"
                  : windowWidth < 500
                  ? "145%"
                  : "115%",
            }}
          />
        </div>
      ));
    }
    return null;
  };

  const getTeamFields = () => {
    const data = [];
    if (section.name === "Team Members") {
      for (let i = 0; i < section.fields.length; i += 3) {
        data.push(section.fields.slice(i, i + 3));
      }
    }
    return data;
  };

  const renderTeamFields = () => {
    const teams = getTeamFields();
    if (!teams.length) return null;

    return teams.map((team, index) => (
      <div
        key={index}
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "row",
          width: "100%",
        }}
        className={styles.teamContainer}
      >
        {team.map((field, idx) => (
          <div
            key={idx}
            style={{
              width: "30%",
            }}
            className={styles.teamField}
          >
            <Input
              placeholder={field.value || ""}
              label={`${field.name} ${field.isRequired ? "*" : ""}`}
              type={field.type}
              name={field.name}
              style={{
                width:
                  windowWidth < 400
                    ? "115%"
                    : windowWidth < 413
                    ? "145%"
                    : windowWidth < 500
                    ? "145%"
                    : "115%",
              }}
              value={
                field.type === "file" || field.type === "image"
                  ? field.onChangeValue?.name || ""
                  : field.onChangeValue || ""
              }
              onChange={(e) => {
                const val = field.type === "select" ? e : e.target.value;
                handleChange(field, val);
              }}
              options={
                field.type === "select" && field.value
                  ? field.value.split(",").map((option) => ({
                      value: option,
                      label: option,
                    }))
                  : []
              }
            />
          </div>
        ))}
      </div>
    ));
  };

  return (
    <div key={section._id} className={styles.formFieldContainer}>
      {section.name === "Team Members" && renderTeamFields()}
      {section.name !== "Team Members" &&
        section.fields.length > 0 &&
        section.fields.map((field, idx) => {
          if (!field) return null;

          if (field.type === "select" || field.type === "radio") {
            // Render select and radio fields on a new line
            return (
              <div
                key={field._id}
                style={{
                  display: "block",
                  width: "100%",
                  marginTop: "1em",
                }}
              >
                {renderField(field, idx)}
              </div>
            );
          }

          return (
            <div
              key={field._id}
              style={{
                display: "inline-block",
                width: windowWidth < 400 ? "100%" : "30%",
                marginRight: windowWidth < 400 ? "0" : "1.5%",
                marginBottom: "1em",
                verticalAlign: "top",
              }}
            >
              {field.type !== "checkbox" && field.type !== "radio" ? (
                renderField(field, idx)
              ) : (
                <label
                  style={{
                    color: "#fff",
                    fontSize: ".8em",
                  }}
                >
                  {field.name}
                </label>
              )}
              {getInputFields(field)}
            </div>
          );
        })}
    </div>
  );
};

export default Section;
