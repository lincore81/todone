import TodoList from "@features/todo/components/TodoList/TodoList";
import AddTodo from "@features/todo/components/AddTodo/AddTodo";
// import { Cake } from "@phosphor-icons/react";
import Tracker from "@features/tracker/components/tracker/Tracker";
import { classes } from "./util";
import Config from "@/components/molecules/Config/Config";

// const AllDone = () => 
//   <div className="flex flex-col items-center rounded-full border-2 border-white bg-opacity-80 aspect-square p-8 ">
//     <Cake size={32} weight="light" />
//     <p>all done</p>
//   </div>;

function App() {
  return (
    <main className={classes( "flex flex-col max-w-full min-w-[360px] lg:min-w-[560px] w-max mt-8 max-md:px-4 gap-8 content-center items-center")}>
      <Config />
      <AddTodo />
      <Tracker />
      <TodoList bucket="default" />
      <TodoList bucket="default:done" />
    </main>
  );
}

export default App;
