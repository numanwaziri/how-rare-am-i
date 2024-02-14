import { SexToggle } from "../components/SexToggle/SexToggle.jsx";
import { ImageSlider } from "../components/SexToggle/ImageSlider.jsx";
import { CustomSlider } from "../components/CustomSlider.jsx";
import Checkbox from "@mui/material/Checkbox";
import { createTheme } from "@mui/material/styles";
import { Controls } from "../components/CompositeComponents/Controls.jsx";
import { useCallback, useEffect, useMemo } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { Link } from "react-router-dom";

export const Form = ({
  sex,
  setSex,
  sexColors,
  height,
  setHeight,
  income,
  setIncome,
  age,
  setAge,
  weight,
  setWeight,
  race,
  setRace,
  exclude,
  setExclude,
  fetchData,
  setFetchedData,
  isLoading,
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
  const checkboxStyle = useMemo(
    () => ({
      color: "rgb(241 245 249)", // Default color
      "&.Mui-checked": {
        color: "rgb(241 245 249)", // Color when checked
      },
      "& .MuiSvgIcon-root": {
        // Target the icon specifically
        fill: "rgb(241 245 249)", // Change fill for the checkmark icon
      },
    }),
    [],
  );

  useEffect(() => {
    setFetchedData(null);
  }, [height, income, age, exclude, race, sex, weight]);

  const cmToFeetInches = useCallback((cm) => {
    if (cm === 121.92) {
      // Special case handling
      return "Any";
    }
    const totalInches = cm / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return `${feet}'${inches}"`; // Format: feet' inches"
  }, []);

  const memoizedCheckbox = useMemo(() => {
    const style = {
      marginTop: !isSmallScreen ? "0.4rem" : "0rem",
      marginLeft: isSmallScreen ? "0.2rem" : "0rem",
    };
    const heightMinMaxToggle = (e) => {
      setHeight({ ...height, isMax: e.target.checked });
    };

    return (
      <Checkbox
        id="heightMinMaxToggle"
        checked={height.isMax}
        onChange={heightMinMaxToggle}
        style={style}
        sx={checkboxStyle}
      />
    );
  }, [isSmallScreen, height]);

  return (
    <article className=" overflow-hidden   pb-6  ">
      <div className=" px-3 pb-6 max-sm:pt-6  sm:px-4 md:px-6">
        <div className="flex items-center justify-between gap-1">
          <p className="mb-2 ml-1 font-bold text-slate-100 transition-all max-md:text-sm md:text-lg lg:text-xl">
            {isSmallScreen
              ? "Select gender"
              : "Select the gender of your ideal partner"}
          </p>
          <Link to="/about">
            <div className="mb-1 flex items-center gap-0.5 max-sm:mb-2">
              <HelpOutlineIcon
                className="text-slate-100"
                sx={
                  isSmallScreen
                    ? { fontSize: "1.1rem" }
                    : { fontSize: "1.34rem" }
                }
              />
              <span className="font-medium text-slate-100 max-md:text-xs md:text-base lg:text-lg">
                FAQ
              </span>
            </div>
          </Link>
        </div>

        <SexToggle sex={sex} setSex={setSex} setFetchedData={setFetchedData} />
      </div>
      <div className="flex px-2 max-sm:flex-col">
        <div className="h-[26rem] w-1/4 transition-all   max-lg:h-[30.8rem] max-md:h-[33.7rem] max-sm:h-28 max-sm:w-full sm:px-2 sm:pb-3 md:px-4">
          <ImageSlider sex={sex} />
        </div>
        <div className=" flex">
          <div className=" flex flex-1 items-center justify-center transition-all max-sm:py-3 sm:flex-col ">
            <span className=" text-center font-bold text-slate-100 max-sm:mr-4  max-sm:text-sm sm:mb-6  sm:mt-2">
              <span
                className={`absolute inline-block transition-all ${
                  height.isMax
                    ? "rotate-0 opacity-100"
                    : "-rotate-180 opacity-0"
                }`}
              >
                Max
              </span>
              <span
                className={`  inline-block transition-all ${
                  !height.isMax
                    ? "rotate-0 opacity-100"
                    : "rotate-180 opacity-0"
                }`}
              >
                Min
              </span>
              <br />
              {/*{height.isMax ? "s" : "Min"} <br />*/}
              Height
            </span>

            <CustomSlider
              value={height}
              setValue={setHeight}
              min={121.92}
              max={203.2}
              step={2.54}
              marks={true}
              formatLabel={cmToFeetInches}
              sex={sex}
              orientation="vertical"
              sexColors={sexColors}
              setFetchedData={setFetchedData}
            />

            {memoizedCheckbox}
            <span className="text-sm text-slate-100 max-sm:-ml-2 max-sm:mr-1.5 sm:-mt-2.5 sm:mb-1">
              Max
            </span>
          </div>
        </div>

        <div className="flex-1 rounded-2xl transition-all ease-custom-bezier  sm:mx-4">
          <Controls
            sex={sex}
            sexColors={sexColors}
            income={income}
            setIncome={setIncome}
            age={age}
            setAge={setAge}
            weight={weight}
            setWeight={setWeight}
            race={race}
            setRace={setRace}
            exclude={exclude}
            setExclude={setExclude}
            fetchData={fetchData}
            isLoading={isLoading}
          />
        </div>
      </div>
    </article>
  );
};
