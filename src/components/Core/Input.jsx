import { forwardRef, useRef, useState } from "react";
import PropTypes from "prop-types";
import { FaRegCalendarAlt } from "react-icons/fa";
import Select, { components } from "react-select";
import { AiOutlineDown } from "react-icons/ai";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import DatePickerWithTime from "react-datepicker";
import { isValid, parse } from "date-fns";
import styles from "./styles/Core.module.scss";

const CustomInput = forwardRef(
  (
    { value, onClick, placeholder = "Select Date & Time", className, style },
    ref
  ) => (
    <div
      onClick={onClick}
      ref={ref}
      className={className}
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        position: "relative",
        paddingRight: "40px",
        cursor: "pointer",
        ...style,
      }}
    >
      <p
        style={{
          margin: "0 8px",
          fontSize: "0.95rem",
          opacity: value ? 1 : 0.5,
          fontWeight: 400,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {value || placeholder}
      </p>
      <FaRegCalendarAlt
        color="#fff"
        size={18}
        style={{
          position: "absolute",
          top: "50%",
          right: "12px",
          transform: "translateY(-50%)",
        }}
      />
    </div>
  )
);

CustomInput.displayName = "CustomInput";

CustomInput.propTypes = {
  value: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    minHeight: "52px",
    borderRadius: "999px",
    color: "#fff",
    fontSize: "0.95rem",
    background:
      "linear-gradient(145deg, rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.02))",
    border: state.isFocused
      ? "1px solid rgba(255, 165, 90, 0.95)"
      : "1px solid rgba(255, 255, 255, 0.2)",
    boxShadow: state.isFocused
      ? "0 0 0 4px rgba(255, 133, 50, 0.18), 0 10px 28px rgba(0, 0, 0, 0.3)"
      : "none",
    cursor: "pointer",
    "&:hover": {
      borderColor: state.isFocused
        ? "rgba(255, 165, 90, 0.95)"
        : "rgba(255, 255, 255, 0.2)",
    },
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: "0 16px",
  }),
  menu: (provided) => ({
    ...provided,
    marginTop: "8px",
    borderRadius: "16px",
    border: "1px solid rgba(255, 255, 255, 0.18)",
    background:
      "linear-gradient(145deg, rgba(16, 19, 28, 0.98), rgba(12, 16, 24, 0.96))",
    overflow: "hidden",
  }),
  menuPortal: (provided) => ({ ...provided, zIndex: 111 }),
  menuList: (provided) => ({
    ...provided,
    padding: "6px",
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "rgba(255, 255, 255, 0.5)",
  }),
  option: (provided, state) => ({
    ...provided,
    color: state.isSelected ? "#ffffff" : "rgba(255, 255, 255, 0.9)",
    background: state.isSelected
      ? "linear-gradient(140deg, #ff8a3d, #ff5f1f)"
      : "transparent",
    cursor: "pointer",
    borderRadius: "12px",
    margin: "2px 0",
    fontSize: "0.92rem",
    "&:hover": {
      background: state.isSelected
        ? "linear-gradient(140deg, #ff8a3d, #ff5f1f)"
        : "rgba(255, 255, 255, 0.08)",
      color: "#fff",
    },
    "&:active": {
      background: "rgba(255, 255, 255, 0.12)",
    },
  }),
  indicatorSeparator: (provided) => ({
    ...provided,
    display: "none",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#fff",
    fontSize: "0.95rem",
  }),
};

const DropdownIndicator = (props) => {
  return (
    <components.DropdownIndicator {...props}>
      <AiOutlineDown color="#fff" size={18} />
    </components.DropdownIndicator>
  );
};

