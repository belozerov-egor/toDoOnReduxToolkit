import {AppDispatch, RootStateType} from "../store/store.ts";
import {createAsyncThunk} from "@reduxjs/toolkit";



export const createAppAsyncThunk = createAsyncThunk.withTypes<{
    state: RootStateType
    dispatch: AppDispatch
    rejectValue: null
}>()