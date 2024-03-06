import { memo } from "react";
import React from "react";
export const SexToggle = memo(({ sex, setSex }) => {
  const options = ["Male", "Female"]; // options array

  const handleChange = (e) => {
    setSex(e.target.value);
  };
  return (
    //
    <div className="relative inset-0 flex items-center justify-center  shadow-xl">
      <div
        className={`tabs  relative flex w-full rounded-xl  bg-slate-100 p-1 ring-1 ring-opacity-60 ${
          sex === "Male" ? "ring-male-dark" : "ring-female-dark"
        }`}
      >
        <span
          className={`  absolute flex h-10 w-[calc(50%-0.25rem)]  transition duration-300 ease-custom-bezier  max-lg:h-9  max-sm:h-8
            ${
              sex === "Male"
                ? `w-[calc(50%-0.5rem)]  rounded-l-lg bg-male-light`
                : `translate-x-full rounded-r-lg bg-female-light`
            }
          `}
        ></span>
        {options.map((opt) => {
          return (
            <React.Fragment key={opt}>
              <input
                type="radio"
                id={opt}
                name="tabs"
                value={opt}
                checked={sex === opt}
                onChange={handleChange}
                className="hidden"
              />
              <label
                className={`tab z-10 flex h-10 w-1/2 cursor-pointer items-center justify-center text-lg font-bold transition-all max-lg:h-9 max-lg:text-base  max-sm:h-8 max-sm:text-sm ${
                  sex === opt
                    ? "text-white"
                    : `${
                        sex === "Female" ? "text-female-dark" : "text-male-dark"
                      }`
                }`}
                htmlFor={opt}
              >
                {opt}
              </label>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
});
