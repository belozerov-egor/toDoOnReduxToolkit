import {SpanInputForm} from "./SpanInputForm.tsx";
// import {changeCompletedTC, changeTitleTaskTC, deleteTaskTC} from "./reducers/TaskReducer.ts";
import {useAppDispatch, useAppSelector} from "./hooks/hooks.ts";
import {FC, memo, useCallback} from "react";

type PropsType = {
    todolistId: string
    taskId: string
}

export const Task: FC<PropsType> = memo(({todolistId, taskId}) => {
    const dispatch = useAppDispatch()
    const tasks = useAppSelector(state => state.tasks[todolistId].filter((t)=> t.id === taskId)[0])


    console.log(tasks)
    const onRemoveHandler = (id: string) => {
        // dispatch(deleteTaskTC(todolistId, id))

    }
    const onChangeHandler = (id: string, completed:boolean) => {
        // dispatch(changeCompletedTC(todolistId,id,completed, tasks))

    }
    const changeTaskValueHandler = useCallback((id: string, newValue: string) => {
        // dispatch(changeTitleTaskTC(todolistId, id, newValue, tasks))
    },[dispatch, todolistId])

    return (
        <li className={tasks.completed ? "is-done" : ""}>
            <input type={"checkbox"}
                   onChange={(e) => onChangeHandler(tasks.id,e.currentTarget.checked)}
                   checked={tasks.completed}/>

            <SpanInputForm title={tasks.title}
                           callBack={(newValue) => changeTaskValueHandler(tasks.id, newValue)}/>

            <button onClick={() => onRemoveHandler(tasks.id)}>
                X
            </button>
        </li>
    );
});

