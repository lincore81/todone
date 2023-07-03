import { RootState } from "@/app/store";
import { MINUTE, SECOND, classes, formatTime } from "@/app/util";
import Button from "@/components/atoms/Button/Button";
import { addTime } from "@/features/todo/slice";
import { Circle, FastForward, IconProps, Pause, Play, Rewind, SkipBack, SkipForward, Stop } from "@phosphor-icons/react";
import { FunctionComponent, useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { stop, start, togglePause, updateTimer, getPhaseTime, nextPhase, prevPhase } from "../../slice";
import ProgressBar from "@/components/atoms/ProgressBar/ProgressBar";
import workSound from "@assets/sounds/gong.mp3";
import breakSound from "@assets/sounds/guitar_twang.mp3";


const Tracker: FunctionComponent = () => {
  const state = useSelector((state: RootState) => state.tracker);
  const todo = useSelector((state: RootState) => state.todo);
  const dispatch = useDispatch();
  const timerId = useRef<number|undefined>(undefined);
  const isBreak = state.mode !== "stopped" && state.phase === "break";

  const hasTrackableTodo = useMemo(() => 
    !!Object.values(todo).find(x => x.find(y => !y.done)),
    [todo]);
  
  const phase = state.mode === "running" ? state.phase : undefined;
  const notches = state.mode !== "stopped" ? state.workSegmentsCompleted : 0;
  const mayAddtime = state.mode !== "stopped" && state.phase === "work" || state.addBreakTimeToTask;
  
  useEffect(() => phase ? playSound(phase) : undefined, [phase, notches]);

  useEffect(() => {
    !hasTrackableTodo && state.mode === "running" && dispatch(togglePause());
  }, [dispatch, hasTrackableTodo, state.mode]);

  useEffect(() => {
    if (isBreak) {
      document.body.classList.add("break");
    } else {
      document.body.classList.remove("break");
    }
  }, [isBreak]);

  useEffect(() => {
    if (timerId.current === undefined && state.mode === "running") {
      timerId.current = window.setInterval(() => {
        dispatch(updateTimer(INTERVAL));
        if (mayAddtime) {
          dispatch(addTime({bucket: "default", millis: INTERVAL}));
        }
      }, INTERVAL);
    } else if (timerId !== undefined && state.mode !== "running") {
      clearInterval(timerId.current);
      timerId.current = undefined;
    }
    if (timerId.current !== undefined)
      return () => window.clearInterval(timerId.current);
  }, [dispatch, mayAddtime, state.addBreakTimeToTask, state.mode]);
  return (
    <div 
      className={classes(
        "w-full flex flex-col gap-2",
        state.mode === "paused" && "animate-pulse",
        !hasTrackableTodo && "opacity-5"
    )}>
      <div className="w-full flex flex-row justify-center gap-1">
        <TrackerButtons />
        {state.mode !== "stopped" && 
          <div className={classes(
            "flex gap-4 font-digits text-3xl font-extrabold mr-2",
          )}>
            <p className={state.mode === "running" && state.timeLeft < 10 * SECOND ? "animate-ping" : ""}>
              {formatTime(state.timeLeft)}
            </p>
            <p>
              {state.phase}
            </p>
          </div>}
      </div>
      {state.mode !== "stopped" &&
        <ProgressBar 
          progress={state.timeLeft} 
          maxProgress={Math.max(state.timeLeft, getPhaseTime(state, state.phase))}
          className={classes(
          )}
          trackClassName="h-[2px]"
          trackStyle={{backgroundColor: "rgba(0, 0, 0, 0.3)"}}
        />
      }
      <Notches />
    </div>
  );
};

const playSound = (phase: "break" | "work") => {
  const src = phase === "break"? breakSound : workSound;
  const audio = new Audio(src);
  audio.play();
  return () => audio.pause();
};

const Notches: FunctionComponent = () => {
  const tracker = useSelector((state: RootState) => state.tracker);
  const Notch = ({gap, size}: {size?: string|number, gap?: boolean}) => 
    <Circle weight="bold" size={size ?? "10"} className={gap? "mr-2" : ""}/>;
  if (tracker.mode === "stopped" || !tracker.workSegmentsCompleted) {
    return <div></div>;
  } else if (tracker.workSegmentsCompleted > 12) {
    return <div className="w-full flex flex-row items-baseline justify-center gap-1">
      <Notch size="14" /> × {tracker.workSegmentsCompleted}
    </div>;
  } else {
    return <div className="flex flex-row justify-center gap-1">
      {Array(tracker.workSegmentsCompleted).fill(0).map((_, i) => 
        <Notch key={i} gap={(i+1) % 4 === 0}/>)}
    </div>;
  }
};

const TrackerButtons: FunctionComponent = () => {
  const tracker = useSelector((state: RootState) => state.tracker);
  const iconProps: IconProps = {weight: "regular",  size: 30};
  const dispatch = useDispatch();

  return tracker.mode === "stopped"
    ? <Button kind="primary" className="w-full min-h-[3rem] justify-center" onClick={() => dispatch(start())}>
        <Play aria-hidden /> Start
      </Button>
    : <div className={classes("flex flex-row", !tracker.simpleButtons && "mr-4")}>
        { !tracker.simpleButtons &&
          <Button kind="tool" onClick={() => dispatch(prevPhase())}>
            <SkipBack {...iconProps} alt="Previous"/>
          </Button>
        }
        { !tracker.simpleButtons &&
          <Button kind="tool" onClick={() => dispatch(updateTimer(-MINUTE))} title="Add 1 minute">
            <Rewind {...iconProps} alt="Add 1 minute"/>
          </Button>
        }
        <Button kind="tool" onClick={() => dispatch(togglePause())}>
        { tracker.mode === "running"
          ? <Pause {...iconProps} alt="Pause"/>
          : <Play {...iconProps} alt="Resume"/>
        }
        </Button>
        <Button kind="tool" onClick={() => dispatch(stop())}>
          <Stop {...iconProps} alt="Stop"/>
        </Button>

        { !tracker.simpleButtons &&
          <Button kind="tool" onClick={() => dispatch(updateTimer(MINUTE))} title="Subtract 1 minute">
            <FastForward {...iconProps} alt="Remove 1 minute"/>
          </Button>
        }
        { !tracker.simpleButtons &&
          <Button kind="tool" onClick={() => dispatch(nextPhase())}>
            <SkipForward {...iconProps} alt="Next"/>
          </Button>
        } 
    </div>;
};

const INTERVAL = 1_000;

export default Tracker;