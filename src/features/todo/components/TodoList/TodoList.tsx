import { FunctionComponent, useEffect, useState } from "react";
import { Todo, move } from "../../slice";
import TodoItem from "../TodoItem/TodoItem";
import { useDispatch } from "react-redux";
import { inserted } from "@/app/util";
import usePropState from "@/app/hooks/usePropState";

export type TodoListProps = {
  todos: Todo[],
  id: string|number,
}


const DROPPER = "dropper";


const TodoList: FunctionComponent<TodoListProps> = ({todos, id}) => {
  const dispatch = useDispatch();
  const [state, setState] = usePropState<(Todo|typeof DROPPER)[]>(todos);
  const [placeholderIndex, setPlaceholderIndex] = useState<number|undefined>(undefined);
  const [dragIndex, setDragIndex] = useState<number|undefined>(undefined);

  useEffect(() => { 
    placeholderIndex === undefined 
    || placeholderIndex === dragIndex 
    ? todos
    : setState(inserted<Todo|typeof DROPPER>(todos, DROPPER, placeholderIndex));
  }, [todos, placeholderIndex, setState, dragIndex]);

  return <ul 
    className="flex flex-col gap-4 w-full items-stretch">
    {state.map((t, i) => t === DROPPER
      ? <DndPlaceholder key={i} 
        onDrop={() => dispatch(move({fromIndex: dragIndex ?? 0, toIndex: i}))} />
      : <DndTodoItem 
        todo={t} index={i} key={t.id} listId={id}
        onDragStart={setDragIndex} 
        onDragOver={setPlaceholderIndex}
        onDragEnd={() => {setDragIndex(undefined); setPlaceholderIndex(undefined);}}
      />
    )}
  </ul>;
};
  
export default TodoList;



type DndTodoItemProps = {
  todo: Todo,
  index: number,
  listId: number|string,
  onDragOver: (overIndex: number) => void,
  onDragStart: (index: number) => void,
  onDragEnd: () => void,
}

const DndTodoItem: FunctionComponent<DndTodoItemProps> = (props) => {
  const {todo, listId, index, onDragOver, onDragStart, onDragEnd } = props;
  return (
    <li 
      draggable 
      onDragEnter={e => {
        if (e.dataTransfer.getData("text/plain") == listId) {
          e.preventDefault();
          onDragOver(index);
        }
      }}
      onDragStart={e => {
        e.dataTransfer.setData("text/plain", String(listId));
        console.log("Dragging item from list:", listId);
        onDragStart(index);
      }}
      onDragEnd={onDragEnd}
    >
      <TodoItem todo={todo}/>
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