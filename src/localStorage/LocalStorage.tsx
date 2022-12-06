import { IProject } from "../components/projects/Projects"
import { ITask } from "../components/taskScene/Task"
import Tasks, { ITaskColumn } from "../components/taskScene/Tasks"

export const COLUMNS = "columns"
export const ALL_TASKS = "allTasks"
export const FILES ="files"
export const PROJECTS = "projects"


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
    // if(columns.length === 0 || columns === undefined)
        // return [queueColumn, developmentColumn, doneColumn]
    return columns
}

export const getProjectsFromLocalStorage = () => {
    const projects: IProject[] = readLocalStorage(PROJECTS, "[]")
    if(projects.length === 0 || projects === undefined)
        return []
    return projects
}