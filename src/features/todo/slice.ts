import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import {v4 as uuid} from "uuid";

import { moveInArray } from '../../app/util';

export type Todo = {
  description: string,
  /**
   * Either false or the timestamp when the task was marked as done.
   */
  done: false | number,
  timeWorkedOn: number,
  id: string,
};


export type TodoState = Todo[];

export const makeTodo = (description: string): Todo => ({
  description,
  done: false,
  id: uuid(),
  timeWorkedOn: 0,
});

const initialState: TodoState = [
  makeTodo("Buy groceries"),
  makeTodo("Make dentist appointment"),
  makeTodo("Have dinner"),
];

export const todoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: {
    add: (state, action: PayloadAction<string>) => {
      state.push(makeTodo(action.payload));
    },
    remove: (state, action: PayloadAction<string>) => {
      const index = state.findIndex(x => x.id === action.payload);
      if (index >= 0) {
        state.splice(index, 1);
      }
    },
    setDone: (state, action: PayloadAction<{uuid: string, done: boolean}>) => {
      const todo = state.find(({id}) => id === action.payload.uuid);
      if (todo) todo.done = action.payload.done ? Date.now() : false;
    },
    setDescription: (state, action: PayloadAction<{uuid: string, description: string}>) => {
      const todo = state.find(({id}) => id === action.payload.uuid);
      if (todo) todo.description = action.payload.description;
    },
    move: (state, action: PayloadAction<{fromIndex: number, toIndex: number}>) => {
      moveInArray(state, action.payload.fromIndex, action.payload.toIndex);
    },
  },
});

export const {add, remove, setDone, setDescription, move} = todoSlice.actions;
export type TodoActions = keyof typeof todoSlice.actions;
export default todoSlice.reducer;