import { FunctionComponent } from "react";

export type LabelProps = {
  text: string,
}

const Label: FunctionComponent<LabelProps> = ({text}) => 
  <span>${text}</span>;

export default Label;