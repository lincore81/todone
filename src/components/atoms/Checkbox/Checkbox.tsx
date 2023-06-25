import { FunctionComponent, PropsWithChildren, useCallback } from "react";
import { Check } from "@phosphor-icons/react";
import { $ } from "@app/util";
import useUniqueId from "@/app/hooks/useUniqueId";
import { gradientInteraction } from "@/app/theme";


export type CheckboxProps = PropsWithChildren<{ 
  className?: string
  onChange: (checked: boolean) => void
  checked: boolean
}>

const CustomCheckbox: FunctionComponent<{checked: boolean}> = ({checked}) =>
  <div aria-hidden className={$(
      "border border-gray-600 rounded-md h-6 w-6 my-auto mr-2",
      checked && gradientInteraction,
      checked && "border-0")}>
    <Check weight="regular" className={$(
      "h-full w-full text-gray-800",
      checked ? "opacity-100" : "opacity-0 group-hover:opacity-80 group-hover:text-rose-500"
      )}/>
  </div>;


const Checkbox: FunctionComponent<CheckboxProps> = ({className, onChange, checked, children}) => {
  const id = useUniqueId("checkbox");
  const onClick = useCallback(
    () => onChange(!checked), [onChange, checked]);
  return (
    <div className={$(className, "flex flex-row group")} onClick={onClick}>
      <input 
        id={id}
        type="checkbox" 
        checked={checked}
        className="appearance-none"
        onChange={e => onChange(e.currentTarget.checked)}
      />
      <label className={$(className, "cursor-pointer flex flex-row")} htmlFor={id} >
        <CustomCheckbox checked={checked} />
        {children}
      </label>
    </div>
  );
};

export default Checkbox;