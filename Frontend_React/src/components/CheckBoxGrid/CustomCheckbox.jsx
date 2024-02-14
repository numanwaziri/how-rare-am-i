import "./CustomCheckbox.css";
import { memo } from "react";

const CustomCheckbox = memo(
  ({ dataName, sex, checked, onChange, idx, height }) => {
    const handleChange = (event) => {
      onChange(event.target.checked);
    };
    return (
      <div className="flex h-full w-full items-center justify-center ">
        <input
          id={idx}
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          data-name={`${dataName}${checked ? "" : ""}`}
          className={`checkbox ${height}  transition-all duration-75 max-sm:text-sm ${
            sex === "Male" ? "bg-male-dark" : "bg-female-dark"
          }`}
        />{" "}
      </div>
    );
  },
);

export default CustomCheckbox;
