import { FunctionComponent } from "react";
import { Todo } from "../../slice";
import TodoItem from "../TodoItem/TodoItem";

export type TodoListProps = {
  todos: Todo[]
}

const DraggableTodoItem: FunctionComponent<{todo: Todo}> = ({todo}) => 
    <TodoItem todo={todo} key={todo.id} />;

const TodoList: FunctionComponent<TodoListProps> = ({todos}) => 
  <ul 
    className="flex flex-col gap-4 w-full items-stretch">
    {todos.map((t) => <DraggableTodoItem todo={t} />)}
  </ul>;
  
export default TodoList;