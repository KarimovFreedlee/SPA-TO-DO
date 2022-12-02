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
              Some quick example text to build on the card title and make up the
              bulk of the card's content.
            </Card.Text>
          </Card.Body>
        </Card>
    )
}
