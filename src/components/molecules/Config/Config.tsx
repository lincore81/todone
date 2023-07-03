import { FunctionComponent, useState } from "react";

import Button from "@components/atoms/Button/Button";
import { GearSix, GithubLogo, X } from "@phosphor-icons/react";
import { RootState } from "@/app/store";
import { useDispatch, useSelector } from "react-redux";
import { MINUTE, classes } from "@/app/util";
import Slider from "@/components/atoms/Slider/Slider";
import { configureAddBreakTime, configureBreakTime, configurePlayAudio, configureSimpleButtons, configureWorkTime } from "@/features/tracker/slice";


const ConfigModal: FunctionComponent<{visible: boolean, setVisible: (_:boolean) => void}> = ({visible, setVisible}) => {
  const tracker = useSelector((state: RootState) => state.tracker);
  const dispatch = useDispatch();
  return <div>
    <div 
      className={classes(visible 
        ? "fixed left-0 right-0 top-0 bottom-0 bg-black bg-opacity-20"
        : "hidden")}
      onClick={() => setVisible(false)}
    />
    <section className={classes(
        "fixed right-0 top-0 bottom-0 z-20 bg-black bg-opacity-80 backdrop-blur-sm transition-all",
        visible ? "max-md:left-0 max-md:bottom-0 lg:w-80 opacity-100" : "w-0 opacity-0")}
      >
      <div className="flex flex-col mx-4 my-2 gap-4">
        <h1 className="text-xl font-digits">Config</h1>
        <Slider 
          showValue={true} 
          label="Work time" 
          min={5} max={120} step={5}
          value={Math.round(tracker.workTime / MINUTE)} 
          formatValue={value => `${value}m`}
          onChange={value => dispatch(configureWorkTime(value * MINUTE))}
        />
        <Slider 
          showValue={true} 
          label="Break time" 
          min={1} max={30}
          value={Math.round(tracker.breakTime / MINUTE)} 
          formatValue={value => `${value}m`}
          onChange={value => dispatch(configureBreakTime(value * MINUTE))}
        />
        <label className="flex flex-row items-center gap-2">
          <input 
          type="checkbox"
          checked={tracker.addBreakTimeToTask}
          onChange={e => dispatch(configureAddBreakTime(e.currentTarget.checked))}
          />
          Add breaks to time worked on task
        </label>
        <label className="flex flex-row items-center gap-2">
          <input 
            type="checkbox"
            checked={tracker.playAudio}
            onChange={e => dispatch(configurePlayAudio(e.currentTarget.checked))}
          />
          Play sound
        </label>
        <label className="flex flex-row items-center gap-2">
          <input 
            type="checkbox"
            checked={!tracker.simpleButtons}
            onChange={e => dispatch(configureSimpleButtons(!e.currentTarget.checked))}
          />
          More tracker controls
        </label>
      </div>
    </section>
  </div>;
};

const Config: FunctionComponent = () => {
  const [isShowing, setIsShowing] = useState(false);
  return <div>
    <div className="fixed right-2 top-2 z-30 flex flex-row">
      <Button 
        kind="tool" 
        aria-label="Github repository" 
        className="hover:invert scale-125 hover:scale-150"
        onClick={() => window.open("https://github.com/lincore81/todone", "_blank")}
      > <GithubLogo /> </Button>
      <Button 
        kind="tool" 
        aria-label="Configure" 
        className="hover:invert scale-125 hover:scale-150"
        onClick={() => setIsShowing(!isShowing)}
      >
        {isShowing ?  <X /> : <GearSix />}
      </Button>
    </div>
    <ConfigModal visible={isShowing} setVisible={setIsShowing} />
  </div>;
};

export default Config;