import { CSSProperties, FunctionComponent, HTMLAttributes } from "react";
import { classes } from "@/app/util";

export type ProgressBarProps = {
  progress: number,
  maxProgress?: number,
  trackClassName?: string,
  trackStyle?: CSSProperties,
} & HTMLAttributes<HTMLDivElement>;

const ProgressBar: FunctionComponent<ProgressBarProps> = props => {
  const percent = Math.round((props.maxProgress 
    ? (props.progress / props.maxProgress)
    : props.progress) * 100);
  return (
    <div style={props.trackStyle} className={classes("w-full h-[1px] bg-black", props.trackClassName)}>
      <div 
        style={{width: `${percent}%`}}
        className={classes("box-border h-full bg-white rounded-full" , props?.className)}
      >
        {props.children}
      </div>
    </div>
  );
};

export default ProgressBar;