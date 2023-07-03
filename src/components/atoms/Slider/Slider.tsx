import { DetailedHTMLProps, FunctionComponent, InputHTMLAttributes, useMemo, useState } from "react";
import { v4 as uuid } from "uuid";

export type SliderProps = { 
  label?: string, 
  min?: number, max?: number, step?: number, value?: number
  showValue: boolean, 
  formatValue?: (value: number) => string, 
  inputAttribs?: DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  onChange: (value: number) => void,
};


const Slider: FunctionComponent<SliderProps> = (props) => {
  const [value, setValue] = useState<number>(props.value ?? props.inputAttribs?.value as number ?? 1);
  const inputId = useMemo(uuid, []);
  return <div className="w-full grid gap-4 items-center" style={{gridTemplateColumns: "30% 50% 20%"}}>
    { props.label && <label htmlFor={`slider-${inputId}`}>{props.label}</label> }
    <input 
      {...props.inputAttribs} 
      min={props.min ?? props.inputAttribs?.min ?? 10}
      max={props.max ?? props.inputAttribs?.max ?? 1}
      step={props.step ?? props.inputAttribs?.step ?? 1}
      type="range" 
      id={inputId} 
      value={value} 
      onChange={e => {
        const val = parseInt(e.currentTarget.value);
        setValue(val); 
        props.onChange(val);
      }} />
    { props.showValue && <p>{props.formatValue?.(value) ?? value}</p> }
  </div>;
};

export default Slider;