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


export type TodoState = {[key: string]: Todo[]};

export const makeTodo = (description: string): Todo => ({
  description,
  done: false,
  id: uuid(),
  timeWorkedOn: 0,
});

const initialState: TodoState = {
  default: [ ],
  done: [ ],
};

const getTodo = (state: TodoState, uuid: string) => {
  const buckets = Object.values(state);
  const todos = ([] as Todo[]).concat(...buckets);
  return todos?.find(({id}) => id === uuid);
};

const getTodoLocation = (state: TodoState, uuid: string): [string|undefined, number] => {
  const bucket = Object.entries(state).find(([_, v]) => v.find(x => x.id === uuid));
  return bucket
    ? [bucket[0], bucket[1].findIndex(x => x.id === uuid)]
    : [undefined, -1];
};


export const todoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: {
    add: (state, action: PayloadAction<{bucket: string, description: string}>) => {
      state[action.payload.bucket]?.push(makeTodo(action.payload.description));
    },
    remove: (state, action: PayloadAction<string>) => {
      const [name, index] = getTodoLocation(state, action.payload);
      if (name && index >= 0) {
        state[name].splice(index, 1);
      }
    },
    setDone: (state, action: PayloadAction<{id: string, done: boolean}>) => {
      const todo = getTodo(state, action.payload.id);
      if (todo) todo.done = action.payload.done ? Date.now() : false;
    },
    setDescription: (state, action: PayloadAction<{id: string, description: string}>) => {
      const todo = getTodo(state, action.payload.id);
      if (todo) todo.description = action.payload.description;
    },
    move: (state, action: PayloadAction<{bucket: string, fromIndex: number, toIndex: number}>) => {
      const bucket = state[action.payload.bucket];
      if (bucket)
        moveInArray(bucket, action.payload.fromIndex, action.payload.toIndex);
    },
  },
});

export const {add, remove, setDone, setDescription, move} = todoSlice.actions;
export type TodoActions = keyof typeof todoSlice.actions;
export default todoSlice.reducer;