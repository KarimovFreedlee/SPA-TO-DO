import { Editor } from '@tinymce/tinymce-react';
import React from 'react'
import "../../css/TaskModal.scss"
import { IComment, ITaskProps } from '../taskScene/Task';
import Comments from './Comments';

export interface ITaskModalProps extends ITaskProps {
    closeModal: () => void
}

export default function TaskModal({task, closeModal}: ITaskModalProps) {
    const [descriptionText, setDescriptionText] = React.useState("")
    const [titleText, setTitleText] = React.useState("")
    const [text, setText] = React.useState("")
    const [titleChange, setTitleChange] = React.useState(false)
    const commentRef = React.useRef(null)

    const saveChanges = () => {
        closeModal()
    }

    const onTextInputChange = (e: any) => {
        e.preventDefault()
        setText(e.target.value);
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

    const onTitleTextChange = (e: any) => {
        e.preventDefault()
        setTitleText(e.target.value);
    }

    const saveDescription = () => {
        task.description = descriptionText
        task.title = titleText
        setTitleChange(false)
    }

    const comments = React.useMemo(() => {
        return <>
            <div className="comments">
                <Comments comments={task.comments || []} sendComment={sendComment} />
            </div>
            <form onSubmit={sendComment}>
                <input ref={commentRef} type="text" placeholder='add comment' onChange={(e) => onTextInputChange(e)}/> 
                <button className="task-modal__button btn" type='submit'>Send</button>
            </form>
        </>
    }, [text, commentRef])

    const description = React.useMemo(() => {
        return <>
            <Editor
                onEditorChange={(newText) => setDescriptionText(newText)}
                value={task.description}
                apiKey='u73ewtcis7l2b26jfjg7pneiatlxotpobnpiskzaun3rh82j' 
                init={{
                    height: 300,
                    menubar: false,
                    plugins: [
                        'advlist autolink lists link image charmap print preview anchor',
                        'searchreplace visualblocks code fullscreen',
                        'insertdatetime media table paste code help wordcount'
                    ],
                    toolbar: 'undo redo | formatselect | ' +
                    'bold italic backcolor | alignleft aligncenter ' +
                    'alignright alignjustify | bullist numlist outdent indent | ' +
                    'removeformat | help',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                }}
            />
        </>
    },[])

    const title = React.useMemo(() => {
        return titleChange ? 
            <input type="text" onChange={onTitleTextChange} placeholder={task.title}/> 
            : <h3 className="task-modal__title" onClick={() => {setTitleChange(true)}}>
                {task.title}
            </h3>
    },[setTitleChange, titleChange])

    return (
        <div className="task-modal" onClick={closeModal}>
            <div className="task-modal__modal"
            onClick={(e) => e.stopPropagation()}
            >
                <div className="task-modal__body">
                    <p>Task: {task.number}</p>
                    {title}
                    <input type="file" />
                    {description}
                    <button className="task-modal__button btn" onClick={saveDescription}>Save</button>
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
