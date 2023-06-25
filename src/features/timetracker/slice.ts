import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type TimePhase = "Work" | "Break";
export type TrackerState = "Stopped" | "Running" | "Paused";

const WORK_TIME = 25 * 60_000;
const BREAK_TIME = 5 * 60_000;

export type TimeTrackerState = {
  timeLeftMillis: number,
  phase?: TimePhase,
  tracker: TrackerState
}


const initialState: TimeTrackerState = {
  timeLeftMillis: WORK_TIME,
  tracker: "Stopped"
};

export const trackerSlice = createSlice({
  name: 'time-tracker',
  initialState,
  reducers: {
    addTime: (state, action: PayloadAction<number>) => {
      if (state.tracker === "Running") {
        state.timeLeftMillis += action.payload;
      }
    },
    nextPhase: (state) => {
      state.phase = state.phase === "Work" ? "Break" : "Work";
      state.timeLeftMillis = state.phase === "Work" ? WORK_TIME : BREAK_TIME;
      state.tracker = "Running";
    },
    pause: (state) => {
      state.tracker = "Paused";
    },
    run: (state) => {
      state.tracker = "Running";
    },
    stop: () => initialState
  },
});

export const {addTime, run, pause, nextPhase, stop} = trackerSlice.actions;
export type TrackerActions = keyof typeof trackerSlice.actions;
export default trackerSlice.reducer;