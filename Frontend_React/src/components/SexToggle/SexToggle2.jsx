import { useState } from "react";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
export const SexToggle2 = ({ func1, func2 }) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
    if (!isChecked && func1) {
      func1();
    } else if (isChecked && func2) {
      func2();
    }
  };
  return (
    <>
      <label className=" relative inline-flex cursor-pointer select-none flex-col items-center">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
          className="sr-only"
        />
        <span className=" mb-1 text-xs text-slate-100">Gender Toggle</span>
        <div
          className={` flex h-[28px] w-[58px] items-center justify-center rounded-md border-2 bg-transparent   ${
            isChecked ? "border-female-light" : "border-male-light"
          } max-sm:h-[26px]`}
        >
          <span
            className={`flex h-7 w-9 items-center justify-center rounded-l text-slate-100 max-sm:h-[24px] max-sm:w-[2.35rem] ${
              !isChecked ? "bg-male-light" : " bg-slate-800 bg-opacity-40"
            }`}
          >
            <FemaleIcon />
          </span>
          <span
            className={`flex h-7 w-9 items-center justify-center rounded-r text-slate-100 max-sm:h-[24px] max-sm:w-[2.35rem] ${
              isChecked ? "e bg-female-light" : " bg-slate-800 bg-opacity-40"
            }`}
          >
            <MaleIcon />
          </span>
        </div>
      </label>
    </>
  );
};
