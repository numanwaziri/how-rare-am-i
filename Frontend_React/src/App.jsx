import { useState, useRef, useEffect } from "react";
import { Header } from "./sections/Header.jsx";
import { Form } from "./sections/Form.jsx";
import { Results } from "./sections/Results.jsx";
import { motion, useIsPresent } from "framer-motion";
import useSessionStorageState from "./hooks/useSessionStorageState.js";
import createApiRequest from "./utils/apiUtils.js";
import InfoAlert from "./components/InfoAlert.jsx";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
function App({ sex, setSex, sexColors }) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isPresent = useIsPresent();
  const resultSection = useRef(null);

  const [height, setHeight] = useSessionStorageState("height", {
    val: 160.02,
    isMax: false,
  });
  const [weight, setWeight] = useSessionStorageState(
    "weight",
    [29.4835, 201.849],
  );
  const [income, setIncome] = useSessionStorageState("income", {
    val: 0,
    isMax: false,
  });
  const [age, setAge] = useSessionStorageState("age", [22, 44]);
  const [race, setRace] = useSessionStorageState("race", {
    White: false,
    Black: false,
    Asian: true,
    Other: false,
  });
  const [exclude, setExclude] = useSessionStorageState("exclude", {
    // "BMI>30": false,
    Married: true,
  });
  const [isLoading, setIsLoading] = useSessionStorageState("isLoading", false);
  const [fetchedData, setFetchedData] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    const URL = createApiRequest(
      sex,
      height,
      income,
      age,
      weight,
      race,
      exclude,
    );
    try {
      const response = await fetch(URL);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setFetchedData(data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (fetchedData && resultSection.current) {
      resultSection.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [fetchedData]);

  return (
    <div className=" ">
      <section className=" flex min-h-screen flex-col justify-center   px-3 transition-all ease-custom-bezier  sm:px-4 md:px-6 lg:px-8 ">
        <div className="mt-4">
          <InfoAlert title="Disclaimer">
            This is a light-hearted project, intended to creatively showcase my
            skills in frontend and backend web development within the context of
            data analytics. There are no negative connotations associated with
            it.
          </InfoAlert>
        </div>
        <div className="title">
          <Header sex={sex} />
        </div>
        <div>
          <Form
            sex={sex}
            setSex={setSex}
            sexColors={sexColors}
            height={height}
            setHeight={setHeight}
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
            setFetchedData={setFetchedData}
            isLoading={isLoading}
          />
        </div>
      </section>

      {fetchedData && (
        <section
          className=" flex min-h-screen flex-col justify-center px-3 transition-all ease-custom-bezier  sm:px-4 md:px-6 lg:px-8 "
          ref={resultSection}
        >
          {" "}
          <div className="">
            <Results
              data={fetchedData}
              setData={setFetchedData}
              sex={sex}
              height={height}
              income={income}
              age={age}
              weight={weight}
              race={race}
              exclude={exclude}
            />{" "}
            {/*result compoenent with no zero is added again for alignment (doesn't affect performance as result is 0, won't trigger the d3 plot*/}
            <div className="invisible -translate-y-full">
              <Results
                data={{ ...fetchedData, proportion_in_age_sex: 0 }}
                setData={setFetchedData}
                sex={sex}
                height={300}
                income={income}
                age={age}
                race={race}
                exclude={exclude}
              />
            </div>
          </div>
        </section>
      )}
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
        className={`fixed bottom-0 left-0 right-0 top-0 z-40  ${
          sex === "Male" ? "bg-male-light" : "bg-female-light"
        }`}
      />
    </div>
  );
}

export default App;