const Input = (props) => {
  const {
    type = "text",
    containerStyle,
    style,
    placeholder,
    value,
    onChange,
    label,
    options,
    name,
    showLabel = true,
    className,
    containerClassName,
    ...rest
  } = props;
  const dateRef = useRef(null);
  const fileRef = useRef(null);
  const imgRef = useRef(null);
  const [showPassword, setshowPassword] = useState(false);
  const [previewFile, setpreviewFile] = useState(null);

  const parseDateValue = (input) => {
    if (!input) return null;
    if (input instanceof Date) return input;

    if (typeof input === "string") {
      const parsed = parse(input, "MMMM do yyyy, h:mm:ss a", new Date());
      if (isValid(parsed)) return parsed;
    }

    const fallback = new Date(input);
    return Number.isNaN(fallback.getTime()) ? null : fallback;
  };

  const filterPassedTime = (time) => {
    const currentDate = new Date();
    const selectedDate = new Date(time);

    return currentDate.getTime() < selectedDate.getTime();
  };

  const getInputTypes = () => {
    switch (type) {
      case "text":
        return (
          <input
            name={name}
            className={`${styles.input} ${className}`}
            type={type}
            style={style || {}}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            {...rest}
          />
        );

      case "number":
        return (
          <input
            name={name}
            className={`${styles.input} ${className}`}
            type={type}
            style={style || {}}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            {...rest}
          />
        );

      case "textArea":
        return (
          <textarea
            name={name}
            className={`${styles.input} ${styles.inputTxtArea} ${className}`}
            type={type}
            style={style || {}}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            {...rest}
          />
        );

      case "select":
        return (
          <div>
            <Select
              name={name}
              placeholder={placeholder}
              value={options.find((option) => option.value === value) || ""}
              options={options}
              onChange={(selectedOption) => onChange(selectedOption.value)}
              styles={customStyles}
              components={{ DropdownIndicator }}
              isSearchable={false}
              className={className}
              menuPosition="auto"
              {...rest}
            />
          </div>
        );

      case "date":
        return (
          <div>
            <DatePickerWithTime
              name={name}
              ref={dateRef}
              selected={parseDateValue(value)}
              onChange={onChange}
              placeholderText={placeholder}
              className={`${styles.input} ${styles.inputDate} ${className}`}
              showPopperArrow={false}
              popperPlacement="bottom-start"
              popperClassName="fed-datepicker-popper"
              calendarClassName="fed-datepicker fed-datepicker-compact"
              withPortal
              portalId="fed-datepicker-portal"
              {...rest}
            />
          </div>
        );
      case "datetime-local":
        return (
          <div className={`${styles.input} ${styles.inputDate} ${styles.datePickerWrap} ${className}`}>
            <DatePickerWithTime
              name={name}
              ref={dateRef}
              selected={parseDateValue(value)}
              onChange={onChange}
              clearIcon={null}
              showTimeSelect
              filterTime={filterPassedTime}
              minDate={new Date()}
              timeFormat="hh:mm aa"
              timeIntervals={1}
              timeCaption="time"
              dateFormat="MMMM d, yyyy h:mm aa"
              customInput={<CustomInput placeholder={placeholder} />}
              popperPlacement="bottom-start"
              popperClassName="fed-datepicker-popper"
              calendarClassName="fed-datepicker fed-datepicker-datetime"
              showPopperArrow={false}
              withPortal
              portalId="fed-datepicker-portal"
              popperModifiers={[
                { name: "offset", options: { offset: [0, 8] } },
                { name: "preventOverflow", options: { boundary: "viewport", padding: 8 } },
              ]}
              {...rest}
            />
          </div>
        );
      case "radio":
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <input
              name={name}
              className={styles.input}
              type={type}
              style={{ width: "auto" }}
              placeholder={placeholder}
              value={value}
              onChange={onChange}
              {...rest}
            />
            <label
              style={{
                color: "#fff",
                fontSize: ".8em",
                marginLeft: "2px",
                marginTop: "-5px",
              }}
              htmlFor={name}
            >
              {label}
            </label>
          </div>
        );
      case "checkbox":
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <input
              name={name}
              className={styles.input}
              type={type}
              style={{ width: "auto" }}
              placeholder={placeholder}
              value={value}
              onChange={onChange}
              {...rest}
            />
            <label
              style={{
                color: "#fff",
                fontSize: ".8em",
                marginLeft: "2px",
                marginTop: "-5px",
              }}
              htmlFor={name}
            >
              {label}
            </label>
          </div>
        );

      case "password":
        return (
          <div>
            <div
              style={{
                position: "relative",
              }}
            >
              <input
                name={name}
                maxLength={rest.maxLength || 20}
                max={rest.max || 20}
                className={styles.input}
                type={showPassword ? "text" : "password"}
                style={style || {}}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                {...rest}
              />
              {showPassword ? (
                <FaEyeSlash
                  onClick={() => setshowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "16px",
                    top: "25%",
                    cursor: "pointer",
                  }}
                  color="#fff"
                  size={18}
                />
              ) : (
                <FaEye
                  onClick={() => setshowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "16px",
                    top: "25%",
                    cursor: "pointer",
                  }}
                  color="#fff"
                  size={18}
                />
              )}
            </div>
          </div>
        );
      case "file":
        return (
          <div
            className={styles.input}
            onClick={() => fileRef.current?.click()}
            style={{
              height: "40px",
              cursor: "pointer",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              userSelect: "none",
            }}
          >
            <input
              ref={fileRef}
              name={name}
              type={type}
              style={{
                display: "none",
              }}
              placeholder={placeholder}
              onChange={() => {
                const e = {
                  target: {
                    value: fileRef.current.files[0],
                  },
                };
                setpreviewFile(URL.createObjectURL(fileRef.current.files[0]));
                onChange(e);
              }}
              {...rest}
            />
            {previewFile && (
              <img
                src={previewFile}
                style={{
                  height: "24px",
                  width: "24px",
                  borderRadius: "8px",
                  marginRight: "8px",
                }}
              />
            )}
            <span
              style={{
                color: "#fff",
                opacity: value ? 1 : 0.5,
                width: "100%",
                overflow: "hidden",
              }}
            >
              {value || "No file selected"}
            </span>
          </div>
        );
      case "image":
        return (
          <div
            className={styles.input}
            onClick={() => {
              imgRef.current?.click();
            }}
            style={{
              height: "40px",
              cursor: "pointer",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              userSelect: "none",
            }}
          >
            <input
              ref={imgRef}
              name={name}
              type={"file"}
              accept="image/png, image/jpeg, image/jpg"
              style={{
                display: "none",
              }}
              placeholder={placeholder}
              onChange={() => {
                const e = {
                  target: {
                    value: imgRef.current.files[0],
                  },
                };
                setpreviewFile(URL.createObjectURL(imgRef.current.files[0]));
                onChange(e);
              }}
              {...rest}
            />
            {previewFile && (
              <img
                src={previewFile}
                style={{
                  height: "24px",
                  width: "24px",
                  borderRadius: "8px",
                  marginRight: "8px",
                }}
              />
            )}
            <span
              style={{
                color: "#fff",
                opacity: value ? 1 : 0.5,
                width: "100%",
                overflow: "hidden",
              }}
            >
              {value || "No images selected"}
            </span>
          </div>
        );
      default:
        return (
          <input
            name={name}
            className={styles.input}
            type={type}
            style={style || {}}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            {...rest}
          />
        );
    }
  };

  return (
    <div
      className={`${styles.containerInput} ${containerClassName}`}
      style={
        containerStyle || {
          marginTop: type === "select" ? "0" : "8px",
        }
      }
    >
      {showLabel && (
        <label
          style={{
            color: "#fff",
            marginBottom: "4px",
            fontSize: ".8em",
            marginLeft: "8px",
          }}
          htmlFor={label}
        >
          {label}
        </label>
      )}
      {getInputTypes()}
    </div>
  );
};

Input.propTypes = {
  type: PropTypes.oneOf([
    "text",
    "number",
    "textarea",
    "select",
    "date",
    "datetime-local",
    "radio",
    "checkbox",
    "password",
  ]),
  containerStyle: PropTypes.object,
  style: PropTypes.object,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]),
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      label: PropTypes.string,
    })
  ),
  name: PropTypes.string,
  showLabel: PropTypes.bool,
  className: PropTypes.string,
  containerClassName: PropTypes.string,
};

export default Input;
