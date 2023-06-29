import TodoList from "@/features/todo/components/TodoList/TodoList";
import { useSelector } from "react-redux";
import { RootState } from "./store";
import AddTodo from "@/features/todo/components/AddTodo/AddTodo";
// import { Cake } from "@phosphor-icons/react";
import ProgressBar from "@/components/atoms/ProgressBar/ProgressBar";
import { useState } from "react";


// const AllDone = () => 
//   <div className="flex flex-col items-center rounded-full border-2 border-white bg-opacity-80 aspect-square p-8 ">
//     <Cake size={32} weight="light" />
//     <p>all done</p>
//   </div>;

function App() {
  const todos = useSelector((state: RootState) => state.todo);
  const [progress, setProgress] = useState(0);
  setInterval(() => {
    setProgress((Date.now() / 10000) % 1);
  }, 1000);
  return (
    <main className="flex flex-col mx-auto mt-8 max-md:px-4 md:w-1/2 gap-8 content-center items-center">
      <AddTodo />
      <TodoList todos={todos["default"]} bucket="default" />
      <ProgressBar 
        progress={progress} 
        className="w-full h-4 p-1 border-opacity-75" 
        innerClassName="bg-green-500"/>
    </main>
  );
}

export default App;
