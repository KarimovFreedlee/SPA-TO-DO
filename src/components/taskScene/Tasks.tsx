import React from 'react'
import Task, { ITask } from "./Task"
import "../../css/Tasks.scss"
import TaskModal from '../modals/TaskModal';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { ALL_TASKS, COLUMNS, writeLocalStorage } from '../../localStorage/LocalStorage';
import { useDispatch, useSelector } from 'react-redux';
import { IState } from '../../redux/reducers/MainReducer';
import { incTaskNumber, setActiveComment, setClickedTask, setColumns, setTasks } from '../../redux/actions/TaskActions';
import {DateTime, Duration, Info, Interval, Settings} from 'luxon';

export interface ITaskColumn {
    id: string,
    name: string,
    tasks: ITask[]
}

export default function Tasks() {
    //redux const
    const dispatch = useDispatch()
    const visiableTasks = useSelector((state: IState) => state.allTasks)
    const taskColumns = useSelector((state: IState) => state.columns)
    const taskNumber = useSelector((state: IState) => state.taskNumber)
    //useState const
    const [taskModal, setTaskModal] = React.useState(false)
    const [searchText, setSearchText] = React.useState("")

    React.useEffect(() => {
        for(let i = 0; i < visiableTasks.length; i++) {
            if(visiableTasks[i].title.includes(searchText) || visiableTasks[i].number.toString().includes(searchText))
                visiableTasks[i].visiable = true
            else
                visiableTasks[i].visiable = false
        }
        dispatch(setTasks([...visiableTasks]))
        setTaskColumns(taskColumns)
    }, [searchText])

    // React.useEffect(() => {
    //     writeLocalStorage(ALL_TASKS, visiableTasks)
    //     writeLocalStorage(COLUMNS, [...taskColumns])
    // }, [visiableTasks, taskColumns])

    const setTaskColumns = (columns: ITaskColumn[]) => {
        dispatch(setColumns(columns))
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

    const onDragEnd = (result: any, columns: ITaskColumn[], setTaskColumns: (columns: ITaskColumn[]) => void) => {
        if (!result.destination) return;
        const { source, destination } = result;

        if (source.droppableId !== destination.droppableId) {
            const sourceColumn: ITaskColumn = columns[source.droppableId];
            const destColumn: ITaskColumn = columns[destination.droppableId];

            const sourceItems: ITask[] = [...sourceColumn.tasks];
            const destItems: ITask[] = [...destColumn.tasks];

            const [removed]: ITask[] = sourceItems.splice(source.index, 1);
            destItems.splice(destination.index, 0, {...removed, status: setTaskStatus(destination.droppableId)});
            if(destItems[destination.index].status === "done")    
                destItems[destination.index].doneDate = DateTime.local()
            const newDestColumn: ITaskColumn = {...destColumn, tasks: destItems}
            const newSourceColumn: ITaskColumn = {...sourceColumn, tasks: sourceItems}

            columns.splice(destination.droppableId as number, 1, newDestColumn)
            columns.splice(source.droppableId as number, 1 , newSourceColumn)

            setTaskColumns([...columns]);
        } else {
            const column = columns[source.droppableId];
            const copiedItems: ITask[] = [...column.tasks];
            const [removed] = copiedItems.splice(source.index, 1);
            copiedItems.splice(destination.index, 0, removed);
            // columns[destination.droppableId].tasks = copiedItems
            setTaskColumns([...columns]);
        }
    };

    const addTask = () => {
        const title: string | null = prompt("Enter task title")
        if(title == null)
            return
        const newTask: ITask = {
            id: new Date().getTime().toString(),
            number: taskNumber,
            description: "",
            title: title ? title : "",
            status: "queue",
            createDate: DateTime.local(),
            time: "string",
            visiable: true,
            comments: [],
            subTasks: [],
            priority: "medium"
        }
        taskColumns[0].tasks.push(newTask)
        visiableTasks.push(newTask)
        dispatch(incTaskNumber())
        dispatch(setTasks([...visiableTasks]))
        dispatch(setColumns([...taskColumns]))
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

    return (
        <>
            <input type="text" onChange={(e) => onTextInputChange(e)}/>
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
            {taskModal && <TaskModal addTask={addTask} closeModal={closeModal}/>}
        </>
    )
}
