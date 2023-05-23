import {TodolistApiType, todosApi} from "../api/api.ts";
import {getTasksTC} from "./TaskReducer.ts";
import {AppDispatch} from "../store/store.ts";
import {Dispatch} from "redux";

export type FilterValueType = "all" | "completed" | "active"

type SumType = TodolistApiType & {
    filter: FilterValueType
}

type TodolistReducerType = SumType[]


const initialState: TodolistReducerType = [
    // {id: 'todolistId1', title: "Что сделать Егору", filter: "all"},
    // {id: 'todolistId2', title: "Что сделать Юле", filter: "all"},
]


export const TodolistReducer = (state: TodolistReducerType = initialState, action: ActionType): TodolistReducerType => {
    switch (action.type) {
        case 'CHANGE-TODOLIST-TITLE': {
            return state.map(todos =>
                todos.id === action.payload.todolistId
                    ? {...todos, title: action.payload.newValue}
                    : todos
            )
        }
        case "REMOVE-TODOLIST": {
            return state.filter(el => el.id !== action.todolistId)
        }
        case 'ADD-TODO': {
            const newTodo: SumType = {...action.payload.newTodo, filter: "all"}
            return [newTodo, ...state]
        }
        case "CHANGE-FILTER": {
            return state.map(todos =>
                todos.id === action.payload.todolistId ? {...todos, filter: action.payload.value} : todos)
        }
        case "GET-TODOLIST": {
            return action.payload.todos.map(el => ({...el, filter: 'all'}))
        }
        default:
            return state
    }
}

type ActionType = ChangeTodolistTitleACType
    | RemoveTodolistACType
    | AddTodolistACType
    | ChangeFilterACType
    | GetTodosACType

type ChangeTodolistTitleACType = ReturnType<typeof changeTodolistTitleAC>
type RemoveTodolistACType = ReturnType<typeof removeTodolistAC>
export type AddTodolistACType = ReturnType<typeof addTodolistAC>
export type ChangeFilterACType = ReturnType<typeof changeFilterAC>
type GetTodosACType = ReturnType<typeof getTodosAC>

export const changeTodolistTitleAC = (todolistId: string, newValue: string) => {
    return {
        type: 'CHANGE-TODOLIST-TITLE',
        payload: {
            todolistId,
            newValue
        }
    } as const
}
export const removeTodolistAC = (todolistId: string) => {
    return {type: 'REMOVE-TODOLIST', todolistId} as const
}
export const addTodolistAC = (newTodo: TodolistApiType) => {
    console.log(newTodo)
    return {
        type: 'ADD-TODO',
        payload: {
            newTodo
        }
    } as const
}

export const changeFilterAC = (todolistId: string, value: FilterValueType,) => {
    return {
        type: 'CHANGE-FILTER',
        payload: {
            todolistId,
            value
        }
    } as const
}
export const getTodosAC = (todos: TodolistApiType[]) => {
    console.log(todos)
    return {
        type: 'GET-TODOLIST',
        payload: {
            todos
        }
    } as const
}
export const getTodosTC = () => async (dispatch: AppDispatch) => {
    try {
        const result = await todosApi.getTodos()
        dispatch(getTodosAC(result.data))
        result.data.map(el => {
            return (
                dispatch(getTasksTC(el.id))
            )
        })
    } catch (e) {
        console.log(e)
    }
}
export const addTodosTC = (title: string) => async (dispatch: Dispatch) => {
    try {
        const result = await todosApi.addTodos(title)
        dispatch(addTodolistAC(result.data.data.item))
    } catch (e) {
        console.log(e)
    }
}
export const deleteTodoTC = (todolistId: string) => async (dispatch: AppDispatch) => {
    try {
        await todosApi.deleteTodo(todolistId)
        dispatch(removeTodolistAC(todolistId))
    } catch (e) {
        console.log(e)
    }
}

export const changeTitleTC = (todolistId: string, title: string) => async (dispatch: AppDispatch)=> {
    try{
        await todosApi.changeTitle(todolistId, title)
        dispatch(changeTodolistTitleAC(todolistId,title))
    }catch (e){
        console.log(e)
    }

}
