import { motion, useIsPresent } from "framer-motion";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Link } from "react-router-dom";
import { incomePercentile } from "../components/Data.js";
import { LinePlot } from "../components/LinePlot.jsx";
import HistogramDatasetTransition from "../components/Histogram/HistogramDatasetTransition.jsx";
import { SexToggle2 } from "../components/SexToggle/SexToggle2.jsx";
export const Analyze = ({ sex, income }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isPresent = useIsPresent();
  return (
    <div className="min-h-screen flex-col items-center justify-center p-2 py-4 sm:p-4 md:py-8">
      <div className="w-full">
        <div className=" items-center  justify-center gap-2 md:flex md:flex-row">
          <div className=" mb-4 w-full max-md:px-1 md:hidden md:w-1/3 lg:w-1/4">
            <h2 className="text-center text-lg font-bold  text-yellow-400 md:text-xl">
              Income Distribution
            </h2>
            <p className="text-center text-sm text-slate-100 md:text-[0.85rem] lg:text-base">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
            </p>
          </div>
          <div className=" h-[22rem] w-full flex-1  md:h-[28rem] md:w-2/3  lg:h-[28rem] lg:w-3/4">
            <HistogramDatasetTransition
              income={income.val}
              isMax={income.isMax}
            />
          </div>
          <div className=" w-full  max-md:hidden max-md:px-1 md:w-1/3 lg:w-1/4">
            <h2 className="text-center text-lg font-bold  text-yellow-400 md:text-xl">
              Income Distribution
            </h2>
            <p className="text-center text-sm text-slate-100 md:text-[0.85rem] lg:text-base">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
            </p>
          </div>
        </div>
        <div className="flex flex-col  items-center justify-center gap-2 md:flex-row">
          <div className="max-md:mt-3 max-sm:-mt-3 md:w-1/3 lg:w-1/4">
            <h2 className="text-center text-lg font-bold text-yellow-400 md:text-xl">
              Income Percentile
            </h2>
            <p className="text-center text-sm text-slate-100 md:text-[0.89rem] lg:text-base">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
            </p>
          </div>
          <div className="box-content h-[21rem] w-full rounded-xl bg-opacity-30  px-8 py-14 max-md:-mt-5 md:w-2/3 lg:h-[22rem] lg:w-3/4">
            <LinePlot
              sex={sex}
              data={incomePercentile}
              incomee={income.val}
              isMax={income.isMax}
            />
          </div>
        </div>
      </div>
      <motion.div
        initial={isSmallScreen ? { scaleY: 1 } : { scaleX: 1 }}
        animate={
          isSmallScreen
            ? { scaleY: 0, transition: { duration: 0.4, ease: "circOut" } }
            : { scaleX: 0, transition: { duration: 0.4, ease: "circOut" } }
        }
        exit={
          isSmallScreen
            ? { scaleY: 1, transition: { duration: 0.4, ease: "circIn" } }
            : { scaleX: 1, transition: { duration: 0.4, ease: "circIn" } }
        }
        style={
          isSmallScreen
            ? { originY: isPresent ? 0 : 1 }
            : { originX: isPresent ? 1 : 0 }
        }
        className={`fixed bottom-0 left-0 right-0 top-0 z-40 ${
          sex === "Male" ? "bg-male-light" : "bg-female-light"
        }`}
      />
      <Link to="/">Back</Link>
    </div>
  );
};
