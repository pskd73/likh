import { ComponentProps, createContext, useContext } from "react";
import { twMerge } from "tailwind-merge";
import Clickable from "./Clickable";

type OnValueChangeHandler = (val: string) => void;

type SelectContextType = {
  value: string;
  onValueChange: OnValueChangeHandler;
  disabled?: boolean;
};

const SelectContext = createContext<SelectContextType>({} as SelectContextType);

const Select = ({
  children,
  className,
  value,
  onValueChange,
  disabled,
  ...restProps
}: ComponentProps<"ul"> & {
  value: string;
  onValueChange: OnValueChangeHandler;
  disabled?: boolean;
}) => {
  return (
    <SelectContext.Provider value={{ value, onValueChange, disabled }}>
      <ul className={twMerge(className, "flex space-x-4")} {...restProps}>
        {children}
      </ul>
    </SelectContext.Provider>
  );
};

const Option = ({
  children,
  className,
  value,
  ...restProps
}: ComponentProps<"li"> & { value: string }) => {
  const {
    onValueChange,
    value: selectedValue,
    disabled,
  } = useContext(SelectContext);

  const handleClick = () => {
    onValueChange(value);
  };

  return (
    <li className={twMerge(className)} {...restProps}>
      {selectedValue === value ? (
        <span>{children}</span>
      ) : (
        <Clickable lite disabled={disabled} onClick={handleClick}>
          {children}
        </Clickable>
      )}
    </li>
  );
};

Select.Option = Option;

export default Select;
