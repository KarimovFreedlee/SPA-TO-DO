import React from 'react'
import Button from 'react-bootstrap/Button';
import "../../css/TaskModal.scss"
import Card from 'react-bootstrap/Card';
import { ITaskProps } from '../taskScene/Task';

export interface ITaskModalProps extends ITaskProps {
    closeModal: () => void
}

export default function TaskModal({task, closeModal}: ITaskModalProps) {

    const saveChanges = () => {
        closeModal()
    }

    return (
        <div className="task-modal" onClick={closeModal}>
            <Card
            bg={"light"}
            text={'dark'}
            style={{ height: "500px", width: "80%"}}
            className="mb-2"
            onClick={(e) => e.stopPropagation()}
            >
            <Card.Body>
                <Card.Title></Card.Title>
                <Card.Text>
                Some quick example text to build on the card title and make up the
                bulk of the card's content.
                </Card.Text>
                <Button onClick={saveChanges}>Save</Button>
            </Card.Body>
            </Card>
        </div>
  )
}
