import { Routes, Route, useLocation } from "react-router-dom";
import { About } from "./sections/About.jsx";
import App from "./App.jsx";
import { Fireflies } from "./components/Fireflies/Fireflies.jsx";
import { useEffect, useMemo } from "react";
import useSessionStorageState from "./hooks/useSessionStorageState.js";
import { AnimatePresence } from "framer-motion";
import { Analyze } from "./sections/Analyze.jsx";
export const AppRouter = () => {
  const sexColors = useMemo(
    () => ({
      maleLight: "#219be1",
      femaleLight: "#C98A68",
      maleDark: "#223a52",
      femaleDark: "#523C2F",
    }),
    [],
  );
  const [income, setIncome] = useSessionStorageState("income", {
    val: 30000,
    isMax: false,
  });
  // Get the sex value from session storage if it exists, default to 'Male'
  const [sex, setSex] = useSessionStorageState("sex", "Male");
  useEffect(() => {
    // Update body style based on sex
    document.body.style.background =
      sex === "Male" ? sexColors.maleDark : sexColors.femaleDark;
  }, [sex]);

  const location = useLocation();

  return (
    <div className="mx-auto max-w-screen-xl ">
      <Fireflies />
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route
            path="/*"
            element={
              <App
                sex={sex}
                setSex={setSex}
                sexColors={sexColors}
                income={income}
                setIncome={setIncome}
              />
            }
          />
          <Route path="/about" element={<About sex={sex} />} />
          <Route
            path="/analyze"
            element={<Analyze sex={sex} income={income} />}
          />
        </Routes>
      </AnimatePresence>
    </div>
  );
};
