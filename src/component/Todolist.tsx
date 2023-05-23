import {FC, memo, useCallback} from "react";
import {AddItemForm} from "./AddItemForm";
import {SpanInputForm} from "./SpanInputForm";
import {changeFilterAC, changeTitleTC, deleteTodoTC, FilterValueType} from "./reducers/TodolistReduser";
import {useAppDispatch, useAppSelector} from "./hooks/hooks";
import {addTasksTC} from "./reducers/TaskReducer";
import {Task} from "./Task.tsx";
import {TaskSelectors} from "./reducers/TaskSelectors.ts";


type PropsType = {
    todolistId: string
    title: string
    filter: FilterValueType



}

export const Todolist: FC<PropsType> = memo((props) => {
    const {
        todolistId,
        filter
    } = props
    // const dispatch: Dispatch= useDispatch()
    const tasks = useAppSelector(TaskSelectors)
    const dispatch = useAppDispatch()
    console.log(tasks)

    const filteredTasks = ()=> {
        const allTasks = tasks[todolistId] || []
       return  filter === 'active'
           ? allTasks.filter(el=> !el.completed)
           : filter === 'completed'
               ? allTasks.filter(el=> el.completed)
               : allTasks
    }

    const tasksAfterFilter = filteredTasks()


    function changeFilter(todolistId: string, value: FilterValueType,) {
        dispatch(changeFilterAC(todolistId, value))
    }
    const onAllClickHandler = () => changeFilter(todolistId, "all",)
    const onActiveClickHandler = () => changeFilter(todolistId, "active",)
    const onCompletedClickHandler = () => changeFilter(todolistId, "completed",)

    const addTaskHandler = (title: string) => {
        // dispatch(addTaskAC(todolistId,title))
        dispatch(addTasksTC(todolistId, title))
    }

    const deleteTodolistHandler = useCallback(() => {
        dispatch(deleteTodoTC(todolistId))
    }, [dispatch, todolistId])

    const changeTodolistTitle = useCallback((newValue: string) => {
        dispatch(changeTitleTC(todolistId, newValue))

    },[dispatch,todolistId])


    const tasksItem = tasksAfterFilter.map((t) => {
        return <Task todolistId={todolistId} taskId={t.id}/>
    })


    return (
        <div className="todolist">

            <div>
                <h3>
                    <SpanInputForm title={props.title} callBack={changeTodolistTitle}/>

                    <button onClick={deleteTodolistHandler}>
                        X
                    </button>
                </h3>

            </div>
            <AddItemForm callBack={addTaskHandler}/>
            <ul>
                {tasksItem}
            </ul>
            <div>


                <button className={props.filter === 'all' ? "active-filter" : ""} onClick={onAllClickHandler}>All
                </button>
                <button className={props.filter === 'active' ? "active-filter" : ""}
                        onClick={onActiveClickHandler}>Active
                </button>
                <button className={props.filter === 'completed' ? "active-filter" : ""}
                        onClick={onCompletedClickHandler}>Completed
                </button>
            </div>
        </div>
    );
})

