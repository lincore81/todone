import { classes } from "@/app/util";
import { FunctionComponent, MutableRefObject, PropsWithChildren, useEffect, useMemo, useState } from "react";
import Card from "../Card/Card";

export type TooltipProps = PropsWithChildren<{
  elemRef: MutableRefObject<HTMLElement>;
}>;

const Tooltip: FunctionComponent<TooltipProps> = ({children, elemRef}) => {
  const [visible, setVisible] = useState(false);

  const [x, y] = useMemo(() => {
    const bounds = elemRef.current.getBoundingClientRect();
    return [
      window.scrollX + bounds.x + bounds.width/2,
      window.scrollY + bounds.y - 8
    ];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elemRef, innerWidth, innerHeight]);
  
  useEffect(() => {
    const elem = elemRef.current;
    const onEnter = () => setVisible(true);
    const onLeave = () => setVisible(false);
    elemRef.current.addEventListener("mouseenter", onEnter);
    elemRef.current.addEventListener("mouseleave", onLeave);
    return () => {
      elem.removeEventListener("mouseenter", onEnter);
      elem.removeEventListener("mouseleave", onLeave);
    };
  }, [elemRef]);
  
  return <div 
    id="tooltip"
    className={classes(
      visible ? "fixed" : "hidden",
      "-translate-x-1/2 -translate-y-full" 
    )}
    style={{left: x, top: y}}
  >
    <Card className="border border-black">
      {children}
    </Card>
  </div>;
};

export default Tooltip;