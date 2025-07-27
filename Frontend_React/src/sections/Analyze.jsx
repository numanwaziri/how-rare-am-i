import { motion, useIsPresent } from "framer-motion";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Link } from "react-router-dom";
import { LinePlot } from "../components/LinePlot.jsx";
import HistogramDatasetTransition from "../components/Histogram/HistogramDatasetTransition.jsx";
import { useEffect } from "react";
export const Analyze = ({ sex, income }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isPresent = useIsPresent();
  useEffect(() => {
    window.scroll({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  return (
    <div className="min-h-screen flex-col items-center justify-center px-3 py-4 sm:flex sm:p-4 md:p-8">
      <div className="w-full ">
        <div className="flex flex-col items-center justify-center gap-2 px-2 text-center text-4xl font-bold text-slate-100 max-lg:mb-4 max-sm:text-2xl md:gap-4">
          <p>
            Annual Income Analysis
            <br />
            <span className="text-3xl text-yellow-400 max-sm:text-2xl">
              {income.val / 1000}k {income.isMax ? "Maximum" : "Minimum"}
            </span>
          </p>
          <p className="text-left text-base font-[500] max-md:text-sm">
            <span className="rounded-lg bg-slate-950 bg-opacity-20 px-2 py-1 text-yellow-400">
              NOTE:
            </span>{" "}
            Income data is collected for individuals aged 15 and older, so all income statistics are limited to this age group.

          </p>
        </div>
        <div className="mb-2 flex flex-col items-center justify-center gap-6 rounded-xl bg-slate-950 bg-opacity-30 px-3 py-5 sm:p-5 md:flex-row md:gap-4 md:p-8  lg:mt-6 ">
          <div className=" md:w-1/3 lg:w-1/4">
            <h2 className="text-center text-lg font-bold text-yellow-400 md:text-xl">
              Income Percentile
            </h2>
            <p className="text-center text-sm text-slate-100 md:text-[0.89rem] lg:text-base">
              Toggle between male and female income percentiles with ease on
              this interactive line plot. Zoom in for closer analysis of
              selection on the curve. Explore income distribution and
              gender-based gaps effortlessly.
            </p>
          </div>
          <div className="-mt-8 box-content h-[21rem] w-full rounded-xl pb-12  pt-4 max-sm:h-[16rem] md:-mt-3 md:w-2/3 lg:h-[22rem] lg:w-3/4 ">
            <LinePlot sex={sex} incomee={income.val} isMax={income.isMax} />
          </div>
        </div>
        <div className=" flex flex-col items-center justify-center gap-2 rounded-xl bg-slate-950 bg-opacity-30 px-3 py-5 sm:p-5 md:flex-row md:gap-4 md:p-8 ">
          <div className=" mb-4 w-full max-md:px-1 md:hidden md:w-1/3 lg:w-1/4">
            <h2 className="text-center text-lg font-bold  text-yellow-400 md:text-xl">
              Income Distribution
            </h2>
            <p className="text-center text-sm text-slate-100 md:text-[0.85rem] lg:text-base">
              Explore income distribution effortlessly with this interactive
              histogram. Toggle between male and female data to compare
              distributions.
              <br />
              <span className="rounded-lg bg-slate-950 bg-opacity-30 px-2 py-1 text-yellow-400">
                NOTE:
              </span>{" "}
              the y-axis scale is square root transformed to visualize
              imbalances more effectively. You can also toggle to a linear scale
              for a different perspective.
            </p>
          </div>
          <div className=" -mt-8 h-[22rem] w-full flex-auto  md:h-[28rem] md:w-2/3  lg:h-[28rem] lg:w-3/4">
            <HistogramDatasetTransition
              income={income.val}
              isMax={income.isMax}
              sex={sex}
            />
          </div>
          <div className=" w-full  max-md:hidden max-md:px-1 md:w-1/3 lg:w-1/4">
            <h2 className="text-center text-lg font-bold  text-yellow-400 md:text-xl">
              Income Distribution
            </h2>
            <p className="text-center text-sm text-slate-100 md:text-[0.85rem] lg:text-base">
              Explore income distribution effortlessly with this interactive
              histogram. Toggle between male and female data to compare
              distributions.
              <br />
              <span className="rounded-lg bg-slate-950 bg-opacity-30 px-2 py-1 text-yellow-400">
                NOTE:
              </span>{" "}
              the y-axis scale is square root transformed to visualize
              imbalances more effectively. You can also toggle to a linear scale
              for a different perspective.
            </p>
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
      <Link
        to="/"
        className={`group relative mt-2 inline-flex items-center  justify-start self-start overflow-hidden rounded-xl ${
          sex === "Male" ? "bg-male-light" : "bg-female-light"
        } px-5 py-3 font-medium transition-all hover:bg-slate-100`}
      >
        <span className="absolute inset-0 rounded-xl border-0 border-slate-100 transition-all duration-100 ease-linear group-hover:border-[25px]"></span>
        <span
          className={`relative w-full text-center font-semibold text-slate-100 transition-colors duration-200 ease-in-out ${
            sex === "Male"
              ? "group-hover:text-male-light"
              : "group-hover:text-female-light"
          }`}
        >
          Back
        </span>
      </Link>
    </div>
  );
};
