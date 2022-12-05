import { ITask } from "../components/taskScene/Task"
import Tasks, { ITaskColumn } from "../components/taskScene/Tasks"

export const COLUMNS = "columns"
export const ALL_TASKS = "allTasks"

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

export const writeLocalStorage = (key: string, value: any) => {
    const newValue = JSON.stringify(value)
    localStorage.setItem(key, newValue)
}

export const readLocalStorage = (key: string, defaultItem: string) => {
    const item: string = localStorage.getItem(key) || defaultItem
    return JSON.parse(item)
}

export const getTasksFromLocalStorage = () => {
    const tasks: ITask[] = readLocalStorage(ALL_TASKS, "[]")
    return tasks
}

export const getColumnsFromLocalStorage = () => {
    const columns: ITaskColumn[] = readLocalStorage(COLUMNS, "[]")
    if(columns.length === 0 || columns === undefined)
        return [queueColumn, developmentColumn, doneColumn]
    return columns
}