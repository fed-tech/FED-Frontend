import { Input } from "../../../../components";
import styles from "./styles/Preview.module.scss";

const Section = ({ section, handleChange }) => {
  const getInputFields = (field) => {
    const validTypes = ["checkbox", "radio"];
    if (validTypes.includes(field.type)) {
      const valueToArray = field.value.split(",");
      return valueToArray.map((value, index) => (
        <div
          key={index}
          style={{
            marginTop: index === 0 ? ".5em" : "0",
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
              style={{ width: "100%" }}
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
                      ? window.innerWidth < 500
                        ? "250px"
                        : "300px"
                      : "100%",
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
