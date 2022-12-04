import React from 'react'
import { IComment } from '../taskScene/Task'
import "../../css/Comments.scss"

interface ICommentsProps {
    comments: IComment[],
    sendComment: (event: any) => void
}

export default function Comments({comments, sendComment}: ICommentsProps) {

    const [respondActive, setRespondeActive] = React.useState(false)
    const [respondText, setRespondText] = React.useState("")
    const commentRef = React.useRef(null)

    const onTextInputChange = (e: any) => {
        e.preventDefault()
        setRespondText(e.target.value);
    }

    const respond = React.useMemo(() => {
        // return <form onSubmit={sendComment}>
        //     <input ref={commentRef} type="text" onChange={(e) => onTextInputChange(e)}/> 
        //     <button className="task-modal__button btn" type='submit'>Send</button>
        // </form>
    },[])

    return (
    <>
        {comments.map((item, index) => {
            return <div key={index} className="comments__comment" ref={commentRef}>
                {item.coment}
                {/* {respondActive ? respond : <p onClick={() => setRespondeActive(true)}> response </p>} */}
                <div className="comments__subcomments">
                    {item.subcoments && <Comments comments={item.subcoments} sendComment={sendComment} />}
                </div>
            </div>
        })}
    </>
  )
}
