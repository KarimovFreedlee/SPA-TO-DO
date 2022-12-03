import { AnyAction } from "redux"
import { ITask } from "../../components/taskScene/Task"
import { ITaskColumn } from "../../components/taskScene/Tasks"

export const SET_ALL_TASKS = "SET_ALL_TASKS"
export const SET_ALL_COLUMNS = "SET_ALL_COLUMNS"

const queueColumn: ITaskColumn = {
    id: "0",
    name: "Queue",
    tasks: []
}
const developmentColumn: ITaskColumn = {
    id: "1",
    name: "Development",
    tasks: []
}
const doneColumn: ITaskColumn = {
    id: "2",
    name: "Done",
    tasks: []
}

export interface IState {
    allTasks: ITask[]
    columns: ITaskColumn[]
}

export const initialState: IState = {
    allTasks: [],
    columns: [queueColumn, developmentColumn, doneColumn]
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