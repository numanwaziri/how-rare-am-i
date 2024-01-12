import "./CustomCheckbox.css";
import { memo } from "react";

const CustomCheckbox = memo(({ dataName, sex, checked, onChange }) => {
  const handleChange = (event) => {
    onChange(event.target.checked);
  };
  return (
    <div className="flex h-full w-full items-center justify-center ">
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        data-name={`${dataName}${checked ? "" : ""}`}
        className={`checkbox h-11 max-lg:h-10  max-sm:h-8  max-sm:text-sm ${
          sex === "Male" ? "bg-male-dark" : "bg-female-dark"
        }`}
      />{" "}
    </div>
  );
});

export default CustomCheckbox;
