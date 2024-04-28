import PropTypes from "prop-types";
import { useState } from "react";

const DropDown = (props) => {
  const [isOpened, setIsOpened] = useState(false);
  return (
    <div
      className="w-3/4 flex flex-col space-y-3 relative h-full"
      tabIndex={0}
      onBlur={(e) => {
        if (e.currentTarget === e.target) {
          setIsOpened(false);
        }
      }}
    >
      <div
        className={`bg-white rounded-xl px-5 py-2 flex justify-between shadow-md select-none cursor-pointer`}
        onClick={() => setIsOpened(!isOpened)}
      >
        <span className={`text-black text-sub-header-2 font-regular`}>
          {props.roleData}
        </span>
        <span
          className={`transition-all ${
            isOpened ? "rotate-180" : "rotate-0"
          } text-black material-symbols-outlined`}
        >
          expand_more
        </span>
      </div>
      {isOpened && (
        <div className="bg-white rounded-xl absolute w-full -bottom-[4.375rem] z-50 px-5 py-2 flex flex-col shadow-lg space-y-2">
          <span
            className="text-black text-sub-header-2 font-regular cursor-pointer select-none"
            onClick={() => {
              props.handleChange("Attendees");
              setIsOpened(false);
            }}
          >
            Attendees
          </span>
          <span
            className="text-black text-sub-header-2 font-regular cursor-pointer select-none"
            onClick={() => {
              props.handleChange("Creator");
              setIsOpened(false);
            }}
          >
            Creator
          </span>
        </div>
      )}
    </div>
  );
};

DropDown.propTypes = {
  roleData: PropTypes.string,
  handleChange: PropTypes.func,
};

export default DropDown;
