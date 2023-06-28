import { FormEventHandler, FunctionComponent, HTMLAttributes, useState } from "react";
import { useDispatch } from 'react-redux';
import { DotsSixVertical, PencilSimpleLine, PencilSimpleSlash, Trash } from "@phosphor-icons/react";
import { v4 as uuid } from "uuid";

import Card from "@components/atoms/Card/Card";
import Button from "@/components/atoms/Button/Button";
import Checkbox from "@/components/atoms/Checkbox/Checkbox";
import { Todo, remove, setDescription, setDone } from "@features/todo/slice";
import { classes } from "@/app/util";

export type TodoItemProps = { todo: Todo }

type EditLabelProps = {
  value: string,
  setValue: (value: string) => void,
  submit: () => void,
  cancel: () => void,
}


const TodoItem: FunctionComponent<TodoItemProps> = ({todo}) => {
  const [value, setValue] = useState(todo.description);
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useDispatch();
  const stopEditing = () => setIsEditing(false);
  const submit = () => {
    dispatch(setDescription({uuid: uuid(), description: value}));
    stopEditing();
  };
  return (
    <Card className={classes("group flex pl-0 py-2 items-center", !!todo.done && "opacity-70")}>
      <DotsSixVertical className="mx-1 cursor-pointer" />
      <Checkbox 
        checked={!!todo.done}
        onChange={onItemChecked(dispatch, todo)} 
        className={isEditing ? "" : "flex-1"}
      >
        <Label className={isEditing ? "sr-only w-0" : ""}>
          {todo.description}
        </Label>
      </Checkbox>
      { isEditing
        ? <>
            <EditLabel value={value} setValue={setValue} submit={submit} cancel={stopEditing} />
            <CancelButton cancel={stopEditing} />
          </>
        : <EditButton setIsEditing={setIsEditing} />
      }
      <RemoveButton todo={todo} />
    </Card>
  );
};



type OnItemChecked = (dispatch: ReturnType<typeof useDispatch>, todo: Todo) 
  => (checked: boolean) => void;

const onItemChecked: OnItemChecked = (dispatch, todo) => (checked: boolean) => {
  dispatch(setDone({
    uuid: todo.id,
    done: checked
  }));
};


const Label: FunctionComponent<HTMLAttributes<HTMLLabelElement>> = (props) => {
  return (
    <label 
      {...props}
      className={classes("flex-1 cursor-pointer text-left", props.className)}
    > {props.children} </label>
  );
};

const CancelButton: FunctionComponent<{cancel: () => void}> = ({cancel}) =>
  <Button 
    onClick={cancel}
    kind="tool"
    aria-label="Cancel" 
    className="pr-1"
  >
    <PencilSimpleSlash aria-hidden className="scale-125" weight="thin" />
  </Button>;

const EditButton: FunctionComponent<{setIsEditing: (b:boolean) => void}> = ({setIsEditing}) =>
  <Button 
    onClick={() => setIsEditing(true)}
    kind="tool" 
    aria-label="Edit"
    className="pr-1 opacity-25 group-focus:opacity-100 focus:opacity-100 group-hover:opacity-100"
  >
    <PencilSimpleLine aria-hidden className="scale-125" weight="thin" />
  </Button> ;

const RemoveButton: FunctionComponent<{todo: Todo}> = ({todo}) => {
  const dispatch = useDispatch();
  return <Button 
    kind="tool" 
    aria-label="Remove"
    className="pl-1 opacity-25 group-focus:opacity-100 focus:opacity-100 group-hover:opacity-100"
    onClick={() => dispatch(remove(todo.id))}>
    <Trash aria-hidden className="scale-125" weight="thin" />
  </Button>;
};

const EditLabel: FunctionComponent<EditLabelProps> = ({value, setValue, submit, cancel}) => {
  const onSubmit: FormEventHandler<HTMLFormElement> = e => {
    e.preventDefault();
    if (value.trim()) submit();
  };

  return <form className="flex-1" onSubmit={onSubmit}>
    <input 
      type="text" 
      className="rounded-md flex-1 w-full border-0" 
      onChange={e => setValue(e.currentTarget.value)}
      value={value}
      aria-label="Description"
      placeholder="Enter a description"
      autoFocus
      onBlur={cancel}
      onFocus={e => e.currentTarget.select()}
      onKeyUp={e => e.key === "Escape" && cancel()}
    />
    <Button type="submit" className="sr-only" label="Submit" />
  </form>;
};


export default TodoItem;