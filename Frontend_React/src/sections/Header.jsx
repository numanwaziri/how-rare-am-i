import { memo } from "react";
export const Header = memo(({ sex }) => {
  return (
    <header className=" px-3 pt-12 max-sm:pb-6 max-sm:pt-6 sm:px-4 md:px-6 ">
        <h2
            className={`flex flex-col items-center justify-center text-center font-sans text-5xl font-[800]  tracking-wide text-slate-100 transition-all ease-custom-bezier max-lg:text-4xl ${
                sex === "Male"
                    ? `rotate-2 [text-shadow:_-1px_2px_2px_black]`
                    : `-rotate-2 [text-shadow:_1px_2px_2px_black]`
            }`}
        >
            {/*Perfect*/}
            {/*<br className="hidden max-sm:block" /> Partner*/}
            {/*{sex === "Male" ? "♂" : "♀"}*/}
            {/*<br />{" "}*/}
            <span> {window.innerWidth < 500 ? '' : <em>Just</em>} How Rare Am I?</span>
            <span
                className={`block w-80 translate-y-2 rounded-full p-1.5 text-2xl shadow-xl transition-all max-lg:w-52 max-md:w-44 max-md:text-xl md:mt-1 ${
                    sex == "Male" ? "bg-male-light" : "bg-female-light"
                }`}
            >
          In the U.S.
        </span>
        </h2>
        <div className="flex  justify-center">
        <span
          className={` transition-all ease-custom-bezier ${
            sex === "Male" ? "rubber-male " : "rubber-female"
          }`}
        >
         <a href="https://github.com/numanwaziri"  target="_blank" rel="noopener noreferrer">By Ahmad Nouman Waziri</a>
        </span>
      </div>
    </header>
  );
});
