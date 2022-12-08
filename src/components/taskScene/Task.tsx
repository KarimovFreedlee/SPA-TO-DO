import { DateTime, Duration } from 'luxon';
import React from 'react'
import Card from 'react-bootstrap/Card';

export type TStatus = "queue" | "developing" | "done"
export type TPriority = "low" | "medium" | "high"

export interface ITask {
  id: string
  number: number,
  title: string,
  description: string,
  status: TStatus,
  createDate: string,
  developingDate?: number,
  developingTime: number,
  time: string,
  comments: IComment[],
  visiable: boolean,
  subTasks: ITask[] ,
  doneDate?: string,
  priority: TPriority,
  files: string[]
}

export interface ITaskProps {
  task: ITask,
}

export interface IComment {
  comment: string,
  subcoments: IComment[]
}

export default function Task({task}: ITaskProps) {
  
    return (
        <Card
          bg={"light"}
          text={'dark'}
          style={{ width: '18rem' }}
          className="mb-2"
          onClick={() => {}}
        >
          <Card.Body>
            <Card.Title>{task.title}</Card.Title>
            <Card.Text> 
              {task.priority} priority
            </Card.Text>
            number: {task.number}
          </Card.Body>
        </Card>
    )
}
