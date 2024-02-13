import CustomCheckbox from "./CustomCheckbox";
import { memo } from "react";

const CheckboxGrid = memo(({ items, sex, value, setValue }) => {
  const handleCheckboxChange = (item, isChecked) => {
    // Update the value state based on the item that was changed
    setValue({ ...value, [item]: isChecked });
  };

  const areAllChecked = Object.values(value).every(Boolean);
  const areNoneChecked = Object.values(value).every((option) => !option);
  // Calculate the number of columns based on the number of items
  return (
    <div className="flex flex-1 items-center justify-center gap-3 transition-all">
      <div
        className={`justify-content-center grid flex-1 ${
          items.length == 4
            ? "grid-cols-4  max-md:grid-cols-2"
            : items.length == 1
              ? "grid-cols-1 "
              : "grid-cols-2"
        } justify-items-center gap-2 rounded-2xl max-sm:gap-1 max-sm:p-1`}
      >
        {items.map((item, index) => (
          <CustomCheckbox
            key={item}
            idx={item}
            dataName={item}
            sex={sex}
            checked={value[item]}
            onChange={(isChecked) => handleCheckboxChange(item, isChecked)}
          />
        ))}
      </div>

      <span
        className={`texte -ml-1 rounded text-left text-xs font-bold text-slate-100 transition-all duration-100  ${
          areAllChecked || areNoneChecked
            ? "-mr-5 scale-100 opacity-100 max-sm:-ml-2"
            : "-ml-12 scale-0 opacity-0 max-sm:-ml-14"
        }`}
      >
        {items.length === 4 ? "Any" : ""}
      </span>
    </div>
  );
});

export default CheckboxGrid;
