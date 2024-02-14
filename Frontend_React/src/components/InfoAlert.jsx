import React, { useState } from "react";
import useSessionStorageState from "../hooks/useSessionStorageState.js";

function InfoAlert({ title, children }) {
  const [dismissed, setDismissed] = useSessionStorageState(
    "closeDisclaimer",
    false,
  );

  const handleDismiss = () => {
    setDismissed(true);
  };

  return (
    <div
      id="alert-additional-content-5"
      className={`origin-top overflow-hidden rounded-lg border transition-all ${
        dismissed ? "-mb-12 h-0 scale-y-0" : "-mb-0 h-full scale-y-100"
      } border-gray-600 bg-slate-950 bg-opacity-40 p-4 sm:px-8 sm:pt-8`}
      role="alert"
    >
      <div className="flex items-center">
        <svg
          className="me-2 h-4 w-4 flex-shrink-0 text-gray-300"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
        </svg>
        <span className="sr-only">Info</span>
        <h3 className="text-lg font-medium  text-gray-300">{title}</h3>
      </div>
      <div className=" mb-4 mt-2 text-gray-300 max-sm:text-sm">{children}</div>
      <div className="flex">
        <button
          type="button"
          className="ml-auto h-8 w-[6.5rem] rounded-lg border border-gray-600 bg-transparent px-3 py-1.5 text-center text-xs font-medium tracking-widest text-gray-300 ring-1  ring-slate-100 hover:scale-100 hover:bg-gray-600 hover:text-white focus:outline-none focus:ring-4  focus:ring-gray-800"
          onClick={handleDismiss}
          aria-label="Close"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
export default InfoAlert;
