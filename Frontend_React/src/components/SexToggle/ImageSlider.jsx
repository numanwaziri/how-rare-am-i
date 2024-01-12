import { memo } from "react";
import male from "../../assets/male.svg";
import female from "../../assets/female.svg";
export const ImageSlider = memo(({ sex }) => {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl shadow-xl ">
      <div
        className={`absolute flex h-full w-[200%] transition duration-300 ease-custom-bezier ${
          sex === "Male" ? "-translate-x-1/2" : "translate-x-0"
        }`}
      >
        <div className="flex  h-full w-1/2 items-center justify-center bg-female-light ">
          <img
            src={female}
            alt="Your SVG"
            className="h-[80%] w-[70%]   object-contain"
          />
        </div>
        <div className="flex  h-full w-1/2 items-center justify-center bg-male-light ">
          <img
            src={male}
            alt="Your SVG"
            className="h-[80%] w-[70%] object-contain"
          />
        </div>
      </div>
    </div>
  );
});
