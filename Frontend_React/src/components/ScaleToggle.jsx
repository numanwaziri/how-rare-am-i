import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

export const ScaleToggle = ({ sex, toggleScaleType }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isLargeScreen = useMediaQuery(theme.breakpoints.down("lg"));
  const [isChecked, setIsChecked] = useState(false);
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
    toggleScaleType();
  };

  return (
    <div className="flex flex-col items-center justify-center  text-slate-100">
      <span className="mb-1 text-sm max-sm:text-xs">Y-Axis Scale</span>
      <label
        className={`relative inline-flex h-fit cursor-pointer select-none justify-center  rounded-md ring-2  ${
          sex === "Male" ? "ring-male-light" : "ring-female-light"
        }`}
      >
        <input
          name="scaleToggle"
          type="checkbox"
          className="sr-only"
          checked={isChecked}
          onChange={handleCheckboxChange}
        />
        <span
          className={`flex items-center rounded px-[8px] py-1 text-center text-sm font-medium max-sm:text-xs ${
            !isChecked
              ? `text-slate-100 ${
                  sex === "Male" ? "bg-male-light" : "bg-female-light"
                }`
              : "text-white"
          }`}
        >
          {isSmallScreen ? "Sqrt" : isLargeScreen ? "√ Sqrt" : "√ Square Root"}
        </span>
        <span
          className={`flex items-center rounded px-[8px] py-1 text-center text-sm font-medium max-sm:text-xs ${
            isChecked
              ? `text-slate-100 ${
                  sex === "Male" ? "bg-male-light" : "bg-female-light"
                }`
              : "text-white"
          }`}
        >
          {isSmallScreen ? "" : "📏"} Linear
        </span>
      </label>
    </div>
  );
};
