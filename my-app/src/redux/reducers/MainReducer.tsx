import { AnyAction } from "redux"
import { ITask } from "../../components/taskScene/Task"
import { ITaskColumn } from "../../components/taskScene/Tasks"
import { getColumnsFromLocalStorage, getTasksFromLocalStorage } from "../../localStorage/LocalStorage"

export const SET_ALL_TASKS = "SET_ALL_TASKS"
export const SET_ALL_COLUMNS = "SET_ALL_COLUMNS"

export interface IState {
    allTasks: ITask[]
    columns: ITaskColumn[]
}

export const initialState: IState = {
    allTasks: getTasksFromLocalStorage(),
    columns: getColumnsFromLocalStorage()
}

export interface IAction {
    type: string,
    payload: any
}

export const mainReducer = (state: IState = initialState, action: IAction): IState => {
    switch(action.type) {
        case SET_ALL_TASKS:
            return {...state, allTasks: action.payload }
        case SET_ALL_COLUMNS:
            return {...state, columns: action.payload }
        default:
            return state
    }
}