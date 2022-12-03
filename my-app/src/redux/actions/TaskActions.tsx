import { AnyAction } from "redux"
import { ITask } from "../../components/taskScene/Task"
import { ITaskColumn } from "../../components/taskScene/Tasks"
import { IAction, SET_ALL_TASKS } from "../reducers/MainReducer"

export const setTasks = (tasks: ITask[]) => {
    const newAction: IAction = {
        type: SET_ALL_TASKS,
        payload: tasks
    }
    return newAction
}

export const setColumns = (columns: ITaskColumn[]) => {
    const newAction: IAction = {
        type: SET_ALL_TASKS,
        payload: columns
    }
    return newAction
}