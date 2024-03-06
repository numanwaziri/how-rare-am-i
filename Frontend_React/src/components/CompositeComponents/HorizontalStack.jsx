import Checkbox from "@mui/material/Checkbox";
import { createTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useMemo } from "react";

export const HorizontalStack = ({
  text,
  component,
  checkbox,
  value,
  setCheckboxValue,
  radius = "rounded-xl",
}) => {
  const checkboxStyle = {
    color: "rgb(241 245 249)", // Default color
    "&.Mui-checked": {
      color: "rgb(241 245 249)", // Color when checked
    },
    "& .MuiSvgIcon-root": {
      // Target the icon specifically
      fill: "rgb(241 245 249)", // Change fill for the checkmark icon
    },
  };

  const theme = createTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 640,
        md: 768,
        lg: 1024,
        xl: 1280,
      },
    },
  });
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const memoizedCheckbox = useMemo(() => {
    const handleChange = (e) => {
      setCheckboxValue({ ...value, isMax: e.target.checked });
    };

    return (
      <Checkbox
        id="checkboxIncome"
        checked={value?.isMax}
        onChange={handleChange}
        sx={checkboxStyle}
      />
    );
  }, [isSmallScreen, value]);

  return (
    <div
      className={`flex flex-1 items-center justify-center  ${radius} bg-slate-400 bg-opacity-30 py-3 pl-4 pr-8 shadow-xl  max-sm:py-1 max-sm:pl-3 `}
    >
      <span className=" mr-5 text-left  font-bold text-slate-50  max-sm:mr-3 max-sm:text-sm">
        {text}
      </span>
      {component}
      {checkbox && (
        <div className="-mr-7 ml-1 flex h-8 w-8 flex-col items-center gap-0  max-sm:ml-4 sm:-mr-6 sm:gap-1">
          {memoizedCheckbox}
          <span className=" -translate-y-[2.86rem] text-sm  text-slate-50  max-sm:text-xs sm:-translate-y-14">
            Max
          </span>
        </div>
      )}
    </div>
  );
};
