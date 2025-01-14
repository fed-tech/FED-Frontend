import { useState, useEffect } from "react";
import { Input } from "../../../../components";
import styles from "./styles/Preview.module.scss";

const Section = ({ section, handleChange }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth); // Store the window width

  // Update the window width on resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize); // Add event listener on component mount

    // Cleanup the event listener when component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
            value={field.onChangeValue || ""}
            name={field.name}
            onChange={(e) => handleChange(field, e.target.value)}
            style={{
              width: windowWidth < 481 ? "175%" : "115%", // Dynamically adjust width for smaller screens
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
          width: "100%", // Set to 100% to ensure the container is responsive
        }}
        className={styles.teamContainer}
      >
        {team.map((field, idx) => (
          <div
            key={idx}
            style={{
              width: "30%", // Set to 30% to evenly distribute space among team fields
            }}
            className={styles.teamField}
          >
            <Input
              placeholder={field.value || ""}
              label={`${field.name} ${field.isRequired ? "*" : ""}`}
              type={field.type}
              name={field.name}
              style={{
                width: windowWidth < 481 ? "135%" : "115%", // Dynamically adjust width for smaller screens
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
        section.fields.map((field) => {
          if (!field) return null;
          return (
            <div key={field._id}>
              {field.type !== "checkbox" && field.type !== "radio" ? (
                <div
                  style={{
                    width:
                      field.type === "select"
                        ? windowWidth < 500
                          ? "135%"  // Adjust width to 80% for select elements on smaller screens
                          : "245%"   // 35% for larger screens
                        : "100%", // Default 100% for other fields
                    margin: "0 auto",
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
                      width: windowWidth < 481 ? "135%" : "122%", // Dynamically adjust width for smaller screens
                    }}
                  />
                </div>
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
