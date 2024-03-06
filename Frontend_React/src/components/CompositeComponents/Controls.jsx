import { memo, useMemo } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { CustomSlider } from "../CustomSlider.jsx";
import { HorizontalStack } from "./HorizontalStack.jsx";
import CheckboxGrid from "../CheckBoxGrid/CheckboxGrid.jsx";
import { FancyButton } from "../FancyButton/FancyButton.jsx";
import CustomCheckbox from "../CheckBoxGrid/CustomCheckbox.jsx";
import TroubleshootIcon from "@mui/icons-material/Troubleshoot";
import ClearIcon from "@mui/icons-material/Clear";
import { Link } from "react-router-dom";
export const Controls = memo(
  ({
    sex,
    sexColors,
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
    isLoading,
  }) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

    const raceCheckboxGrid = useMemo(
      () => (
        <CheckboxGrid
          items={Object.keys(race)}
          sex={sex}
          value={race}
          setValue={setRace}
        />
      ),
      [race, sex, setRace],
    );

    const WeightSlider = useMemo(() => {
      return (
        <CustomSlider
          sex={sex}
          sexColors={sexColors}
          value={weight}
          setValue={setWeight}
          min={29.4835}
          max={256.27968905}
          step={5 / 2.20462262185}
          gaps={5 / 2.20462262185}
          formatLabel={(kg) => {
            let val;
            if (kg === 29.4835 || kg === 256.27968905) {
              val = "Any";
            } else {
              val = Math.round(kg * 2.20462262185);
            }
            return val;
          }}
        />
      );
    }, [sex, weight, setWeight]);

    const memoizedExcludeCheckbox = useMemo(() => {
      return (
        <CustomCheckbox
          idx={1}
          sex={sex}
          dataName="Exclude Married"
          checked={exclude["Married"]}
          height="lg:h-full h-11 "
          onChange={(isChecked) =>
            setExclude({
              ...exclude,
              Married: isChecked,
            })
          }
        />
      );
    }, [sex, exclude, setExclude]);

    const incomeSliderStyle = useMemo(
      () => ({
        marginRight: isSmallScreen ? "-6px" : "6px",
      }),
      [isSmallScreen],
    );

    const memoizedIncomeSlider = useMemo(
      () => (
        <CustomSlider
          sex={sex}
          sexColors={sexColors}
          value={income}
          setValue={setIncome}
          formatLabel={incomeLabel}
          min={0}
          max={500000}
          step={5000}
          style={incomeSliderStyle}
        />
      ),
      [sex, sexColors, income, setIncome, incomeSliderStyle],
    );

    const checkboxStyle = useMemo(
      () => ({
        color: "white", // Default color
        "&.Mui-checked": {
          color: "white", // Color when checked
        },
        "& .MuiSvgIcon-root": {
          // Target the icon specifically
          fill: "white", // Change fill for the checkmark icon
        },
      }),
      [],
    );

    function incomeLabel(value) {
      if (!value) {
        return "Any";
      }
      return `${value / 1000}k`;
    }

    return (
      <div className="flex flex-col gap-2">
        <HorizontalStack
          text="Age"
          component={
            <CustomSlider
              sex={sex}
              sexColors={sexColors}
              value={age}
              setValue={setAge}
              min={18}
              max={80}
              step={1}
            />
          }
        />
        <div className="flex flex-row items-center justify-center">
          <HorizontalStack
            text={
              <>
                {" "}
                <span
                  className={`absolute inline-block transition-all ${
                    income.isMax
                      ? "rotate-0 opacity-100"
                      : "-rotate-180 opacity-0"
                  }`}
                >
                  Max
                </span>
                <span
                  className={`  inline-block transition-all ${
                    !income.isMax
                      ? "rotate-0 opacity-100"
                      : "rotate-180 opacity-0"
                  }`}
                >
                  Min
                </span>
                Income
              </>
            }
            component={memoizedIncomeSlider}
            checkbox={true}
            setCheckboxValue={setIncome}
            value={income}
            radius="rounded-l-xl"
          />

          <Link to="/analyze">
            <button
              disabled={income.val === 0}
              type="button"
              className={`h-[4.5rem] w-[4.5rem]  rounded-r-xl ${
                sex === "Male"
                  ? "bg-gradient-male-btn"
                  : "bg-gradient-female-btn"
              } text-center text-base  font-bold text-white  shadow-lg transition-all ease-custom-bezier  hover:scale-105 hover:shadow-2xl  active:scale-95   max-sm:h-[3.25rem] max-sm:w-[2.75rem]`}
            >
              {income.val === 0 ? (
                <ClearIcon
                  sx={{
                    fontSize: isSmallScreen ? "180%" : "250%",
                    filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))", // Add the glow effect
                  }}
                />
              ) : (
                <TroubleshootIcon
                  sx={{
                    fontSize: isSmallScreen ? "180%" : "220%",
                    filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))", // Add the glow effect
                  }}
                />
              )}
            </button>
          </Link>
        </div>

        <div className="flex gap-2 max-lg:flex-col">
          <div className="flex-1 lg:w-3/5">
            <HorizontalStack text="Weight (lbs)" component={WeightSlider} />
          </div>
          <div className="rounded-xl bg-slate-400 bg-opacity-30 p-[0.43rem] max-sm:h-14   lg:w-2/5 lg:p-[0.42rem]">
            {memoizedExcludeCheckbox}
          </div>
        </div>
        <HorizontalStack text="Race" component={raceCheckboxGrid} />
        <div className="sm:h-[6.63rem]">
          <FancyButton sex={sex} fetchData={fetchData} isLoading={isLoading} />
        </div>

        {/*<div className="flex items-center justify-center gap-5 rounded-xl bg-slate-400 bg-opacity-25 py-3 pl-4 pr-3 max-sm:gap-3 max-sm:py-1 max-sm:pl-3 max-sm:pr-2">*/}
        {/*  <span className=" flex-1  text-left  font-bold text-slate-50  max-sm:text-sm">*/}
        {/*    {income.isMax ? "Max Income" : "Min Income"}*/}
        {/*  </span>*/}
        {/*  <CustomSlider*/}
        {/*    sex={sex}*/}
        {/*    sexColors={sexColors}*/}
        {/*    value={income}*/}
        {/*    setValue={setIncome}*/}
        {/*    formatLabel={incomeLabel}*/}
        {/*    min={0}*/}
        {/*    max={500000}*/}
        {/*    step={5000}*/}
        {/*    style={useMemo(*/}
        {/*      () => ({*/}
        {/*        marginRight: isSmallScreen ? "3px" : "9px",*/}
        {/*      }),*/}
        {/*      [isSmallScreen],*/}
        {/*    )}*/}
        {/*  />*/}

        {/*  <Checkbox*/}
        {/*    checked={income.isMax}*/}
        {/*    onChange={(e) => setIncome({ ...income, isMax: e.target.checked })}*/}
        {/*    sx={checkboxStyle}*/}
        {/*    style={{ marginLeft: isSmallScreen ? "-10px" : "-20px" }}*/}
        {/*  />*/}
        {/*  <span className="-ml-6 text-sm text-slate-50 max-sm:-ml-5">Max</span>*/}
        {/*</div>*/}
      </div>
    );
  },
);
