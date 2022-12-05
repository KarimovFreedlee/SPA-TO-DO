import React from 'react'
import { IComment } from '../taskScene/Task'
import "../../css/Comments.scss"
import { useDispatch } from 'react-redux'
import { setActiveComment, setCommentIndex } from '../../redux/actions/TaskActions'

interface ICommentsProps {
    comments: IComment[],
    sendComment: (event: any) => void
}

export default function Comments({comments, sendComment}: ICommentsProps) {
    const dispatch = useDispatch()
    const commentRef = React.useRef(null)

    const onRespondClick = (index: number) => {
        console.log(comments[index])
        dispatch(setActiveComment(comments[index].subcoments))
    }

    return (
    <>
        {comments.map((item, index) => {
            return <div key={index} className="comments__comment" ref={commentRef}>
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
