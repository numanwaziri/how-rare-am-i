import useMediaQuery from "@mui/material/useMediaQuery";
import Slider from "@mui/material/Slider";
import { createTheme } from "@mui/material/styles";
import { memo } from "react";

export const CustomSlider = memo(
  ({
    sex,
    sexColors,
    value,
    setValue,
    formatLabel,
    min,
    max,
    step,
    defaultValue,
    style,
    orientation,
    marks,
  }) => {
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
    const isMidScreen = useMediaQuery(theme.breakpoints.down("md"));
    const sliderStyleHorizontal = {
      color: sex === "Male" ? sexColors.maleLight : sexColors.femaleLight,

      "& .MuiSlider-track": {
        border: "none",
        width: isSmallScreen ? "9.5px" : isMidScreen ? "11px" : "11.5px",
        height: isSmallScreen ? "9.5px" : isMidScreen ? "11px" : "11.5px",
        transition: "all 0.3s cubic-bezier(.81,.04,.41,1.27)",
      },
      "& .MuiSlider-thumb": {
        height: isSmallScreen ? "23px" : "27px",
        width: isSmallScreen ? "23px" : "27px",
        backgroundColor: "rgb(241 245 249)",
        border: isSmallScreen
          ? "4px solid currentColor"
          : isMidScreen
            ? "4.5px solid currentColor"
            : "5px solid currentColor",
        transition: "all 0.3s cubic-bezier(.81,.04,.41,1.27)",
        "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
          boxShadow: "inherit",
        },
        "&:before": {
          display: "none",
        },
      },
      "& .MuiSlider-valueLabel": {
        lineHeight: 1.2,
        fontSize: isSmallScreen ? "14px" : "16px",
        background: "unset",
        padding: "0",
        width: isSmallScreen ? 36 : 45,
        height: isSmallScreen ? 36 : 45,
        borderRadius: "50% 50% 50% 0",
        backgroundColor:
          sex === "Male" ? sexColors.maleLight : sexColors.femaleLight,
        transformOrigin: "bottom left",
        transform:
          orientation === "vertical"
            ? "translate(150%, -100%) rotate(45deg) scale(0)"
            : "translate(50%, -20%) rotate(45deg) scale(0)",
        transition: "all 0.3s cubic-bezier(.81,.04,.41,1.27)",
        "&:before": {
          display: "none",
        },
        "&.MuiSlider-valueLabelOpen": {
          transform:
            (orientation === "vertical") & !isSmallScreen
              ? "translate(148%, -120%) rotate(-45deg) scale(1)"
              : (orientation === "vertical") & isSmallScreen
                ? "translate(80%, -50%) rotate(45deg) scale(1)"
                : "translate(51%, -58%) rotate(-20deg) scale(1)",
        },
        "& > *": {
          transform:
            (orientation === "vertical") & isSmallScreen
              ? "rotate(-45deg)"
              : (orientation === "vertical") & !isSmallScreen
                ? "rotate(45deg)"
                : "rotate(20deg)",
        },
      },
    };

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

    const handleChange = (event, newValue) => {
      if (Array.isArray(newValue) && newValue.length === 2) {
        // Ensure there's at least 1 unit gap between the slider values
        const gap = 1; // Minimum gap
        const [newLower, newUpper] = newValue;

        if (newUpper - newLower < gap) {
          if (newLower !== value[0]) {
            // Lower slider moved, adjust upper slider
            setValue([newLower, newLower + gap]);
          } else {
            // Upper slider moved, adjust lower slider
            setValue([newUpper - gap, newUpper]);
          }
        } else {
          // If the gap is maintained, update the state as usual
          setValue(newValue);
        }
      } else if (typeof value === "object") {
        // If value is an object with two properties
        setValue({ ...value, val: newValue });
      } else {
        // If newValue is a single value
        setValue(newValue);
      }
    };

    const sliderValue =
      typeof value === "object" && value !== null && "val" in value
        ? value.val
        : value;
    return (
      <Slider
        valueLabelDisplay="auto"
        defaultValue={defaultValue}
        onChange={handleChange}
        marks={marks}
        valueLabelFormat={formatLabel}
        value={sliderValue}
        min={min} // Set the minimum value in cm
        max={max} // Set the maximum value in cm
        step={step} // One inch increment in centimeters
        orientation={
          (orientation === "vertical") & !isSmallScreen
            ? "vertical"
            : "horizontal"
        }
        disableSwap
        style={style}
        sx={sliderStyleHorizontal}
      />
    );
  },
);
