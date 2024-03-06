import { Link } from "react-router-dom";
import { CustomAccordion } from "../components/CustomAccordion.jsx";
import { motion, useIsPresent } from "framer-motion";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

export const About = ({ sex }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isPresent = useIsPresent();
  return (
    <div className="flex min-h-screen justify-center py-8 max-sm:py-6 sm:items-center">
      <div className=" w-4/5 max-sm:w-11/12">
        <h1 className="mb-4 text-5xl font-bold text-slate-100 transition-all max-sm:text-3xl">
          FAQs & Insights
        </h1>
        <h2 className="mb-8 text-lg text-slate-100 max-sm:text-base">
          A hub that pairs FAQs with detailed insights and supplemental
          information
        </h2>
        <CustomAccordion title="What datasets were used for this website?">
          <div className="">
            <li className="mb-3 font-bold text-yellow-400">
              Income and Demographic Information
            </li>
            The primary dataset utilized for analyzing income distributions and
            demographics is the{" "}
            <span className="rounded-sm bg-slate-400 bg-opacity-20 px-1 font-bold">
              2023 Annual Social and Economic Supplements by CPS (Current
              Population Survey)
            </span>
            . This survey comprehensively covers income, employment, poverty
            rates, and demographic factors like age, education, household
            structure, and location.
            <br />
            <br />
            <li className="mb-3 font-bold text-yellow-400">
              Health related information
            </li>
            For health-related insights such as height, weight and BMI, I
            referenced the{" "}
            <span className="rounded-sm bg-slate-400 bg-opacity-20 px-1 font-bold">
              2017-2020 National Health and Nutrition Examination Survey
              (NHANES)
            </span>
            . NHANES collects health data and demographics, including age,
            gender, race, education, and location, providing a broad
            understanding of health factors within various demographics.
          </div>
        </CustomAccordion>
        <CustomAccordion title="Race Clarification">
          In the datasets I used, specific racial categories such as{" "}
          <span className="rounded-sm bg-slate-400 bg-opacity-20 px-1 font-bold">
            pure Whites, pure Blacks, and Asians
          </span>{" "}
          are explicitly identified in both. Other racial categories present in
          the datasets are aggregated into the 'Other' category due to varied
          representation and ambiguity across the datasets.
        </CustomAccordion>
        <CustomAccordion title="Probability...?">
          In <span className="font-bold">empirical</span> contexts like in this
          website, 'probability' refers to the{" "}
          <span className="rounded-sm bg-slate-400 bg-opacity-20 px-1 font-bold">
            proportion or relative frequency
          </span>{" "}
          of a population (population weights provided in survey) meeting
          specific criteria. It represents the likelihood, expressed as a
          percentage, of finding individuals with desired qualities within the
          defined group.
        </CustomAccordion>
        <CustomAccordion title="Limitations and Assumptions">
          <li className="font-bold text-yellow-400">Data Alignment</li>
          <p className="py-3">
            Due to the absence of a direct relationship (primary key/foreign
            key) between the two datasets used, filtering in the analysis relies
            on shared demographic factors{" "}
            <span className="rounded-sm bg-slate-400 bg-opacity-20 px-1 font-bold">
              (sex, age, race, marital status)
            </span>
            between the <span className="font-bold">ASEC</span> and{" "}
            <span className="font-bold">NHANES</span> datasets which ensure
            targeting the same demographic groups across both datasets.
          </p>
          <br />
          <li className="font-bold text-yellow-400">
            Linear Approximation (Independence)
          </li>
          <div className="py-3">
            <h2 className="mb-2  font-semibold">
              1. Impact Analysis within NHANES
            </h2>
            <p className="mb-4">
              The analysis involves examining factors like{" "}
              <span className="font-bold">height/weight/BMI</span> within the
              National Health and Nutrition Examination Survey (
              <span className="font-bold">NHANES</span>). It measures their
              impact, expressed as a percentage increase or decrease from the
              baseline (demographic-filtered data) within the{" "}
              <span className="font-bold">NHANES</span> dataset.
            </p>

            <h2 className="mb-2  font-semibold">2. Estimation within ASEC</h2>
            <p className="mb-4">
              The impact recorded in <span className="font-bold">NHANES</span>{" "}
              is then used to estimate how similar changes might affect the
              Annual Social and Economic Supplements (
              <span className="font-bold">ASEC</span>) survey dataset since both
              datasets filtered and targeted the same demographic groups.
              <span className="rounded-sm bg-slate-400 bg-opacity-20 px-1 font-bold">
                However
              </span>
              , this method assumes similarities in impacts across datasets.
              While aiming for a{" "}
              <span className="rounded-sm bg-slate-400 bg-opacity-20 px-1 font-bold">
                close approximation
              </span>{" "}
              of effects between datasets, it acknowledges potential limitations
              due to complexities and dependencies among variables within these
              groups.
            </p>
          </div>
        </CustomAccordion>
        <CustomAccordion title="About the Website">
          <p>
            Inspired by
            <span className="rounded-sm bg-slate-400 bg-opacity-20 px-1 font-bold">
              <a
                href="https://realitycalc.com/"
                target="_blank"
                rel="noreferrer"
              >
                Male Reality Calculator
              </a>
            </span>
            , I undertook this personal full-stack project. Built from the
            ground up, this website is focused on responsiveness and
            interactivity, and aims to deliver a seamless functionality across
            all devices. It utilizes <span className="font-bold">React</span>{" "}
            for the dynamic front-end components and{" "}
            <span className="font-bold">Django</span> Rest Framework for the
            powerful backend infrastructure.
          </p>
        </CustomAccordion>

        <Link
          to="/"
          className={`group relative mt-2 inline-flex  items-center justify-start overflow-hidden rounded-xl ${
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
        <span className=" block w-full text-right text-xs text-slate-300">
          Numan@2023
        </span>
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
    </div>
  );
};
