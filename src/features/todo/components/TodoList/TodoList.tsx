import { FunctionComponent, useEffect, useMemo, useState } from "react";
import { Todo, move } from "../../slice";
import TodoItem from "../TodoItem/TodoItem";
import { useDispatch, useSelector } from "react-redux";
import { classes, inserted } from "@/app/util";
import usePropState from "@/app/hooks/usePropState";
import { RootState } from "@/app/store";

export type TodoListProps = {
  bucket: string,
}


const DROPPER = "dropper";


const TodoList: FunctionComponent<TodoListProps> = ({bucket}) => {
  const dispatch = useDispatch();
  const tracker = useSelector((state: RootState) => state.tracker);
  const todo = useSelector((state: RootState) => state.todo);
  const todos = todo[bucket];
  const [state, setState] = usePropState<(Todo|typeof DROPPER)[]>(todos);
  const [placeholderIndex, setPlaceholderIndex] = useState<number|undefined>(undefined);
  const [dragIndex, setDragIndex] = useState<number|undefined>(undefined);
  const isDraggingUp = typeof dragIndex === "number" 
    && typeof placeholderIndex === "number" && dragIndex > placeholderIndex;
  const timeTrackedIndex = useMemo(() => todos.findIndex(t => !t.done), [todos]);
  const isTracking = tracker.addBreakTimeToTask || tracker.mode === "running" && tracker.phase === "work";
  useEffect(() => { 
    if ( placeholderIndex === undefined 
      || placeholderIndex === dragIndex
      || !isDraggingUp 
          && typeof dragIndex === "number" 
          && placeholderIndex < state.length - 1 
          && placeholderIndex - dragIndex === 1
      ) return;
    setState(inserted<Todo|typeof DROPPER>(todos, DROPPER, placeholderIndex));
  }, [todos, placeholderIndex, setState, dragIndex, isDraggingUp, state?.length]);

  return <ul className={classes(
    "flex flex-col gap-4 w-full items-stretch",
    bucket.endsWith(":done") && "opacity-75"
  )}>
    {state.map((t, i) => t === DROPPER
      ? <DndPlaceholder key={i} 
        onDrop={() => {
          const toIndex = isDraggingUp ? i : i - 1;
          dispatch(move({bucket, fromIndex: dragIndex ?? 0, toIndex}));
        }} />
      : <DndTodoItem 
        todo={t} index={i} key={t.id} mayDrop={dragIndex !== undefined}
        onDragStart={setDragIndex} 
        onDragOver={setPlaceholderIndex}
        onDragEnd={() => {setDragIndex(undefined); setPlaceholderIndex(undefined); setState(todos);}}
        isTimeTracked={isTracking && tracker.mode === "running" && i === timeTrackedIndex}
      />
    )}
  </ul>;
};
  
export default TodoList;



type DndTodoItemProps = {
  todo: Todo,
  index: number,
  isTimeTracked: boolean,
  mayDrop: boolean,
  onDragOver: (overIndex: number) => void,
  onDragStart: (index: number) => void,
  onDragEnd: () => void,
}

const DndTodoItem: FunctionComponent<DndTodoItemProps> = (props) => {
  const {todo, mayDrop, index, onDragOver, onDragStart, onDragEnd, isTimeTracked } = props;
  const [isEditing, setIsEditing] = useState(false);
  return (
    <li 
      draggable={!isEditing}
      onDragEnter={e => {
        e.preventDefault();
        if (mayDrop) onDragOver(index);
      }}
      onDragStart={() => {
        onDragStart(index);
      }}
      onDragEnd={onDragEnd}
    >
      <TodoItem todo={todo} isTimeTracked={isTimeTracked} setEditing={setIsEditing}/>
    </li>
  );
};

type DndPlaceholderProps = {
  onDrop: () => void,
};

const DndPlaceholder: FunctionComponent<DndPlaceholderProps> = ({onDrop}) => {
  const height = "40px"; //useMemo(() => getComputedStyle(dragged), [dragged]);
  return <div 
    onDrop={e => {e.preventDefault(); onDrop();}} 
    onDragOver={e => e.preventDefault()} 
    className="border-dashed border border-slate-200 rounded-md" 
    style={{height}}
  ></div>;
};