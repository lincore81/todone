import { ChangeEventHandler, FunctionComponent, KeyboardEventHandler, useState } from "react";
import Label, { LabelProps } from "@components/atoms/Label/Label";
import { 
  PencilSimpleLine as EditeIcon, 
  X as CloseIcon 
} from "@phosphor-icons/react";
import Button from "@/components/atoms/Button/Button";

type EditableLabelProps = LabelProps & {
  canEdit: boolean;
  mustNotBeEmpty?: boolean;
  onSubmit?: (value: string) => void;
  onChange?: (value: string) => void;
  onError?: (error: string) => void;
};

const EditableLabel: FunctionComponent<EditableLabelProps> = (props) => {
  const [isEditing, setIsEditing] = useState(false);
  const trySubmit = (value: string) => {
    if (props.mustNotBeEmpty && !value.trim()) { 
      props.onError?.("Must not be empty");
    } else {
      props.onSubmit?.(value);
    }
  };
  const onKeyHandler: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      trySubmit(e.currentTarget.value);
    }
  };
  const onChangeHandler: ChangeEventHandler<HTMLInputElement> = (e) => {
    props?.onChange?.(e.currentTarget.value);
  };
  const classes = "flex items-stretch"

  return !props.canEdit 
    ? <Label text={props.text} />
    : <div>
      { !isEditing
        ? <div className={classes}>
          <Label text={props.text} />
          <Button onClick={() => setIsEditing(true)}><EditeIcon/></Button>
        </div>
        : <div className={classes}>
          <input value={props.text} 
            onChange={onChangeHandler} onKeyUp={onKeyHandler} />
          <Button onClick={() => setIsEditing(false)}><CloseIcon /></Button>
        </div>
      }
    </div>;
};

export default EditableLabel;