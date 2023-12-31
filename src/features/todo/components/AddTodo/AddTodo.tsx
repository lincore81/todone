import { Dispatch, FormEventHandler, FunctionComponent, SetStateAction, useState } from "react";
import { useDispatch } from "react-redux";
import { append, prepend } from "../../slice";
import Button from "@/components/atoms/Button/Button";
import { classes } from "@/app/util";
import { Plus } from "@phosphor-icons/react";

const ADD_TO_BUCKET = "default";

type OnSubmitFunction = (
  dispatch: ReturnType<typeof useDispatch>,
  value: string,
  setValue: Dispatch<SetStateAction<string>>
) => FormEventHandler;

const AddTodo: FunctionComponent = () => {
  const [value, setValue] = useState("");
  const [ctrlDown, setCtrlDown] = useState(false);
  const dispatch = useDispatch();
  const invalid = !value.trim();

  const onSubmit: OnSubmitFunction = (dispatch, value, setValue) => e => {
    e.preventDefault();
    if (value.trim()) {
      const f = ctrlDown? prepend : append;
      dispatch(f({ bucket: ADD_TO_BUCKET, description: value }));
      setValue("");
    }
  };
  return <form
    onSubmit={onSubmit(dispatch, value, setValue)}
    className="w-full h-10 flex flex-row gap-4 relative"
  >
    <input
      type="text"
      value={value}
      className={classes(`flex-1 rounded-md border border-white bg-transparent text-white 
          placeholder:italic text-center placeholder:text-center placeholder:text-sm placeholder:text-white`,
        !invalid && "pr-10")}
      placeholder="Enter a new task"
      aria-label="Task description"
      onChange={e => setValue(e.currentTarget.value)}
      onKeyDown={e => {
        if (e.key === "Control") {
          setCtrlDown(true);
        }
      }}
      onKeyUp={e => {
        if (e.key === "Control") {
          setCtrlDown(false);
        }
      }}
      onBlur={() => setCtrlDown(false)}
    />
    <Button
      kind="tool"
      type="submit"
      disabled={invalid}
      className={classes(
        invalid && "hidden",
        "absolute w-10 right-0 top-0 bottom-0 bg-white text-black rounded-md"
      )}
      aria-label={invalid ? "Please enter a task first" : undefined}
    ><Plus className="w-full h-full scale-75" /></Button>
  </form>;
};




export default AddTodo;