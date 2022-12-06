import React from 'react'
import { Card } from 'react-bootstrap'
import "../../css/TaskModal.scss"
import "../../css/Projects.scss"

export default function Projects() {

    const projArr: string[] = ["123", "456" ,"678"]

    return (
        <div className="projects">
            <div className="projects__modal">
                <h2>Your projects</h2>
                {projArr.map((item, index) => {
                return <Card
                bg={"light"}
                text={'dark'}
                style={{ width: '18rem' }}
                className="mb-2"
                onClick={() => {}}
            >
                <Card.Body>
                <Card.Title>{item}</Card.Title>
                <Card.Text>
                    {item}
                </Card.Text>
                </Card.Body>
            </Card>
            })}
            <button className="btn">add</button>
            </div>
        </div>
    )
}
