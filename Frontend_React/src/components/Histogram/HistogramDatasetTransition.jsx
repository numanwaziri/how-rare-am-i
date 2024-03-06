import { useState, useEffect, useRef } from "react";
import {
  income_bins_male as data1,
  income_bins_female as data2,
  income_bins_male_20k,
  income_bins_female_20k,
} from "../Data.js";
import { Histogram } from "./Histogram";
import { SexToggle2 } from "../SexToggle/SexToggle2.jsx";
import { ScaleToggle } from "../ScaleToggle.jsx";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
const BUTTONS_HEIGHT = 50;

const buttonStyle = {
  border: "1px solid #9a6fb0",
  borderRadius: "3px",
  padding: "0px 8px",
  margin: "10px 2px",
  fontSize: 14,
  color: "#9a6fb0",
  opacity: 0.7,
};

const HistogramDatasetTransition = ({ income, isMax, sex }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [parentDimensions, setParentDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [scaleType, setScaleType] = useState("sqrt");
  const [selectedData, setSelectedData] = useState(
    !isSmallScreen
      ? sex === "Male"
        ? data1
        : data2
      : sex === "Male"
        ? income_bins_male_20k
        : income_bins_female_20k,
  );
  const parentRef = useRef(null);

  const toggleScaleType = () => {
    setScaleType((prevScaleType) =>
      prevScaleType === "sqrt" ? "linear" : "sqrt",
    );
  };

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        setParentDimensions({ width, height });
      }
    });

    resizeObserver.observe(parentRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div ref={parentRef} className=" h-full w-full flex-1 ">
      <div
        style={{ height: BUTTONS_HEIGHT }}
        className=" flex -translate-x-6 translate-y-12 items-center justify-end max-md:-translate-x-4 max-sm:translate-y-7"
      >
        <div className="flex w-1/2 items-end justify-end gap-2">
          {parentDimensions.width > 260 && (
            <ScaleToggle sex={sex} toggleScaleType={toggleScaleType} />
          )}
          <SexToggle2
            sex={sex}
            func1={() =>
              isSmallScreen
                ? setSelectedData(income_bins_female_20k)
                : setSelectedData(data2)
            }
            func2={() =>
              isSmallScreen
                ? setSelectedData(income_bins_male_20k)
                : setSelectedData(data1)
            }
          />
        </div>
      </div>
      <Histogram
        scaleType={scaleType}
        income={income}
        isMax={isMax}
        sex={
          selectedData === data1 || selectedData === income_bins_male_20k
            ? "Males"
            : "Females"
        }
        width={parentDimensions.width}
        height={parentDimensions.height - BUTTONS_HEIGHT}
        data={selectedData}
      />
    </div>
  );
};

export default HistogramDatasetTransition;
