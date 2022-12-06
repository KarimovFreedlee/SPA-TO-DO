import { IProject } from "../../components/projects/Projects"
import { IComment, ITask } from "../../components/taskScene/Task"
import { ITaskColumn } from "../../components/taskScene/Tasks"
import { 
    IAction, 
    SET_ACTIVE_COMMENT, 
    SET_ACTIVE_PROJECT, 
    SET_ALL_COLUMNS, 
    SET_ALL_TASKS, 
    SET_CLICK_TASK, 
    SET_COMMENT_INDEX, 
    SET_INPUT_ACTIVE, 
    SET_TASK_NUMBER
} from "../reducers/MainReducer"

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

export const setActiveComment = (comment: IComment[]) => {
    const newAction: IAction = {
        type: SET_ACTIVE_COMMENT,
        payload: comment
    }
    return newAction
}

export const setInputActive = (value: boolean) => {
    const newAction: IAction = {
        type: SET_INPUT_ACTIVE,
        payload: value
    }
    return newAction
}

export const incTaskNumber = () => {
    const newAction: IAction = {
        type: SET_TASK_NUMBER,
        payload: 0
    }
    return newAction
}

export const setActiveProject = (index: number) => {
    const newAction: IAction = {
        type: SET_ACTIVE_PROJECT,
        payload: index
    }
    return newAction
}