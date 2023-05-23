import  {ChangeEvent, KeyboardEvent, memo, useState} from "react";


type AddItemFormPropsType = {
    callBack: (title: string) => void
}
export const AddItemForm = memo((props: AddItemFormPropsType) => {
    const [newTaskTitle, setNewTaskTile] = useState("")
    const [error, setError] = useState<string | null>(null)


    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        setError(null)
        if (e.key === 'Enter') {
            props.callBack(newTaskTitle);
            setNewTaskTile("");

        }
    }

    const addTask = () => {
        if (newTaskTitle.trim() === "") {
            return setError("Ошибка!!!!!")
        } else {
            props.callBack(newTaskTitle);
            setNewTaskTile("");
        }
    }

    const onNewTaskTitleChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setNewTaskTile(e.currentTarget.value)
    }



    return (


        <div>
            <input
                className={error ? "error" : ""}
                value={newTaskTitle}
                onChange={onNewTaskTitleChangeHandler}
                onKeyUp={onKeyPressHandler}
            />

            {/*Кнопка добавить Таску!*/}
            {/*<button onClick={addTask}>+</button>*/}
            <button onClick={addTask}>+</button>
            {error && <div className="error-message">{error}</div>}
        </div>
    )
})