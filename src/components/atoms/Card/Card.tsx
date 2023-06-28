import { FunctionComponent, HTMLAttributes } from "react";
import { classes } from "@/app/util";

export type CardProps = HTMLAttributes<HTMLDivElement>;
const Card: FunctionComponent<CardProps> = (props) => 
  <div {...props}
    className={classes(
      "bg-slate-200 text-slate-900 shadow-md rounded-md py-1 px-2",
      props.className
    )}>{props.children} 
  </div>;

export default Card;