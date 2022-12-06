import React from 'react'
import { Card } from 'react-bootstrap'
import "../../css/TaskModal.scss"
import "../../css/Projects.scss"
import { getProjectsFromLocalStorage, PROJECTS, writeLocalStorage } from '../../localStorage/LocalStorage'
import { ITaskColumn } from '../taskScene/Tasks'
import { ITask } from '../taskScene/Task'

export interface IProject {
    id: string,
    name: string,
    allTasks: ITask[],
    columns: ITaskColumn[]
}

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

export default function Projects() {
    const [projects, setProjects] = React.useState(getProjectsFromLocalStorage() || [])

    const createNewProject = () => {
        const name = prompt("enter project name")
        if(!name)
            return
        const newProject: IProject = {
            id: new Date().getTime().toString(),
            name: name,
            allTasks: [],
            columns: [queueColumn, developmentColumn, doneColumn]
        }
        setProjects([...projects, newProject])
        writeLocalStorage(PROJECTS, [...projects, newProject]) 
    }

    const openProject = (id: string) => {

    }

    const getProjects = React.useMemo(() => {
        return projects.map((item, index) => {
            return <Card
            bg={"light"}
            text={'dark'}
            style={{ width: '18rem' }}
            className="mb-2"
            onClick={() => openProject(item.id)}
        >
            <Card.Body>
            <Card.Title>{item.name}</Card.Title>
            <Card.Text>
                {item.id}
            </Card.Text>
            </Card.Body>
        </Card>
        })
    }, [projects])

    return (
        <div className="projects">
            <div className="projects__modal">
                <h2>Your projects</h2>
                {getProjects}
            <button className="btn" onClick={createNewProject}>add</button>
            </div>
        </div>
    )
}
