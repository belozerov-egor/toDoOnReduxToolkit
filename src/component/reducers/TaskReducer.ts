import {taskApi, TasksTypeApi, UpdateTaskApiType} from "../api/api.ts";
import {createSlice} from "@reduxjs/toolkit";
import {createAppAsyncThunk} from "../utils/createAppAsyncThunk.ts";

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

export const getTasks = createAppAsyncThunk<{ todolistId: string, tasks: TasksTypeApi[] }, { todolistId: string }>(
    'tasks/getTasks', async (arg, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI
        try {
            const result = await taskApi.getTasks(arg.todolistId)
            return {
                todolistId: arg.todolistId,
                tasks: result.data.items
            }
        } catch (e) {
            console.log(e)
            return rejectWithValue(null)
        }
    })

export const addTasks = createAppAsyncThunk<{ todolistId: string, title: string, task: TasksTypeApi }, {
    todolistId: string,
    title: string
}>(
    'tasks/addTasks', async (arg, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI
        try {
            const result = await taskApi.addTask(arg.todolistId, arg.title)
            return {
                todolistId: arg.todolistId,
                title: arg.title,
                task: result.data.data.item
            }
        } catch (e) {
            console.log(e)
            return rejectWithValue(null)
        }
    })
export const deleteTask = createAppAsyncThunk<{ todolistId: string, taskId: string }, {
    todolistId: string,
    taskId: string
}>(
    'tasks/deleteTask', async (arg, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI
        try {
            await taskApi.deleteTask(arg.todolistId, arg.taskId)
            return {
                todolistId: arg.todolistId,
                taskId: arg.taskId
            }
        } catch (e) {
            console.log(e)
            return rejectWithValue(null)
        }
    })
export const changeTitleTask = createAppAsyncThunk<{
    todolistId: string,
    taskId: string,
    newValue: string
}, {
    todolistId: string
    taskId: string,
    newValue: string
}>(
    'tasks/changeTitleTask', async (arg, thunkAPI) => {
        const {dispatch, rejectWithValue, getState} = thunkAPI
        try {
            const state = getState()
            const allAppTasks = state.tasks
            const tasksForCliced = allAppTasks[arg.todolistId]
            const currentTask = tasksForCliced.find(el => el.id === arg.taskId)
            let model: UpdateTaskApiType={
                title: '',
                description: '',
                status: +'',
                priority: +'',
                startDate: '',
                deadline: ''
            }
            if (currentTask) {
                 model = {
                    title: arg.newValue,
                    description: currentTask.description,
                    status: currentTask.status,
                    priority: currentTask.priority,
                    startDate: currentTask.startDate,
                    deadline: currentTask.deadline
                }
            }
            await taskApi.changeTask(arg.todolistId, arg.taskId, model)
            return {
                todolistId: arg.todolistId,
                taskId: arg.taskId,
                newValue: arg.newValue
            }
        } catch (e) {
            console.log(e)
            return rejectWithValue(null)
        }
    })


// export const changeCompletedTC = (todolistId: string, taskId: string, completed: boolean, task: TasksTypeApi) =>
//     async (dispatch: AppDispatch) => {
//         try {
//             await taskApi.changeTaskCompleted(todolistId, taskId, task)
//             dispatch(changeTaskStatusAC(todolistId, taskId, completed))
//         } catch (e) {
//             console.log(e)
//         }
//     }
//
// export const changeTitleTaskTC = (todolistId: string, id: string, newValue: string, task: TasksTypeApi) =>
//     async (dispatch: AppDispatch) => {
//         try {
//             await taskApi.changeTaskCompleted(todolistId, id, {...task, title: newValue})
//             dispatch(changeTaskValueAC(todolistId, id, newValue))
//         } catch (e) {
//             console.log(e)
//         }
//     }


const slice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(getTasks.fulfilled, (state, action) => {
                return {
                    ...state,
                    [action.payload.todolistId]: action.payload.tasks
                }
            }
        )
            .addCase(addTasks.fulfilled, (state, action) => {
                const newTask: SumType = {...action.payload.task, completed: false}
                return {...state, [action.payload.todolistId]: [newTask, ...state[action.payload.todolistId]]}
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                return {
                    ...state,
                    [action.payload.todolistId]:
                        state[action.payload.todolistId].filter(task => task.id !== action.payload.taskId)
                }
            })
            .addCase(changeTitleTask.fulfilled, (state, action) => {
                return {
                    ...state,
                    [action.payload.todolistId]: state[action.payload.todolistId].map(task =>
                        task.id === action.payload.taskId
                            ? {...task, title: action.payload.newValue}
                            : task
                    )
                }
            })
    }
})

export const TaskReducer = slice.reducer
export const TaskAction = slice.actions
export const TaskThunks = {getTasks, addTasks, deleteTask, changeTitleTask}


//------------------------------------------------------------------------------------------------------------------------------------------


// export const TaskReducer = (state: TaskObjectType = initialState, action: ActionType): TaskObjectType => {
//     console.log('TaskReducer')
//     switch (action.type) {
//         case 'ADD-TASK': {
//             const newTask: SumType = {...action.payload.newTask, completed: false}
//             return {...state, [action.payload.todolistId]: [newTask, ...state[action.payload.todolistId]]}
//         }
//         case "REMOVE-TASK": {
//             return {
//                 ...state,
//                 [action.payload.todolistId]:
//                     state[action.payload.todolistId].filter(task => task.id !== action.payload.id)
//             }
//         }
//         case "CHANGE-TASK-STATUS": {
//             return {
//                 ...state,
//                 [action.payload.todolistId]:
//                     state[action.payload.todolistId].map(task => task.id === action.payload.taskId
//                         ? {...task, completed: action.payload.check}
//                         : task)
//             }
//         }
//         case "CHANGE-TASK-VALUE": {
//             return {
//                 ...state,
//                 [action.payload.todolistId]: state[action.payload.todolistId].map(task =>
//                     task.id === action.payload.id
//                         ? {...task, title: action.payload.newValue}
//                         : task
//                 )
//             }
//         }
//         case "ADD-TODO": {
//             return {...state, [action.payload.newTodo.id]: []}
//         }
//         case "GET-TASKS": {
//             return {
//                 ...state,
//                 [action.payload.todolistId]: action.payload.tasks.map(el => {
//                     return (
//                         {...el}
//                     )
//                 })
//             }
//         }
//         default:
//             return state
//     }
//
// }

