import {TodolistApiType, todosApi} from "../api/api.ts";
import {TaskThunks} from "./TaskReducer.ts";
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

export const changeTitle = createAppAsyncThunk<{ todolistId: string, title: string }, {
    todolistId: string,
    title: string
}>(
    'todos/changeTitle', async (arg, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI
        try {
            await todosApi.changeTitle(arg.todolistId, arg.title)
            return {
                todolistId: arg.todolistId,
                title: arg.title
            }
        } catch (e) {
            console.log(e)
            return rejectWithValue(null)
        }
    }
)
export const deleteTodo = createAppAsyncThunk<{ todolistId: string }, { todolistId: string }>(
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
            dispatch(TaskThunks.getTasks({todolistId: result.data.data.item.id}))
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


export const getTodos = createAppAsyncThunk<{ todolist: TodolistApiType[] }, void>(
    // 'todos/getTodos', async (arg, thunkAPI) => { а ниже arg заменяется на _, т.к не используется
    'todos/getTodos', async (_, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI
        try {
            const result = await todosApi.getTodos()
            result.data.map(el => {
                return (
                    dispatch(TaskThunks.getTasks({todolistId: el.id}))
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
    reducers: {
        changeFilter: (state, action) => {
            const todo = state.find(todo => todo.id === action.payload.todolistId);
            todo ? todo.filter = action.payload.value : todo
        }
    },
    extraReducers: builder => {
        //builder.addCase(getTodosTC.fulfilled, (state, action) => { а ниже state заменяется на _, т.к не используется
        builder.addCase(getTodos.fulfilled, (_, action) => {
            return action.payload.todolist.map(el => ({...el, filter: 'all'}))
        })
            .addCase(addTodo.fulfilled, (state, action) => {
                const newTodo: SumType = {...action.payload.todolist, filter: "all"}
                return [newTodo, ...state]
            })
            .addCase(deleteTodo.fulfilled, (state, action) => {
                return state.filter(el => el.id !== action.payload.todolistId)
            })
            .addCase(changeTitle.fulfilled, (state, action) => {
                const newState = state.find(item => item.id === action.payload.todolistId)
                newState ? newState.title = action.payload.title : newState
            })
    }
})

export const TodolistReducer = slice.reducer
export const TodolistAction = slice.actions
export const TodolistThunks = {getTodos, addTodo, deleteTodo, changeTitle}