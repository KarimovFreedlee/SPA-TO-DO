import React from 'react'
import "../../css/TaskModal.scss"
import { IComment, ITaskProps } from '../taskScene/Task';
import Comments from './Comments';

export interface ITaskModalProps extends ITaskProps {
    closeModal: () => void
}

export default function TaskModal({task, closeModal}: ITaskModalProps) {
    const [text, setText] = React.useState("")
    const commentRef = React.useRef(null)

    const saveChanges = () => {
        closeModal()
    }

    const onTextInputChange = (e: any) => {
        e.preventDefault()
        setText(e.target.value);
        console.log(commentRef)
    }

    const sendComment = (event: any) => {
        event.preventDefault();

        event.target.reset();
        const newComment: IComment = {
            coment: text
        } 
        task.comments?.push(newComment)
        setText("")
        
    }

    const reTitle = () => {
        
    }

    const comments = React.useMemo(() => {
        return <>
            <div className="comments">
                <Comments comments={task.comments || []} sendComment={sendComment} />
            </div>
            <form onSubmit={sendComment}>
                <input ref={commentRef} type="text" onChange={(e) => onTextInputChange(e)}/> 
                <button className="task-modal__button btn" type='submit'>Send</button>
            </form>
        </>
    }, [text, commentRef])

    return (
        <div className="task-modal" onClick={closeModal}>
            <div className="task-modal__modal"
            onClick={(e) => e.stopPropagation()}
            >
                <div className="task-modal__body">
                    <p>Task: {task.number}</p>
                    <h3 className="task-modal__title">
                        {task.title}
                    </h3>
                    <label>Description</label>
                    <input type="text"/> 
                    <button className="task-modal__button btn">Save</button>
                    {comments}
                </div>
                <div className="task-modal__sidebar">
                    <p>Status: {task.status}</p>
                    <p>priority: </p>
                </div>
            </div>
        </div>
  )
}
