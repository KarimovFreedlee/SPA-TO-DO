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
import { FILES, getProjectsFromLocalStorage, readLocalStorage, writeLocalStorage } from '../../localStorage/LocalStorage';
import { Dashboard, GoogleDrive } from 'uppy';
import { IProject } from '../projects/Projects';
import Dropzone from 'react-dropzone'
import {useDropzone} from 'react-dropzone'

export interface ITaskModalProps {
    closeModal: () => void,
    addTask: () => void
}

export default function TaskModal({closeModal, addTask}: ITaskModalProps) {
    const dispatch = useDispatch()
    const activeProject: number = useSelector((state: IState) => state.activeProject)
    const project: IProject = getProjectsFromLocalStorage()[activeProject]
    const activeInput = useSelector((state: IState) => state.inputActive)
    const activeCommentArray = useSelector((state: IState) => state.activeComment)
    const clickedTask = useSelector((state: IState) => state.clickTask)

    const [visiableTasks, setVisiableTasks] = React.useState(project.allTasks)
    const [descriptionText, setDescriptionText] = React.useState("")
    const [titleText, setTitleText] = React.useState(clickedTask.title)
    const [text, setText] = React.useState("")
    const [titleChange, setTitleChange] = React.useState(false)
    const [subOpen, setSubOpen] = React.useState(true)
    const [filesOpen, setFilesOpen] = React.useState(true)
    const [files, setfiles] = React.useState<string[]>(readLocalStorage(clickedTask.id + project.id, "[]"))
    const commentRef = React.useRef(null)

    const localTime = DateTime.local()
    // const hoursDuration = countDuration().hours
    // const minDuration = countDuration().minutes

    React.useEffect(() => {
        const input: any = commentRef.current
        if(input && activeInput)
            input.focus()

    }, [activeInput])

    // function countDuration() {
    //     const devDate = clickedTask.developingDate || localTime

    //     if(clickedTask.developingTime)
    //         return clickedTask.developingTime?.plus(Duration.fromObject(localTime.minus(devDate.toObject()).toObject()))
    //     return Duration.fromObject(localTime.minus(devDate.toObject()).toObject())
    // }

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
        clickedTask.subTasks.push(visiableTasks[visiableTasks.length - 1])
    }
    
    const onDrop = React.useCallback((acceptedFiles: any) => {
        acceptedFiles.forEach((file: any) => {
          const reader = new FileReader()
    
          reader.onabort = () => console.log('file reading was aborted')
          reader.onerror = () => console.log('file reading has failed')
          reader.onload = () => {
          // Do whatever you want with the file contents
            const binaryStr = reader.result
            if(binaryStr != null)
                files.push(binaryStr as string)
            writeLocalStorage(clickedTask.id + project.id, files)
          }
          reader.readAsDataURL(file)
        })
        
    }, [])

    const {getRootProps, getInputProps} = useDropzone({onDrop})

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
                    height: 250,
                    menubar: false
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
        return <div {...getRootProps()} className="task-modal__uploader">
            <input {...getInputProps()} />
            <p>Drag 'n' drop some files here, or click to select files</p>
        </div>
    }, [])

    const getFiles = React.useMemo(() => {
        return <div className="task-modal__files">
            <p onClick={() => setFilesOpen(!filesOpen)}>files</p>
            <div className={`task-modal__container task-modal__container${filesOpen ? "-open" : "-close"}`}>
                {files.map((item, index) => {
                    return <img src={item} />
                })}
            </div>
        </div>
    },[filesOpen, files.length])

    const sideBar = React.useMemo(() => {
        return <div className="task-modal__sidebar">
            <p>Task number: {clickedTask.number}</p>
            <p>Status: {clickedTask.status}</p>
            <Priority/>
            {/* <p>time at work: {hoursDuration} hours {minDuration} min</p> */}
            {/* {clickedTask.doneDate ? <p>done: {clickedTask.doneDate?.toLocaleString()}</p> : <p>not done yet</p>} */}
            {getFiles}
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
    }, [clickedTask.subTasks.length, subOpen, filesOpen, files.length])

    return (
        <div className="task-modal" onClick={closeModal}>
            <div className="task-modal__modal" onClick={(e) => e.stopPropagation()}>
                <div className="task-modal__body">
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
