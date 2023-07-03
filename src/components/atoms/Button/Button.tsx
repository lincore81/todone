import { gradientInteraction } from "@/app/theme";
import { classes } from "@/app/util";
import { ButtonHTMLAttributes, FunctionComponent } from "react";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label?: string,
  kind?: "primary" | "secondary" | "tool" | "tracker",
}; 

const Button: FunctionComponent<ButtonProps> = (props) => 
  <button 
    {...props}
    className={classes(
      "py-1 flex flex-row items-center gap-1",
      props?.disabled && "grayscale opacity-50",
      props?.kind === "primary" && gradientInteraction,
      props?.kind === "primary" && "text-gray-800 rounded-lg shadow-md hover:shadow-lg px-4",
      props?.kind === "tool" && "hover:text-rose-500 px-2",
      props?.kind === "tracker" && "hover:invert",
      props.className
    )}
    aria-disabled={props.disabled ?? props["aria-disabled"]}
    aria-label={props["aria-label"] ?? props.label}
    title={props["aria-label"]}
  >
    {props.children ?? props.label ?? "No label"}
  </button>;

export default Button;