import React from 'react'
import Task, { ITask } from "./Task"
import "../../css/Tasks.scss"
import TaskModal from '../modals/TaskModal';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { ALL_TASKS, COLUMNS, getProjectsFromLocalStorage, PROJECTS, writeLocalStorage } from '../../localStorage/LocalStorage';
import { useDispatch, useSelector } from 'react-redux';
import { IState } from '../../redux/reducers/MainReducer';
import { incTaskNumber, setActiveComment, setClickedTask, setColumns, setTasks } from '../../redux/actions/TaskActions';
import {DateTime, Duration, Info, Interval, Settings} from 'luxon';
import { IProject } from '../projects/Projects';

export interface ITaskColumn {
    id: string,
    name: string,
    tasks: ITask[]
}

export default function Tasks() {
    //redux const
    const dispatch = useDispatch()
    const activeProject: number = useSelector((state: IState) => state.activeProject)
    const project: IProject = getProjectsFromLocalStorage()[activeProject]
    //useState const
    const [visiableTasks, setVisiableTasks] = React.useState(setAllTasks())
    const [taskColumns, setTaskColumns] = React.useState(project.columns)
    const [taskModal, setTaskModal] = React.useState(false)
    const [searchText, setSearchText] = React.useState("")

    React.useEffect(() => {
        setVisiableTasks([...filter(visiableTasks)])
    }, [searchText])

    React.useEffect(() => {
        const projects = getProjectsFromLocalStorage()
        projects[activeProject].allTasks = visiableTasks
        projects[activeProject].columns = taskColumns

        writeLocalStorage(PROJECTS, projects)
    }, [taskColumns, visiableTasks])

    const filter = (taskArr: ITask[]) => {
        for(let i = 0; i < taskArr.length; i++) {
            if(taskArr[i].title.includes(searchText) || taskArr[i].number.toString().includes(searchText))
                taskArr[i].visiable = true
            else
                taskArr[i].visiable = false
        }
        return taskArr
    }

    const setTaskStatus = (columnIndex: string) => {
        switch(columnIndex) {
            case "1":
                return "developing"
            case "2":
                return "done"
            case "0":
            default:
                return "queue"
        }
    }

    const countTimeDuration = (startPoint: DateTime, endpoint: DateTime) => {
        return Duration.fromObject(endpoint.minus(startPoint.toObject()).toObject())
    }   

    const onDnDTimeHandler = (task: ITask) => {
        let localTime = DateTime.local()
        let developingDate = task.developingDate || localTime
        let developingTime = task.developingTime

        // switch(task.status) {
        //     case "queue":
        //         if(developingTime)
        //             task.developingTime = developingTime?.plus(countTimeDuration(developingDate, localTime))
        //         else
        //             task.developingTime = countTimeDuration(developingDate, localTime)
        //         task.developingDate = undefined
        //         task.doneDate = undefined
        //     break;
        //     case "developing":
        //         task.developingDate = localTime
        //         task.doneDate = undefined
        //     break;
        //     case "done":
        //         if(developingTime)
        //             task.developingTime = developingTime?.plus(countTimeDuration(developingDate, localTime))
        //         else
        //             task.developingTime = countTimeDuration(developingDate, localTime)
        //         task.developingDate = undefined
        //         task.doneDate = localTime
        //     break;
        // }    
    }

    const reorder = (list: ITaskColumn, startIndex: number, endIndex: number) => {
        const result = list.tasks;
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
      
        return result;
    };

    const onDragEnd = (result: any, columns: ITaskColumn[], setTaskColumns: (columns: ITaskColumn[]) => void) => {
        if (!result.destination) return;
        const { source, destination } = result;

        if (source.droppableId !== destination.droppableId) {
            const sourceColumn: ITaskColumn = columns[source.droppableId];
            const destColumn: ITaskColumn = columns[destination.droppableId];

            const sourceItems: ITask[] = [...sourceColumn.tasks];
            const destItems: ITask[] = [...destColumn.tasks];

            const [removed]: ITask[] = sourceItems.splice(source.index, 1);
            removed.status = setTaskStatus(destination.droppableId)
            destItems.splice(destination.index, 0, removed);
            onDnDTimeHandler(destItems[destination.index])
            const newDestColumn: ITaskColumn = {...destColumn, tasks: destItems}
            const newSourceColumn: ITaskColumn = {...sourceColumn, tasks: sourceItems}

            columns.splice(destination.droppableId as number, 1, newDestColumn)
            columns.splice(source.droppableId as number, 1 , newSourceColumn)

            setTaskColumns([...columns]);
        } else {
            columns[destination.droppableId].tasks = [...reorder(columns[source.droppableId], source.index, destination.index)]
            setTaskColumns([...columns]);
        }
    };

    const addTask = () => {
        const title: string | null = prompt("Enter task title")
        if(title == null)
            return
        const newTask: ITask = {
            id: new Date().getTime().toString(),
            number: visiableTasks.length + 1,
            description: "",
            title: title ? title : "",
            status: "queue",
            createDate: DateTime.local(),
            time: "string",
            visiable: true,
            comments: [],
            subTasks: [],
            priority: "medium",
            files: []
        }
        taskColumns[0].tasks.push(newTask)
        setTaskColumns([...taskColumns])
        visiableTasks.push(newTask)
        setVisiableTasks([...visiableTasks])
    }

    const openModal = (item: ITask) => {
        dispatch(setClickedTask(item))
        dispatch(setActiveComment(item.comments))
        setTaskModal(true)
    }

    const closeModal = () => {
        setTaskModal(false)
    }

    const onTextInputChange = (e: any) => {
        e.preventDefault()
        setSearchText(e.target.value);
    }

    function setAllTasks() {
        const newTasks: ITask[] =[]
        for (let i = 0; i < project.columns.length; i++) {
            newTasks.push(...project.columns[i].tasks)
        }
        return newTasks
    }

    return (
        <>
            <input type="text" placeholder='find task' onChange={(e) => onTextInputChange(e)}/>
            <div className="tasks">
                <DragDropContext onDragEnd={result => onDragEnd(result, taskColumns, setTaskColumns)}>
                    {taskColumns.map((item, index) => {
                        return <>
                            <Droppable droppableId={item.id} key={item.id}>
                                {(provider, snapshot) => {
                                    return <div 
                                    className="tasks__list list-pending"
                                    {...provider.droppableProps}
                                    ref={provider.innerRef}
                                    key={item.id}
                                    >
                                        <h1>{item.name}</h1>
                                        {item.tasks.map((item, index) => {
                                            return <Draggable
                                                    key={item.id}
                                                    draggableId={item.id}
                                                    index={index}
                                                >
                                                {(provider, snapshot) => {
                                                    return <div 
                                                    ref={provider.innerRef} 
                                                    {...provider.draggableProps}
                                                    {...provider.dragHandleProps}
                                                    onClick={() => openModal(item)}
                                                    >
                                                        {item.visiable && <Task task={item}/>}
                                                    </div>
                                                }}
                                            </Draggable>
                                        })}
                                        {provider.placeholder}
                                    </div>
                                }}
                            </Droppable>
                        </>
                    })}
                </DragDropContext>
            </div>
            <button className="btn" onClick={addTask}>Add</button>
            {taskModal && <TaskModal visiableTasks={visiableTasks} addTask={addTask} closeModal={closeModal}/>}
        </>
    )
}
