import { AnyAction } from "redux"
import { ITask } from "../../components/taskScene/Task"
import { ITaskColumn } from "../../components/taskScene/Tasks"
import { IAction, SET_ALL_COLUMNS, SET_ALL_TASKS, SET_CLICK_TASK, SET_COMMENT_INDEX } from "../reducers/MainReducer"

export const setTasks = (tasks: ITask[]) => {
    const newAction: IAction = {
        type: SET_ALL_TASKS,
        payload: tasks
    }
    return newAction
}

export const setColumns = (columns: ITaskColumn[]) => {
    const newAction: IAction = {
        type: SET_ALL_COLUMNS,
        payload: columns
    }
    return newAction
}

export const setClickedTask = (item: ITask) => {
    const newAction: IAction = {
        type: SET_CLICK_TASK,
        payload: item
    }
    return newAction
}

export const setCommentIndex = (index: number) => {
    const newAction: IAction = {
        type: SET_COMMENT_INDEX,
        payload: index
    }
    return newAction
}