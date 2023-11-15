import { useLocation } from "react-router-dom"
import { Article, Comment, Property } from "../../interface"
import { useState } from "react"

function View(props: Property) {
    const { user } = props
    const location = useLocation()
    const state = location.state as { articleId: string }
    const articleId = state.articleId
    
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [comments, setComments] = useState<Comment[]>([])
    const [hasLoaded, setHasLoaded] = useState(false)

    async function reqView() {
        const response = await fetch(`${window.location.origin}/view`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user,
                articleId
            })
        })
        const data = await response.json()
        if (data.success) {
            const article: Article = data.article
            setTitle(article.title)
            setContent(article.content)
            setComments(article.comments)
            setHasLoaded(true)
        }
        else {
            console.log('failed to view')
        }
    }
    if (!hasLoaded) reqView()

    const [commentContent, setCommentContent] = useState('')

    async function reqComment() {
        const newComment: Comment = {
            writer: user,
            content: commentContent,
            replies: []
        }
        const response = await fetch('http://localhost:80/comment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user,
                articleId,
                comment: newComment
            })
        })
        const data = await response.json()
        if (data.success) {
            setComments([
                ...comments,
                newComment
            ])
        }
        else {
            console.log('failed to comment')
        }
        setCommentContent('')
    }

    return (
        <>
            <div id="title">{title}</div>
            <div id="content">{content}</div>
            <input id="write-comment" value={commentContent} onChange={e => setCommentContent(e.target.value)}/>
            <button id="post-comment" onClick={reqComment}>comment</button>
            <div id="comment-container">
                {
                    comments.map(comment => (
                        <div className="comment">{comment.writer.name}: {comment.content}</div>
                    ))
                }
            </div>
        </>
    )
}

export default View