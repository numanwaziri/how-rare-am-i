import { Pictogram } from "../components/Pictogram.jsx";
import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import useMediaQuery from "@mui/material/useMediaQuery";
import CountUp from "react-countup";
import { useTheme } from "@mui/material/styles";
export const Results = ({
  data,
  setData,
  sex,
  age,
  weight,
  race,
  income,
  height,
  exclude,
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isLargeScreen = useMediaQuery(theme.breakpoints.down("lg"));
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const handleNewSearch = (e) => {
    e.preventDefault();

    scrollToTop();

    // Delay setting data to null after scrolling to the top
    setTimeout(() => {
      setData(null); // Set data to null after a delay
    }, 1000);
  };
  const sortedArray = Object.entries(data)
    .filter(
      ([key, value]) => value !== null && value != 1 && key.includes("sex"),
    )
    .sort((a, b) => b[1] - a[1]);
  const formatRaceList = (raceList, plural = false) => {
    const formattedList = plural
      ? raceList.map((race) => `${race}s`)
      : raceList;

    if (formattedList.length > 1) {
      const lastRace = formattedList.pop();
      return `${formattedList.join(", ")} and ${lastRace}`;
    }
    return formattedList.join("");
  };
  function handleCriteria() {
    let criteria = [];

    if (!exclude.Married) criteria.push("any marital status");
    else criteria.push("not married");

    // if (!exclude["BMI>30"]) criteria.push("any weight");
    // else criteria.push("Maximum BMI is 30");
    if (weight) {
      const weightMin = weight[0];
      const weightMax = weight[1];
      const minValue = 29.4835;
      const maxValue = 256.27968905;
      let text;
      if (weightMin === minValue && weightMax !== maxValue) {
        text = `max weight ${Math.round(weightMax * 2.20462262185)} lbs`;
      } else if (weightMax === maxValue && weightMin !== minValue) {
        text = `mix weight ${Math.round(weightMin * 2.20462262185)} lbs`;
      } else if (weightMin !== minValue && weightMax !== maxValue) {
        text = `weight between ${Math.round(
          weightMin * 2.20462262185,
        )}-${Math.round(weightMax * 2.20462262185)} lbs`;
      } else {
        text = "any weight";
      }

      criteria.push(text);
    }

    //
    //

    const allRaces = Object.values(race).every((value) => value);
    const noRaces = Object.values(race).every((value) => !value);
    const selectedRaces = Object.entries(race)
      .filter(([race, isSelected]) => isSelected)
      .map(([race, _]) => race);

    const excludedRaces = Object.entries(race)
      .filter(([race, isSelected]) => !isSelected && race !== "Other")
      .map(([race, _]) => race);

    if (allRaces || noRaces) {
      criteria.push("any race");
    } else if (selectedRaces.includes("Other")) {
      criteria.push(`any race except ${formatRaceList(excludedRaces)}`);
    } else {
      criteria.push(`${formatRaceList(selectedRaces)} race only`);
    }

    if (height.val != 121.92) {
      criteria.push(
        `${height.isMax ? "at most" : "at least"} ${Math.floor(
          height.val / 2.54 / 12,
        )}'${Math.round((height.val / 2.54) % 12)}" tall`,
      );
    } else criteria.push("any height");

    if (income.val != 0) {
      criteria.push(
        `${income.isMax ? "at most" : "at least"} $${income.val} annual income`,
      );
    } else criteria.push("any income");

    criteria.push(`age between ${age[0]}-${age[1]}`);

    return criteria;
  }
  const criteria = handleCriteria();
  function handleRaceProportion(value, proportion, sex = "None", age = "None") {
    const races = {
      White: "White",
      Black: "Black",
      Asian: "Asian",
      Other: "Other",
    };
    const selectedRaces = Object.entries(value)
      .filter(([race, isSelected]) => isSelected)
      .map(([race, _]) => races[race]);
    const proportionText = `${formatValue(proportion)}%`;

    const genderText = sex !== "None" ? ` ${sex}s` : "";
    const ageText =
      age !== "None"
        ? `, between the ages of ${age[0]} and ${age[1]}, in US`
        : ", over the age of 18 in US";
    const demographicText = genderText
      ? `${genderText}${ageText}`
      : `${ageText}`;

    if (selectedRaces.includes("Other")) {
      const excludedRaces = Object.keys(races)
        .filter((race) => !value[race] && race !== "Other")
        .map((race) => races[race]);
      return `${proportionText} of ${genderText}, excluding ${formatRaceList(
        excludedRaces,
        true,
      )}${ageText}`;
    } else {
      return `${proportionText} of all ${formatRaceList([
        ...selectedRaces,
      ])} ${demographicText}`;
    }
  }

  // Function to format  float the value based on its size
  const formatValue = (value) => {
    const numberValue = parseFloat(value);
    if (!isNaN(numberValue)) {
      // Multiply by 100 and format
      const percentageValue = numberValue * 100;

      if (percentageValue < 1) {
        // Check for trailing zeros after the decimal point
        const formattedValue = percentageValue.toFixed(4);
        const trimmedValue = formattedValue.replace(/\.?0+$/, ""); // Remove trailing zeros

        return trimmedValue === "0" ? "0" : trimmedValue;
      } else {
        return percentageValue.toFixed(2);
      }
    }
  };

  const generateAdditionalDetails = () => {
    let messages = [];
    for (const [key, value] of sortedArray) {
      switch (key) {
        case "proportion_in_sex":
          messages.push(
            `${formatValue(value)}% of all ${sex}s over the age of 18 in US`,
          );
          continue;
        case "proportion_in_sex_race":
          messages.push(handleRaceProportion(race, value, sex));
          continue;
        case "proportion_in_age_sex_race":
          messages.push(handleRaceProportion(race, value, sex, age));
          continue;
        default:
          // Handle any unexpected keys
          continue;
      }
    }
    return messages;
  };

  const myMessages = generateAdditionalDetails();

  // The main figure displayed
  const sexAgeTuple = sortedArray.find(
    ([key]) => key === "proportion_in_age_sex",
  );
  const sexTuple = sexAgeTuple
    ? null
    : sortedArray.find(([key]) => key === "proportion_in_sex");

  const MemoizedPictogram = useMemo(
    () => (
      <Pictogram
        data={data}
        sex={sex}
        activePointsRatio={
          sexAgeTuple
            ? formatValue(sexAgeTuple[1] / 100)
            : formatValue(sexTuple[1] / 100)
        }
        totalPoints={isSmallScreen ? 150 : isLargeScreen ? 300 : 400}
        color={sex === "Male" ? "#1f90ce" : "#b78060"}
        activeColor="#f1f5f9"
      />
    ),
    [sexAgeTuple], // Dependency array - recompute when sexAgeTuple changes
  );

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <div className=" flex h-full w-full flex-1 flex-col items-center ">
      <div
        className={`mt-6 w-full rounded-xl bg-slate-600 bg-opacity-5 p-6 pt-4 text-center text-xl tracking-wide text-slate-100 shadow-lg ring-1 ${
          sex === "Male" ? "ring-slate-400" : "ring-[#75a294] ring-opacity-80"
        }    ease-out-expo max-sm:mt-4 max-sm:p-4 max-sm:text-base ${
          visible
            ? "scale-100 opacity-100   duration-[4s]"
            : "scale-[80%] opacity-80  duration-[4s]"
        }`}
      >
        <span
          className={`block  pb-2 font-extrabold tracking-wider ${
            sex === "Male" ? "text-yellow-500" : "text-[#8cbeac]"
          }`}
        >
          CRITERIA
        </span>
        <div className="grid grid-cols-1 gap-1.5 md:grid-cols-2 ">
          {criteria.map((c, index) => {
            return (
              <div
                key={index}
                className={`flex rounded-lg  bg-slate-100 bg-opacity-5 p-1 text-center `}
              >
                <div className="m-auto ">{c}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-6 h-60 w-full bg-opacity-20  text-center max-sm:h-52     ">
        <div className="  text-slate-100 max-md:pb-3">
          <span className=" max-sm:leading-relaxed  sm:text-xl">
            {sexAgeTuple ? (
              <h2>
                According to the US{" "}
                <Link
                  to="/about"
                  className={`rounded-lg bg-slate-400 bg-opacity-20 px-2 py-0.5 font-semibold  ${
                    sex === "Male" ? "text-yellow-400" : "text-[#8cbeac]"
                  }`}
                >
                  National Survey Data{" "}
                </Link>
                <br />
                the{" "}
                <span
                  className={`rounded-lg bg-slate-400 bg-opacity-20 px-2 py-0.5 font-extrabold tracking-widest  ${
                    sex === "Male" ? "text-yellow-500" : "text-[#8cbeac]"
                  }`}
                >
                  <Link to="/About">probability</Link>
                </span>{" "}
                of a{" "}
                <span className="font-extrabold tracking-wider">{sex}</span> in
                US, between the ages of{" "}
                <span className="font-extrabold tracking-wider">{age[0]}</span>{" "}
                and{" "}
                <span className="font-extrabold tracking-wider">{age[1]}</span>{" "}
                to meet your{" "}
                <span
                  className={`font-extrabold tracking-widest ${
                    sex === "Male" ? "text-yellow-500" : "text-[#8cbeac]"
                  }`}
                >
                  criteria
                </span>{" "}
                is
              </h2>
            ) : (
              <h2>
                According to{" "}
                <Link
                  to="/about"
                  className={`rounded-lg bg-slate-400 bg-opacity-20 px-2 py-0.5 font-semibold  ${
                    sex === "Male" ? "text-yellow-400" : "text-[#8cbeac]"
                  }`}
                >
                  National Survey Data{" "}
                </Link>
                <br />
                the{" "}
                <span
                  className={`rounded-lg bg-slate-400 bg-opacity-20 px-2 py-0.5 font-extrabold tracking-widest  ${
                    sex === "Male" ? "text-yellow-500" : "text-[#8cbeac]"
                  }`}
                >
                  probability
                </span>{" "}
                for a{" "}
                <span className="font-extrabold tracking-wider">{sex}</span> to
                meet your{" "}
                <span
                  className={`font-extrabold tracking-widest ${
                    sex === "Male" ? "text-yellow-500" : "text-[#8cbeac]"
                  }`}
                >
                  criteria
                </span>{" "}
                is
              </h2>
            )}
          </span>
          <br />
          <span
            className={`px-2 ${
              formatValue(sexAgeTuple?.[1]) == 0 ||
              formatValue(sexTuple?.[1]) == 0
                ? `-mt-3 inline-block pb-5 text-2xl font-semibold tracking-wide ${
                    sex === "Male" ? "text-rose-500" : "text-amber-400"
                  } drop-shadow-[0_1px_1px_rgba(0,0,0,1)] max-md:text-xl max-sm:-mt-3 max-sm:pb-4 max-sm:text-lg`
                : "-mt-3 inline-block pb-5 text-6xl font-semibold tracking-wide text-slate-100 drop-shadow-[0_1px_1px_rgba(0,0,0,1)] max-md:text-5xl max-sm:-mt-4 "
            }`}
          >
            {formatValue(sexAgeTuple?.[1]) == 0 ||
            formatValue(sexTuple?.[1]) == 0 ? (
              "Criteria set to the stars! No survey matches found, so chances are close to zero. However, outliers might still surprise us in this vast universe!"
            ) : sexAgeTuple ? (
              <CountUp
                end={formatValue(sexAgeTuple[1])}
                duration="4"
                decimals={formatValue(sexAgeTuple[1]) < 1 ? 4 : 2}
                easingFn={(t, b, c, d) => {
                  const x = t / d;
                  return x < 0.5
                    ? ((1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2) * c + b // ease-out
                    : ((Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2) * c +
                        b; // ease-in
                }}
              />
            ) : (
              <CountUp
                end={formatValue(sexTuple[1])}
                duration="4"
                decimals={formatValue(sexTuple[1]) < 1 ? 4 : 2}
              />
            )}
            {formatValue(sexAgeTuple?.[1]) == 0 ||
            formatValue(sexTuple?.[1]) == 0
              ? ""
              : "%"}
          </span>
        </div>
        <div
          className={` transition-scale mx-auto -mt-5 mb-2 h-full w-full   sm:-mt-3 ${
            visible
              ? "scale-[102%] delay-[3.6s] duration-[1.5s]"
              : "scale-95 delay-[3.6s] duration-[1.5s]"
          } `}
        >
          {formatValue(sexAgeTuple?.[1]) == 0 ||
          formatValue(sexTuple?.[1]) == 0 ? (
            <SentimentVeryDissatisfiedIcon
              className={`mt-4  ${
                sex === "Male" ? "text-rose-500" : "text-amber-400"
              } drop-shadow-[0_1px_1px_rgba(0,0,0,1)]`}
              sx={{ fontSize: "12rem" }}
            />
          ) : (
            MemoizedPictogram
          )}
        </div>
        <div>
          {formatValue(sexAgeTuple?.[1]) == 0 ||
            formatValue(sexTuple?.[1]) == 0 || (
              <>
                <div className="relative flex items-center py-3">
                  <div className="flex-grow border-t border-gray-400"></div>
                  <span className="mx-4 flex-shrink text-xl text-slate-100 max-sm:text-lg">
                    Which is
                  </span>
                  <div className="flex-grow border-t border-gray-400"></div>
                </div>
                <div className=" flex justify-center gap-4 rounded-xl  bg-opacity-70 p-2 max-md:flex-col max-sm:p-1">
                  {myMessages.map((msg) => {
                    return (
                      <h2
                        className={`flex-1 rounded-xl bg-slate-400 bg-opacity-5 p-4 text-center text-lg tracking-wide text-slate-100 shadow-lg ring-1 max-sm:text-base ${
                          sex === "Male"
                            ? "ring-slate-400"
                            : "ring-[#75a294] ring-opacity-80"
                        } md:w-1/4`}
                      >
                        <span
                          className={`rounded-lg text-2xl font-bold ${
                            sex === "Male"
                              ? "text-yellow-500"
                              : "text-[#8cbeac]"
                          }`}
                        >
                          {msg.split("%")[0]}%
                        </span>
                        <br />
                        {msg.split("%")[1]}
                      </h2>
                    );
                  })}
                </div>
              </>
            )}
        </div>
        <div className="mx-2 mt-6  flex items-center justify-center gap-3">
          <a
            href="#"
            onClick={handleNewSearch}
            className={`group relative inline-block inline-flex flex-1 items-center justify-start overflow-hidden rounded-xl max-sm:h-11 ${
              sex === "Male" ? "bg-male-light" : "bg-female-light"
            } px-5 py-3 font-medium transition-all hover:bg-slate-100`}
          >
            <span className="absolute inset-0 rounded-xl border-0 border-slate-100 transition-all duration-100 ease-linear group-hover:border-[25px]"></span>
            <span
              className={`relative w-full whitespace-nowrap text-center font-semibold text-slate-100 transition-colors duration-200 ease-in-out max-sm:text-sm ${
                sex === "Male"
                  ? "group-hover:text-male-light"
                  : "group-hover:text-female-light"
              }`}
            >
              <SearchIcon sx={{ fontSize: 21 }} />
              New Search
            </span>
          </a>
          <Link
            to="/about"
            className={`group relative inline-block inline-flex flex-1 items-center justify-start overflow-hidden rounded-xl max-sm:h-11 ${
              sex === "Male" ? "bg-male-light" : "bg-female-light"
            } px-5 py-3 font-medium transition-all hover:bg-slate-100`}
          >
            <span className="absolute inset-0 rounded-xl border-0 border-slate-100 transition-all duration-100 ease-linear group-hover:border-[25px]"></span>
            <span
              className={`relative w-full whitespace-nowrap text-center font-semibold text-slate-100 transition-colors duration-200 ease-in-out max-sm:text-sm ${
                sex === "Male"
                  ? "group-hover:text-male-light"
                  : "group-hover:text-female-light"
              }`}
            >
              FAQs & Insights
            </span>
          </Link>
        </div>
        <div className="h-4"></div>
        <span className="block w-full pb-3 pr-3 text-right text-xs text-slate-300">
          Numan@2023
        </span>
      </div>
    </div>
  );
};
