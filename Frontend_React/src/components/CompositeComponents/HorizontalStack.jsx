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

    const style = {
      marginLeft: isSmallScreen ? "-10px" : "-20px",
    };

    return (
      <Checkbox
        id="checkboxIncome"
        checked={value?.isMax}
        onChange={handleChange}
        sx={checkboxStyle}
        style={style}
      />
    );
  }, [isSmallScreen, value]);

  return (
    <div className="flex items-center justify-center gap-5 rounded-xl bg-slate-400 bg-opacity-30 py-3 pl-4 pr-3 shadow-xl max-sm:gap-4 max-sm:py-1 max-sm:pl-3 max-sm:pr-4">
      <span className="  text-left font-bold  text-slate-50 max-sm:text-sm">
        {text}
      </span>
      {component}
      {checkbox && (
        <>
          {memoizedCheckbox}
          <span className="max-sm:-ml-6.5 -ml-6 text-sm text-slate-50 max-sm:-mr-2">
            Max
          </span>
        </>
      )}
    </div>
  );
};
