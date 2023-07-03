import { MINUTE, SECOND } from '@/app/util';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

type Phase = "work" | "break";

export type TrackerState = { 
  workTime: number,
  breakTime: number,
  addBreakTimeToTask: boolean,
  playAudio: boolean,
  simpleButtons: boolean,
} & ({
  mode: "stopped" 
} | {
  mode: "running" | "paused"
  phase: "work" | "break"
  timeLeft: number,
  workSegmentsCompleted: number,
});

export const getNextPhase = (phase?: Phase) => phase === "work" ? "break" : "work";
export const getPhaseTime = (state: TrackerState, phase?: Phase) => 
  phase === "work"
    ? state.workTime
    : state.breakTime;

const initialState: TrackerState = {
  mode: "stopped",
  simpleButtons: true,
  addBreakTimeToTask: true,
  playAudio: true,
  workTime: 25 * MINUTE,
  breakTime: 5 * MINUTE
};


export const trackerSlice = createSlice({
  name: "tracker",
  initialState: initialState as TrackerState,
  reducers: {
    updateTimer: (state, action: PayloadAction<number>) => {
      if (state.mode !== "running") return state;
      const timeLeft = state.timeLeft - action.payload;
      const next = getNextPhase(state.phase);
      return timeLeft > 0
        ? {...state, timeLeft}
        : {
          ...state, 
          phase: next, 
          timeLeft: getPhaseTime(state, next),
          workSegmentsCompleted: state.workSegmentsCompleted + (state.phase === "work" ? 1 : 0)
        };
    },
    prevPhase: (state) => {
      if (state.mode === "stopped") return state;
      const totalTime = getPhaseTime(state, state.phase);
      if (totalTime - state.timeLeft > 30 * SECOND) {
        return {...state, timeLeft: getPhaseTime(state, state.phase)};
      } else {
        const phase = getNextPhase(state.phase);
        return {
          ...state, 
          phase,
          timeLeft: getPhaseTime(state, phase),
          mode: "running"
        };
      }
    },
    nextPhase: (state) => {
      if (state.mode === "stopped") return state;
      const phase = getNextPhase(state.phase);
      const phaseTime = getPhaseTime(state, state.phase);
      const earnedNotch = state.phase === "work" && (phaseTime ? (phaseTime - state.timeLeft) / phaseTime : 0) > 0.5;
      return {
        ...state,
        phase,
        timeLeft: getPhaseTime(state, phase),
        mode: "running",
        workSegmentsCompleted: state.workSegmentsCompleted + (earnedNotch? 1 : 0)
      };
    },
    togglePause: (state) => {
      state.mode = state.mode === "paused" ? "running" : "paused";
    },
    start: (state) => {
       return {
        ...state,
        mode: "running",
        phase: "work",
        timeLeft: getPhaseTime(state, "work"),
        workSegmentsCompleted: 0,
        workTime: state.workTime || 25*1000,
        breakTime: state.breakTime || 5 * 1000
      };
    },
    stop: () => initialState,
    configureWorkTime: (state, action: PayloadAction<number>) => {
      if (0 <= action.payload && isFinite(action.payload)) {
        return { ...state, workTime: action.payload};
      } else {
        return state;
      }
    },
    configureBreakTime: (state, action: PayloadAction<number>) => {
      if (0 <= action.payload && isFinite(action.payload)) {
        return { ...state, breakTime: action.payload};
      } else {
        return state;
      }
    },
    configureAddBreakTime: (state, action: PayloadAction<boolean>) => {
      return { ...state, addBreakTimeToTask: action.payload};
    },
    configurePlayAudio: (state, action: PayloadAction<boolean>) => 
      ({ ...state, playAudio: action.payload}),
    configureSimpleButtons: (state, action: PayloadAction<boolean>) => 
      ({ ...state, simpleButtons: action.payload}),
  },
});

export const {
  updateTimer, 
  nextPhase, 
  prevPhase, 
  togglePause, 
  start, 
  stop,
  configureBreakTime,
  configureWorkTime,
  configureAddBreakTime,
  configurePlayAudio,
  configureSimpleButtons,
} = trackerSlice.actions;
export type TrackerActions = keyof typeof trackerSlice.actions;
export default trackerSlice.reducer;