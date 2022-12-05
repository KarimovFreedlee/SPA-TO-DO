import { Editor } from '@tinymce/tinymce-react';
import React from 'react'
import "../../css/TaskModal.scss"
import Task, { IComment, ITask, ITaskProps } from '../taskScene/Task';
import Comments from './Comments';
import Uppy from '@uppy/core'
import Tus from '@uppy/tus'
import { DragDrop } from '@uppy/react'
import { useSelector } from 'react-redux';
import { IState } from '../../redux/reducers/MainReducer';
import { useDispatch } from 'react-redux';
import { setActiveComment, setInputActive } from '../../redux/actions/TaskActions';
import {DateTime, Duration, Info, Interval, Settings} from 'luxon';

export interface ITaskModalProps {
    closeModal: () => void,
    addTask: () => void
}

export default function TaskModal({closeModal, addTask}: ITaskModalProps) {
    const dispatch = useDispatch()
    const activeInput = useSelector((state: IState) => state.inputActive)
    const activeCommentArray = useSelector((state: IState) => state.activeComment)
    const clickedTask = useSelector((state: IState) => state.clickTask)
    const visiableTasks = useSelector((state: IState) => state.allTasks)

    const [descriptionText, setDescriptionText] = React.useState(clickedTask.description)
    const [titleText, setTitleText] = React.useState(clickedTask.title)
    const [text, setText] = React.useState("")
    const [titleChange, setTitleChange] = React.useState(false)
    const commentRef = React.useRef(null)

    const hoursDuration = Duration.fromObject(DateTime.local().minus(clickedTask.createDate.toObject()).toObject()).hours
    const minDuration = Duration.fromObject(DateTime.local().minus(clickedTask.createDate.toObject()).toObject()).minutes

    React.useEffect(() => {
        const input: any = commentRef.current
        if(input && activeInput)
            input.focus()

    }, [activeInput])

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
        dispatch(setActiveComment(clickedTask.comments))
        dispatch(setInputActive(false))
        setText("")
    }

    const onTitleTextChange = (e: any) => {
        e.preventDefault()
        setTitleText(e.target.value);
    }

    const saveChanges = () => {
        clickedTask.description = descriptionText
        clickedTask.title = titleText
        setTitleChange(false)
    }

    const addSubtask = () => {
        addTask()
        console.log(visiableTasks)
        clickedTask.subTasks.push(visiableTasks[visiableTasks.length - 1])
    }

    const comments = React.useMemo(() => {
        return <>
            <div className="comments">
                <Comments comments={clickedTask.comments || []} sendComment={sendComment} />
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
                value={clickedTask.description}
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
            <input type="text" onChange={onTitleTextChange} placeholder={clickedTask.title}/> 
            : <h3 className="task-modal__title" onClick={() => {setTitleChange(true)}}>
                {clickedTask.title}
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

    const sideBar = React.useMemo(() => {
        console.log(clickedTask.createDate.toObject())
        return <div className="task-modal__sidebar">
            <p>Status: {clickedTask.status}</p>
            <p>priority: </p>
            <p>time at work: {hoursDuration} hours {minDuration} min</p>
            {clickedTask.doneDate ? <p>done: {clickedTask.doneDate?.toLocaleString()}</p> : <p>not done yet</p>}
            <div className="task-modal__subtasks">
                <p className="task-modal__subtasks__text">subtask</p>
                <div className="task-modal__subtasks__body">
                    {clickedTask.subTasks?.map((item) => {
                        return <Task task={item}/>
                    })}
                </div>
                <button className="btn" onClick={addSubtask}>add</button>
            </div>
            <p>Create date: {clickedTask.createDate.toLocaleString()}</p>
        </div>
    }, [clickedTask.subTasks.length])

    return (
        <div className="task-modal" onClick={closeModal}>
            <div className="task-modal__modal" onClick={(e) => e.stopPropagation()}>
                <div className="task-modal__body">
                    <p>Task: {clickedTask.number}</p>
                    {title}
                    {fileUploader}
                    {description}
                    <button className="task-modal__button btn" onClick={saveChanges}>Save</button>
                    {comments}
                </div>
                {sideBar}
            </div>
        </div>
  )
}
