import { memo } from "react";
import "./FancyButton.css";
export const FancyButton = memo(({ sex, fetchData, isLoading }) => {
  return (
    <button
      disabled={isLoading}
      onClick={fetchData}
      className={`custom-button flex h-full items-center justify-center transition-all ease-custom-bezier ${
        sex === "Male" ? "bg-gradient-male-btn" : "bg-gradient-female-btn"
      }`}
    >
      {isLoading ? (
        <div className="loader my-2 h-12 w-12 rounded-full border-8 border-slate-100"></div>
      ) : (
        "Go!"
      )}
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </button>
  );
});
