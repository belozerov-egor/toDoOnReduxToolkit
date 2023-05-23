import {AddTodolistACType, ChangeFilterACType} from "./TodolistReduser";
import {Dispatch} from "redux";
import {taskApi, TasksTypeApi} from "../api/api.ts";
import {AppDispatch} from "../store/store.ts";

// export type TaskType = {
//     id: string
//     title: string
//     isDone: boolean
// }

export type SumType = TasksTypeApi

export type TaskObjectType = {
    [key: string]: SumType[]
}


const initialState: TaskObjectType = {}

export const TaskReducer = (state: TaskObjectType = initialState, action: ActionType): TaskObjectType => {
    console.log('TaskReducer')
    switch (action.type) {
        case 'ADD-TASK': {
            const newTask: SumType = {...action.payload.newTask, completed: false}
            return {...state, [action.payload.todolistId]: [newTask, ...state[action.payload.todolistId]]}
        }
        case "REMOVE-TASK": {
            return {
                ...state,
                [action.payload.todolistId]:
                    state[action.payload.todolistId].filter(task => task.id !== action.payload.id)
            }
        }
        case "CHANGE-TASK-STATUS": {
            return {
                ...state,
                [action.payload.todolistId]:
                    state[action.payload.todolistId].map(task => task.id === action.payload.taskId
                        ? {...task, completed: action.payload.check}
                        : task)
            }
        }
        case "CHANGE-TASK-VALUE": {
            return {
                ...state,
                [action.payload.todolistId]: state[action.payload.todolistId].map(task =>
                    task.id === action.payload.id
                        ? {...task, title: action.payload.newValue}
                        : task
                )
            }
        }
        case "ADD-TODO": {
            return {...state, [action.payload.newTodo.id]: []}
        }
        case "GET-TASKS": {
            return {
                ...state,
                [action.payload.todolistId]: action.payload.tasks.map(el => {
                    return (
                        {...el}
                    )
                })
            }
        }
        default:
            return state
    }

}
type ActionType = AddTaskACType
    | RemoveTaskACType
    | ChangeTaskStatusACType
    | ChangeTaskValueACType
    | AddTodolistACType
    | ChangeFilterACType
    | GetTasksACType

type AddTaskACType = ReturnType<typeof addTaskAC>
type RemoveTaskACType = ReturnType<typeof removeTaskAC>
type ChangeTaskStatusACType = ReturnType<typeof changeTaskStatusAC>
type ChangeTaskValueACType = ReturnType<typeof changeTaskValueAC>
type GetTasksACType = ReturnType<typeof getTasksAC>
export const addTaskAC = (todolistId: string, newTask: TasksTypeApi) => {
    return {
        type: 'ADD-TASK',
        payload: {
            todolistId,
            newTask
        }
    } as const
}

export const removeTaskAC = (id: string, todolistId: string) => {
    return {
        type: 'REMOVE-TASK',
        payload: {
            id,
            todolistId
        }
    } as const
}

export const changeTaskStatusAC = (todolistId: string, taskId: string, check: boolean) => {
    return {
        type: 'CHANGE-TASK-STATUS',
        payload: {
            todolistId,
            taskId,
            check
        }
    } as const
}

export const changeTaskValueAC = (todolistId: string, id: string, newValue: string) => {
    return {
        type: 'CHANGE-TASK-VALUE',
        payload: {
            todolistId,
            id,
            newValue
        }
    } as const
}

const getTasksAC = (todolistId: string, tasks: TasksTypeApi[]) => {
    return {
        type: 'GET-TASKS',
        payload: {
            todolistId,
            tasks
        }

    } as const
}
export const getTasksTC = (todolistId: string) => async (dispatch: Dispatch) => {
    try {
        const result = await taskApi.getTasks(todolistId)
        dispatch(getTasksAC(todolistId, result.data.items))
        console.log(result.data.items)
    } catch (e) {
        console.log(e)
    }
}

export const addTasksTC = (todolistId: string, title: string) => async (dispatch: Dispatch) => {
    try {
        const result = await taskApi.addTask(todolistId, title)
        dispatch(addTaskAC(todolistId, result.data.data.item))
    } catch (e) {
        console.log(e)
    }
}

export const deleteTaskTC = (todolistId: string, taskId: string) => async (dispatch: Dispatch) => {
    try {
        await taskApi.deleteTask(todolistId, taskId)
        dispatch(removeTaskAC(taskId, todolistId))
    } catch (e) {
        console.log(e)
    }
}

export const changeCompletedTC = (todolistId: string, taskId: string, completed: boolean, task: TasksTypeApi) =>
    async (dispatch: AppDispatch) => {
        try {
            await taskApi.changeTaskCompleted(todolistId, taskId, task)
            dispatch(changeTaskStatusAC(todolistId, taskId, completed))
        } catch (e) {
            console.log(e)
        }
    }

export const changeTitleTaskTC = (todolistId: string, id: string, newValue: string, task: TasksTypeApi)=>
    async (dispatch: AppDispatch)=> {
        try {
            await taskApi.changeTaskCompleted(todolistId, id, {...task,title:newValue})
            dispatch(changeTaskValueAC(todolistId, id, newValue))
        } catch (e) {
            console.log(e)
        }
}