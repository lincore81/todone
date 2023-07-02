import { MINUTE } from '@/app/util';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

type Phase = "work" | "break";

export type TrackerState = {
  mode: "stopped" 
} | {
  mode: "running" | "paused"
  phase: "work" | "break"
  timeLeft: number,
  workSegmentsCompleted: number,
}

export const getNextPhase = (phase?: Phase) => phase === "work" ? "break" : "work";
export const getPhaseTime = (phase?: Phase) => (phase === "work" ? 25 : 5) * MINUTE;

const initialState: TrackerState = {
  mode: "stopped"
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
          timeLeft: getPhaseTime(next),
          workSegmentsCompleted: state.workSegmentsCompleted + (state.phase === "work" ? 1 : 0)
        };
    },
    nextPhase: (state) => {
      if (state.mode === "stopped") return state;
      state.phase = getNextPhase(state.phase);
      state.timeLeft = getPhaseTime(state.phase);
      state.mode = "running";
    },
    togglePause: (state) => {
      state.mode = state.mode === "paused" ? "running" : "paused";
    },
    start: (state) => {
       return {
        ...state,
        mode: "running",
        phase: "work",
        timeLeft: getPhaseTime("work"),
        workSegmentsCompleted: 0
      };
    },
    stop: () => initialState
  },
});

export const {updateTimer, nextPhase, togglePause, start, stop} = trackerSlice.actions;
export type TrackerActions = keyof typeof trackerSlice.actions;
export default trackerSlice.reducer;