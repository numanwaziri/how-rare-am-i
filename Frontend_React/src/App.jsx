import { useState, useRef, useEffect } from "react";
import { Header } from "./sections/Header.jsx";
import { Form } from "./sections/Form.jsx";
import { Results } from "./sections/Results.jsx";

import useSessionStorageState from "./hooks/useSessionStorageState.js";
import createApiRequest from "./utils/apiUtils.js";

function App({ sex, setSex, sexColors }) {
  const resultSection = useRef(null);

  const [height, setHeight] = useSessionStorageState("height", {
    val: 152.4,
    isMax: false,
  });
  const [income, setIncome] = useSessionStorageState("income", {
    val: 0,
    isMax: false,
  });
  const [age, setAge] = useSessionStorageState("age", [20, 37]);
  const [race, setRace] = useSessionStorageState("race", {
    White: false,
    Black: false,
    Asian: true,
    Other: false,
  });
  const [exclude, setExclude] = useSessionStorageState("exclude", {
    Obese: false,
    Married: true,
  });
  const [isLoading, setIsLoading] = useSessionStorageState("isLoading", false);
  const [fetchedData, setFetchedData] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    const URL = createApiRequest(sex, height, income, age, race, exclude);
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
        <div className="title">
          <Header sex={sex} />
        </div>
        <div className="content">
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
          className=" flex min-h-screen flex-col  justify-center bg-opacity-25 px-3 transition-all ease-custom-bezier  sm:px-4 md:px-6 lg:px-8 "
          ref={resultSection}
        >
          <Results
            data={fetchedData}
            setData={setFetchedData}
            sex={sex}
            height={height}
            income={income}
            age={age}
            race={race}
            exclude={exclude}
          />
        </section>
      )}
    </div>
  );
}

export default App;
