import React from 'react'
import { IComment } from '../taskScene/Task'
import "../../css/Comments.scss"
import { useDispatch } from 'react-redux'
import { setActiveComment, setInputActive } from '../../redux/actions/TaskActions'

interface ICommentsProps {
    comments: IComment[],
    sendComment: (event: any) => void
}

export default function Comments({comments, sendComment}: ICommentsProps) {
    const dispatch = useDispatch()
    const commentRef = React.useRef(null)

    const onRespondClick = (index: number) => {
        dispatch(setActiveComment(comments[index].subcoments))
        dispatch(setInputActive(true))
    }

    return (
    <>
        {comments.map((item, index) => {
            return <div key={index} className="comments__comment" ref={commentRef} style={index === comments.length - 1 ? {border: "none"} : {}}>
                {item.comment}
                <div className="comments__options">
                    <p onClick={() => onRespondClick(index)}>respond</p>
                    <p>report</p>
                </div>
                {/* {respondActive ? respond : <p onClick={() => setRespondeActive(true)}> response </p>} */}
                <div className="comments__subcomments">
                    {item.subcoments && <Comments comments={item.subcoments} sendComment={sendComment} />}
                </div>
            </div>
        })}
    </>
  )
}
