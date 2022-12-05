import React from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { setClickedTask } from '../../redux/actions/TaskActions'
import { IState } from '../../redux/reducers/MainReducer'
import { TPriority } from '../taskScene/Task'

export interface IPriorityProps {

}

export default function Priority() {
    const dispatch = useDispatch()
    const clickedTask = useSelector((state: IState) => state.clickTask)

    const [open, setOpen] = React.useState(false)
    const priorityArr: TPriority[] = ["low", "medium", "high"]

    const setPriority = (index: number) => {
        clickedTask.priority = priorityArr[index]
        dispatch(setClickedTask(clickedTask))
    }

    return (
        <div className="task-modal__priority" onClick={() => setOpen(!open)}>
            <p>priority: {clickedTask.priority}</p>
            {open ? <ul className="priority__list">
                {priorityArr.map((item,index) => {
                    return <li onClick={() => setPriority(index)} key={index}>{item}</li>
                })}
            </ul> : null}
        </div>
    )
}
