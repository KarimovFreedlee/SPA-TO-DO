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
import { setActiveComment, setClickedTask, setInputActive } from '../../redux/actions/TaskActions';
import {DateTime, Duration, Info, Interval, Settings} from 'luxon';
import Priority from './Priority';

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
    const [subOpen, setSubOpen] = React.useState(true)
    const commentRef = React.useRef(null)

    const localTime = DateTime.local()
    const hoursDuration = countDuration().hours
    const minDuration = countDuration().minutes

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

    function countDuration() {
        const devDate = clickedTask.developingDate || localTime

        if(clickedTask.developingTime)
            return clickedTask.developingTime?.plus(Duration.fromObject(localTime.minus(devDate.toObject()).toObject()))
        return Duration.fromObject(localTime.minus(devDate.toObject()).toObject())
    }

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
    }, [text, commentRef, clickedTask])

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
    },[clickedTask])

    const title = React.useMemo(() => {
        return titleChange ? 
            <input type="text" onChange={onTitleTextChange} placeholder={clickedTask.title}/> 
            : <h3 className="task-modal__title" onClick={() => {setTitleChange(true)}}>
                {clickedTask.title}
            </h3>
    },[setTitleChange, titleChange, clickedTask])

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
    }, [clickedTask])

    const sideBar = React.useMemo(() => {
        return <div className="task-modal__sidebar">
            <p>Status: {clickedTask.status}</p>
            <Priority/>
            <p>time at work: {hoursDuration} hours {minDuration} min</p>
            {clickedTask.doneDate ? <p>done: {clickedTask.doneDate?.toLocaleString()}</p> : <p>not done yet</p>}
            <div className="task-modal__subtasks">
                <p className="task-modal__subtasks__text" onClick={() => setSubOpen(!subOpen)}>subtasks</p>
                {/* <div className="task-modal__subtasks__body"> */}
                <div className={`task-modal__subtasks__body task-modal__subtasks__body${subOpen ? "-open" : "-close"}`}>
                    {clickedTask.subTasks?.map((item,index) => {
                        return <div onClick={() => dispatch(setClickedTask(item))}><Task task={item}/></div>
                    })}
                </div>
                <button className="btn" onClick={addSubtask}>add</button>
            </div>
            <p className="task-modal__create-date">Create date: {clickedTask.createDate.toLocaleString()}</p>
        </div>
    }, [clickedTask.subTasks.length, subOpen])

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
