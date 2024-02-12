import { ApiUrl } from "../Config.js";
const createApiRequest = (sex, height, income, age, weight, race, exclude) => {
  const params = new URLSearchParams();

  // Sex (1 for Male, 2 for Female)
  const sexValue = sex === "Male" ? 1 : 2;
  params.append("sex", sexValue);

  // Height
  const lowestHeight = 121.92; // Define the lowest height value
  if (height.val > lowestHeight) {
    const heightParam = height.isMax ? "height_max" : "height_min";
    params.append(heightParam, height.val);
  }

  // Income
  if (income.val > 0) {
    const incomeParam = income.isMax ? "income_max" : "income_min";
    params.append(incomeParam, income.val);
  }

  // Age range
  if (age[0] !== 18 || age[1] !== 85) {
    params.append("age_min", age[0]);
    params.append("age_max", age[1]);
  }

  // Weight range
  if (weight[0] !== 29.4835) params.append("weight_min", weight[0]);
  if (weight[1] !== 256.27968905) params.append("weight_max", weight[1]);

  // Race
  const allRaces = Object.values(race).every((value) => value);
  const noRaces = Object.values(race).every((value) => !value);
  const raceMapping = { White: 1, Black: 2, Asian: 3, Other: 4 };
  if (!allRaces && !noRaces) {
    Object.entries(race).forEach(([key, value]) => {
      if (value) {
        params.append("race", raceMapping[key]);
      }
    });
  }

  // Exclude
  if (exclude.Married) params.append("exclude_married", 1);

  return `${ApiUrl}?${params.toString()}`;
};

export default createApiRequest;
