import { ChangeEventHandler } from "react";

const Toggle = ({
  id,
  checked,
  onChange,
}: {
  id: string;
  checked: boolean;
  onChange: ChangeEventHandler<HTMLInputElement>;
}) => {
  return (
    <label htmlFor={id} className="relative h-5 w-8 cursor-pointer">
      <input
        checked={checked}
        type="checkbox"
        id={id}
        className="peer sr-only"
        onChange={onChange}
      />

      <span className="absolute inset-0 rounded-full bg-gray-300 transition peer-checked:bg-primary-700"></span>

      <span className="absolute inset-y-0 start-0 m-1 h-3 w-3 rounded-full bg-white transition-all peer-checked:start-3"></span>
    </label>
  );
};

export default Toggle;
