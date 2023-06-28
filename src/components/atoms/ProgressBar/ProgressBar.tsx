import { FunctionComponent, HTMLAttributes } from "react";
import { classes } from "@/app/util";

export type ProgressBarProps = {
  progress: number,
  maxProgress?: number,
  innerClassName?: string,
} & HTMLAttributes<HTMLDivElement>;

const ProgressBar: FunctionComponent<ProgressBarProps> = props => {
  const percent = Math.round((props.maxProgress 
    ? (props.progress / props.maxProgress)
    : props.progress) * 100);
  return (
    <div className={classes("border border-white rounded-full", props.className)}>
      <div 
        style={{width: `${percent}%`}}
        className={classes("box-border h-full bg-white rounded-full" , props?.innerClassName)}
      >
        {props.children}
      </div>
    </div>
  );
};

export default ProgressBar;