import { useState, useEffect, useRef } from "react";
import {
  income_bins_male as data1,
  income_bins_female as data2,
} from "../Data.js";
import { Histogram } from "./Histogram";
import { SexToggle2 } from "../SexToggle/SexToggle2.jsx";

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
  const [parentDimensions, setParentDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [selectedData, setSelectedData] = useState(data1);
  const parentRef = useRef(null);

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
        className="-mb-12 flex justify-end"
      >
        <SexToggle2
          func1={() => setSelectedData(data2)}
          func2={() => setSelectedData(data1)}
        />
      </div>
      <Histogram
        income={income}
        isMax={isMax}
        sex={selectedData === data1 ? "Males" : "Females"}
        width={parentDimensions.width}
        height={parentDimensions.height - BUTTONS_HEIGHT}
        data={selectedData}
      />
    </div>
  );
};

export default HistogramDatasetTransition;
