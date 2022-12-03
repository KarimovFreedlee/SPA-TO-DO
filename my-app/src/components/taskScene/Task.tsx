import React from 'react'
import Card from 'react-bootstrap/Card';

export type TStatus = "queue" | "developing" | "done"

export interface ITask {
  id: string
  number: number,
  title: string,
  status: TStatus,
  createDate: string,
  time: string,
  visiable: boolean
}

export interface ITaskProps {
    task: ITask,
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
            </Card.Text>
          </Card.Body>
        </Card>
    )
}
