import {AnyAction, applyMiddleware, combineReducers, legacy_createStore as createStore} from "redux";
import {TodolistReducer} from "../reducers/TodolistReduser";
import {TaskReducer} from "../reducers/TaskReducer";
import thunk, {ThunkAction, ThunkDispatch} from "redux-thunk";

const RootReducers = combineReducers({
    todos: TodolistReducer,
    tasks: TaskReducer
})



export const store = createStore(RootReducers, applyMiddleware(thunk))

export type RootStateType = ReturnType<typeof RootReducers>
export type RootState =ReturnType<typeof store.getState>
export type AppDispatch = ThunkDispatch<RootStateType, unknown, AnyAction>
export type AppThunkType<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    AnyAction
>

// @ts-ignore
window.store = store