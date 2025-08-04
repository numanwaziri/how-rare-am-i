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
          <section>
            <h2 className="text-lg font-semibold text-yellow-400 my-2">Data Alignment</h2>
            <p className="text-base leading-relaxed">
              We use two national surveys (<strong>NHANES</strong> and{" "}
              <strong>ASEC</strong>) to estimate how rare or unique certain
              combinations of traits are. Although these surveys don’t include the
              same individuals, they both share key demographic data like age,
              gender, race, and marital status. This lets us filter both datasets in
              the same way and assume the filtered groups represent similar
              populations.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-yellow-400 my-2">
              Step 1: Establish a Baseline Using ASEC
            </h2>
            <p className="text-base leading-relaxed">
              We begin by filtering <strong>ASEC</strong> by a specific set of
              demographics such as Asian women aged 30–40 who are not married. Then we
              look at a variable that only exists in ASEC (ie. Income).
              Suppose 20% of survey population meets the demographic and Income condition.
              This 20% becomes our <strong>baseline rate</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-yellow-400 my-2">
              Step 2: Apply the Same Demographics to NHANES
            </h2>
            <p className="text-base leading-relaxed">
              Next, we filter <strong>NHANES</strong> using the exact same
              demographics. At this point, we do not care what the actual percentage
              of NHANES demographic-filtered population is (suppose its 60%). We assume that the NHANES group, filtered
              by demographics,
              represents the same kind of population as in ASEC. So we continue to
              use the <strong>20% baseline</strong> from ASEC here as well.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-yellow-400 my-2">Step 3: Add Variable Unique to NHANES</h2>
            <p className="text-base leading-relaxed">
              We now filter NHANES by a unique variable (weigth & heigth) in this survey. If this reduces the demographic filtered
              NHANES population from 60% to 30%,
              that’s a 50% drop.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-yellow-400 my-2">
              Step 4: Estimate the Final Combined Rate
            </h2>
            <p className="text-base leading-relaxed">
            We apply that 50% reduction to the original ASEC baseline. Since 20%
              of the demographic group met the NHANES condition, and the ASEC
              condition cuts that group in half, we estimate{" "}
              <strong>10%</strong> of the population meets <em>both</em> conditions.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-yellow-400 my-2 drop-shadow-lg">What’s the catch?</h2>
            <p className="text-base leading-relaxed">
            Health conditions in NHANES might be linked to income levels in ASEC. This method assumes that after
              matching people by demographics like age and race, the percentages from one survey can be applied to the
              other. In other words, it treats these traits as if they are independent for simplicity.
            </p>
            <p className="text-base leading-relaxed mt-2">
              This works well for quick, high-level estimates of how rare a combination is, but it doesn’t capture all
              real-world relationships. So, it’s not intended for detailed analysis or exact conclusions.
            </p>
          </section>


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
          <p className="mt-4 text-sm">
            Code for this project is available on my{" "}
            <a
                href="https://github.com/numanwaziri/perfect-partner-probability"
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-700 font-bold hover:text-yellow-900"
            >
              GitHub
            </a>
            .
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
          initial={isSmallScreen ? {scaleY: 1} : {scaleX: 1}}
          animate={
            isSmallScreen
                ? {scaleY: 0, transition: {duration: 0.4, ease: "circOut"}}
                : {scaleX: 0, transition: {duration: 0.4, ease: "circOut"}}
          }
          exit={
            isSmallScreen
                ? {scaleY: 1, transition: {duration: 0.4, ease: "circIn"}}
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
