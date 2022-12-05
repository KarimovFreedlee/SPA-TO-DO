import { Editor } from '@tinymce/tinymce-react';
import React from 'react'
import "../../css/TaskModal.scss"
import { IComment, ITaskProps } from '../taskScene/Task';
import Comments from './Comments';
import Uppy from '@uppy/core'
import Tus from '@uppy/tus'
import { DragDrop } from '@uppy/react'
import { useSelector } from 'react-redux';
import { IState } from '../../redux/reducers/MainReducer';
import { useDispatch } from 'react-redux';
import { setActiveComment } from '../../redux/actions/TaskActions';

export interface ITaskModalProps extends ITaskProps {
    closeModal: () => void
}

export default function TaskModal({task, closeModal}: ITaskModalProps) {
    const dispatch = useDispatch()
    const commentIndex = useSelector((state: IState) => state.commentIndex)
    const activeCommentArray = useSelector((state: IState) => state.activeComment)
    const [descriptionText, setDescriptionText] = React.useState("")
    const [titleText, setTitleText] = React.useState(task.title)
    const [text, setText] = React.useState("")
    const [titleChange, setTitleChange] = React.useState(false)
    const commentRef = React.useRef(null)

    React.useEffect(() => {
        const input: any = commentRef.current
        if(input)
            input.focus()

    }, [commentIndex])

    const uppy = new Uppy({
        meta: { type: 'avatar' },
        restrictions: { maxNumberOfFiles: 1 },
        autoProceed: true,
    })
      
    uppy.use(Tus, { endpoint: 'https://vault.apideck.com/logs' })
      
    uppy.on('complete', (result) => {
        const url = result.successful[0].uploadURL
        // store.dispatch({
        //     type: 'SET_USER_AVATAR_URL',
        //     payload: { url },
        // })
    })
    const onTextInputChange = (e: any) => {
        e.preventDefault()
        setText(e.target.value);
    }

    const sendComment = (event: any) => {
        event.preventDefault();
        event.target.reset();
        const newComment: IComment = {
            comment: text,
            subcoments: []
        }
        activeCommentArray.push(newComment)
        dispatch(setActiveComment(task.comments))
        setText("")
    }

    const onTitleTextChange = (e: any) => {
        e.preventDefault()
        setTitleText(e.target.value);
    }

    const saveChanges = () => {
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

    const fileUploader = React.useMemo(() => {
        return <DragDrop
            uppy={uppy}
            locale={{
                strings: {
                    // Text to show on the droppable area.
                    // `%{browse}` is replaced with a link that opens the system file selection dialog.
                    dropHereOr: 'Drop files here or %{browse}',
                    // Used as the label for the link that opens the system file selection dialog.
                    browse: 'browse',
                },
            }}
        />
    }, [])

    return (
        <div className="task-modal" onClick={closeModal}>
            <div className="task-modal__modal" onClick={(e) => e.stopPropagation()}>
                <div className="task-modal__body">
                    <p>Task: {task.number}</p>
                    {title}
                    {fileUploader}
                    {description}
                    <button className="task-modal__button btn" onClick={saveChanges}>Save</button>
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
