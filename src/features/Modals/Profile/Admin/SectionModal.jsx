import { Input } from "../../../../components";
import styles from "./styles/Preview.module.scss";

const Section = ({ section, handleChange }) => {
  const getInputFields = (field) => {
    const valiedTypes = ["checkbox", "radio"];
    if (valiedTypes.includes(field.type)) {
      const valueToArray = field.value.split(",").map(v => v.trim()).filter(Boolean);
      return (
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          marginTop: "0.5em",
          width: "100%",
        }}>
          {valueToArray.map((value, index) => {
            const isChecked = field.type === "checkbox"
              ? (field.onChangeValue || []).includes(value)
              : field.onChangeValue === value;

            return (
              <label
                key={index}
                onClick={() => handleChange(field, value)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  background: isChecked
                    ? "rgba(255, 138, 0, 0.08)"
                    : "rgba(255, 255, 255, 0.02)",
                  border: isChecked
                    ? "1px solid rgba(255, 138, 0, 0.3)"
                    : "1px solid rgba(255, 255, 255, 0.06)",
                  transition: "all 0.2s ease",
                  color: isChecked ? "#FF8A00" : "rgba(255, 255, 255, 0.7)",
                  fontSize: "0.85em",
                  fontWeight: isChecked ? "600" : "400",
                }}
              >
                <span style={{
                  width: "18px",
                  height: "18px",
                  borderRadius: field.type === "radio" ? "50%" : "5px",
                  border: isChecked
                    ? "2px solid #FF8A00"
                    : "2px solid rgba(255, 255, 255, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  transition: "all 0.2s ease",
                  background: isChecked
                    ? "rgba(255, 138, 0, 0.15)"
                    : "transparent",
                }}>
                  {isChecked && (
                    <span style={{
                      width: field.type === "radio" ? "8px" : "10px",
                      height: field.type === "radio" ? "8px" : "10px",
                      borderRadius: field.type === "radio" ? "50%" : "2px",
                      background: "#FF8A00",
                    }} />
                  )}
                </span>
                {value}
              </label>
            );
          })}
        </div>
      );
    }
  };

  const getTeamFields = () => {
    const data = [];
    if (section.name === "Team Members") {
      section.fields.forEach((field, index) => {
        if (index % 3 === 0) {
          const team = section.fields.slice(index, index + 3);
          data.push(team);
        }
      });
      return data;
    }
  };

  const renderTeamFields = () => {
    return getTeamFields().map((team, index) => (
      <div
        key={index}
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "row",
        }}
        className={styles.teamContainer}
      >
        {team.map((field, index) => (
          <div
            key={index}
            style={{
              width: "30%",
            }}
            className={styles.teamField}
          >
            <Input
              placeholder={field.value}
              label={`${field.name} ${field.isRequired ? "*" : ""}`}
              type={field.type}
              name={field.name}
              style={{ width: "100%" }}
              value={
                field.type === "file" || field.type === "image"
                  ? field.onChangeValue?.name
                  : field.onChangeValue
              }
              onChange={(e) => {
                const val = field.type === "select" ? e : e.target.value;
                handleChange(field, val);
              }}
              options={
                field.type === "select"
                  ? field.value.split(",").map((option) => {
                    return { value: option, label: option };
                  })
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
        section.fields.map(
          (field) =>
            field !== undefined && (
              <div key={field._id} style={{ flex: "1 1 calc(50% - 1rem)", minWidth: "200px" }}>
                {field.type !== "checkbox" && field.type !== "radio" ? (
                  <Input
                    placeholder={
                      field.type === "select"
                        ? `Choose ${field.name}`
                        : field.value
                    }
                    label={`${field.name} ${field.isRequired ? "*" : ""}`}
                    type={field.type}
                    name={field.name}
                    value={
                      field.type === "file" || field.type === "image"
                        ? field.onChangeValue?.name
                        : field.onChangeValue
                    }
                    onChange={(e) => {
                      const val = field.type === "select" ? e : e.target.value;
                      handleChange(field, val);
                    }}
                    options={
                      field.type === "select"
                        ? field.value.split(",").map((option) => {
                          return { value: option, label: option };
                        })
                        : []
                    }
                  />
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
            )
        )}
    </div>
  );
};

export default Section;
