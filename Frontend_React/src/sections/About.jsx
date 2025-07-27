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
              2024 Annual Social and Economic Supplements by CPS (Current
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
              2021-2023 National Health and Nutrition Examination Survey
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
        <CustomAccordion title="Limitations and Assumptions">
          <li className="font-bold text-yellow-400">Data Alignment</li>
          <p className="py-3">
            Because the <strong>ASEC</strong> and <strong>NHANES</strong> datasets do not share a common identifier (like a primary/foreign key),
            alignment between them is based on shared demographic characteristics: <strong>sex, age, race,</strong> and <strong>marital status</strong>.
            This filtering ensures that both datasets focus on comparable demographic groups.
            Due to the absence of a direct relationship (primary key/foreign
            key) between the two survey datasets used, filtering in the analysis relies
            on shared demographic factors{" "}
          </p>
          <br />
          <li className="font-bold text-yellow-400">
            Linear Approximation (Independence)
          </li>
          <div className="py-3">
            <p>
              To estimate the effect of specific variables across two separate surveys, we assume that once both
              datasets are
              filtered by the same demographic criteria (e.g., age, sex, race, marital status), they represent similar
              underlying
              populations. This assumption allows us to link analyses across the datasets despite the absence of a
              shared
              identifier.
            </p>
            <br/>
            <p>
              In the first survey (e.g., <strong>NHANES</strong>), we filter the population by the selected demographic
              and measure the
              proportion that meets a particular condition, for example, 20% with a specific health status. This
              becomes the <strong>baseline rate</strong> within that demographic group.
            </p>
            <br/>
            <p>
              In the second survey (e.g., <strong>ASEC</strong>), we apply the <strong>same demographic filter</strong>,
              and then apply a variable unique to that dataset (e.g., income). We then observe how
              the
              proportion changes relative to the baseline. This change is interpreted as the potential impact of that
              unique factor,
              assuming demographic alignment holds between the datasets.
            </p>
            <br/>
            <p className="text-yellow-400">
              <strong>Note:</strong> This approach assumes that once both surveys are filtered by the same demographic group, they
              represent comparable populations. While this allows for meaningful cross-dataset comparisons, it may not fully
              capture deeper structural or behavioral differences between the two.
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
          <span
              className="absolute inset-0 rounded-xl border-0 border-slate-100 transition-all duration-100 ease-linear group-hover:border-[25px]"></span>
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
