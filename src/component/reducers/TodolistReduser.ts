import {TodolistApiType, todosApi} from "../api/api.ts";
import {addTasksTC, getTasksTC, TaskThunks} from "./TaskReducer.ts";
import {createSlice} from "@reduxjs/toolkit";
import {createAppAsyncThunk} from "../utils/createAppAsyncThunk.ts";

export type FilterValueType = "all" | "completed" | "active"

type SumType = TodolistApiType & {
    filter: FilterValueType
}

type TodolistReducerType = SumType[]


const initialState: TodolistReducerType = [
    // {id: 'todolistId1', title: "Что сделать Егору", filter: "all"},
    // {id: 'todolistId2', title: "Что сделать Юле", filter: "all"},
]


// export const TodolistReducer = (state: TodolistReducerType = initialState, action: ActionType): TodolistReducerType => {
//     switch (action.type) {
//         case 'CHANGE-TODOLIST-TITLE': {
//             return state.map(todos =>
//                 todos.id === action.payload.todolistId
//                     ? {...todos, title: action.payload.newValue}
//                     : todos
//             )
//         }
//         case "REMOVE-TODOLIST": {
//             return state.filter(el => el.id !== action.todolistId)
//         }
//         case 'ADD-TODO': {
//             const newTodo: SumType = {...action.payload.newTodo, filter: "all"}
//             return [newTodo, ...state]
//         }
//         case "CHANGE-FILTER": {
//             return state.map(todos =>
//                 todos.id === action.payload.todolistId ? {...todos, filter: action.payload.value} : todos)
//         }
//         case "GET-TODOLIST": {
//             return action.payload.todos.map(el => ({...el, filter: 'all'}))
//         }
//         default:
//             return state
//     }
// }

// type ActionType = ChangeTodolistTitleACType
//     | RemoveTodolistACType
//     | AddTodolistACType
//     | ChangeFilterACType
//     | GetTodosACType
//
// type ChangeTodolistTitleACType = ReturnType<typeof changeTodolistTitleAC>
// type RemoveTodolistACType = ReturnType<typeof removeTodolistAC>
// export type AddTodolistACType = ReturnType<typeof addTodolistAC>
// export type ChangeFilterACType = ReturnType<typeof changeFilterAC>
// type GetTodosACType = ReturnType<typeof getTodosAC>
//
// export const changeTodolistTitleAC = (todolistId: string, newValue: string) => {
//     return {
//         type: 'CHANGE-TODOLIST-TITLE',
//         payload: {
//             todolistId,
//             newValue
//         }
//     } as const
// }
// export const removeTodolistAC = (todolistId: string) => {
//     return {type: 'REMOVE-TODOLIST', todolistId} as const
// }
// export const addTodolistAC = (newTodo: TodolistApiType) => {
//     console.log(newTodo)
//     return {
//         type: 'ADD-TODO',
//         payload: {
//             newTodo
//         }
//     } as const
// }
//
// export const changeFilterAC = (todolistId: string, value: FilterValueType,) => {
//     return {
//         type: 'CHANGE-FILTER',
//         payload: {
//             todolistId,
//             value
//         }
//     } as const
// }
// export const getTodosAC = (todos: TodolistApiType[]) => {
//     console.log(todos)
//     return {
//         type: 'GET-TODOLIST',
//         payload: {
//             todos
//         }
//     } as const
// }



//
// export const changeTitleTC = (todolistId: string, title: string) => async (dispatch: AppDispatch) => {
//     try {
//         await todosApi.changeTitle(todolistId, title)
//         dispatch(changeTodolistTitleAC(todolistId, title))
//     } catch (e) {
//         console.log(e)
//     }
//
// }

// export const addTodosTC = (title: string) => async (dispatch: Dispatch) => {
//     try {
//         const result = await todosApi.addTodos(title)
//         dispatch(addTodolistAC(result.data.data.item))
//     } catch (e) {
//         console.log(e)
//     }
// }
// export const deleteTodoTC = (todolistId: string) => async (dispatch: AppDispatch) => {
//     try {
//         await todosApi.deleteTodo(todolistId)
//         dispatch(removeTodolistAC(todolistId))
//     } catch (e) {
//         console.log(e)
//     }
// }
export const deleteTodo = createAppAsyncThunk<{ todolistId: string }, { todolistId: string}>(
    'todos/deleteTodo', async (arg, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI
        try {
            await todosApi.deleteTodo(arg.todolistId)
            return {
                todolistId: arg.todolistId
            }
        } catch (e) {
            console.log(e)
            return rejectWithValue(null)
        }
    }
)

export const addTodo = createAppAsyncThunk<{ title: string, todolist: TodolistApiType }, { title: string }>(
    'todos/addTodo', async (arg, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI
        try {
            const result = await todosApi.addTodos(arg.title)
            dispatch(TaskThunks.getTasksTC({todolistId: result.data.data.item.id}))
            return {
                todolist: result.data.data.item,
                title: arg.title,
            }
        } catch (e) {
            console.log(e)
            return rejectWithValue(null)
        }
    }
)


export const getTodosTC = createAppAsyncThunk<{ todolist: TodolistApiType[] }, void>(
    // 'todos/getTodos', async (arg, thunkAPI) => { а ниже arg заменяется на _, т.к не используется
    'todos/getTodos', async (_, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI
        try {
            const result = await todosApi.getTodos()
            result.data.map(el => {
                return (
                    dispatch(TaskThunks.getTasksTC({todolistId: el.id}))
                )
            })
            return {todolist: result.data}
        } catch (e) {
            console.log(e)
            return rejectWithValue(null)
        }
    }
)

const slice = createSlice({
    name: 'todos',
    initialState,
    reducers: {},
    extraReducers: builder => {
        //builder.addCase(getTodosTC.fulfilled, (state, action) => { а ниже state заменяется на _, т.к не используется
        builder.addCase(getTodosTC.fulfilled, (_, action) => {
            return action.payload.todolist.map(el => ({...el, filter: 'all'}))
        })
            .addCase(addTodo.fulfilled, (state, action) => {
                const newTodo: SumType = {...action.payload.todolist, filter: "all"}
                return [newTodo, ...state]
            })
            .addCase(deleteTodo.fulfilled,(state, action)=>{
                return state.filter(el => el.id !== action.payload.todolistId)
            })
    }
})

export const TodolistReducer = slice.reducer
export const TodolistAction = slice.actions
export const TodolistThunks = {getTodosTC, addTodo, deleteTodo}