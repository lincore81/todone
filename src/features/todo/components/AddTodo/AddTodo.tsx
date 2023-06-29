import { Dispatch, FormEventHandler, FunctionComponent, SetStateAction, useState } from "react";
import { useDispatch } from "react-redux";
import { add } from "../../slice";
import Button from "@/components/atoms/Button/Button";
import { classes } from "@/app/util";
import { Plus } from "@phosphor-icons/react";

const ADD_TO_BUCKET = "default";

const AddTodo: FunctionComponent = () => { 
  const [value, setValue] = useState("");
  const dispatch = useDispatch();
  const invalid = !value.trim();

  return <form 
    onSubmit={onSubmit(dispatch, value, setValue)}
    className="w-full h-10 flex flex-row gap-4 relative"
  >
    <input 
      type="text" 
      value={value} 
      className="pr-10 flex-1 rounded-md border border-white bg-transparent text-white placeholder:italic text-center placeholder:text-center placeholder:text-sm placeholder:text-white"
      placeholder="Enter a new task"
      aria-label="Task description"
      onChange={e => setValue(e.currentTarget.value)}
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
    ><Plus className="w-full h-full scale-75"/></Button>
</form>;
};

type OnSubmitFunction = (
  dispatch: ReturnType<typeof useDispatch>, 
  value: string, 
  setValue: Dispatch<SetStateAction<string>>
) => FormEventHandler;

const onSubmit: OnSubmitFunction = (dispatch, value, setValue) => e => {
  e.preventDefault();
  if (value.trim()) {
    dispatch(add({bucket: ADD_TO_BUCKET, description: value}));
    setValue("");
  }
};

export default AddTodo;