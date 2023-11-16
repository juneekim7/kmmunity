import { useLocation } from "react-router-dom"
import { Article, Comment, Property } from "../../interface"
import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowUp, faCommentDots } from "@fortawesome/free-solid-svg-icons"
import './View.css'

function View(props: Property) {
    const { user } = props
    const location = useLocation()
    const state = location.state as { articleId: string }
    const articleId = state.articleId
    
    const [article, setArticle] = useState<Article>({
        id: '',
        title: 'title',
        content: 'content',
        writer: {
            id: '00-000',
            name: '문가온누리',
            accessToken: ''
        },
        likes: [],
        comments: []
    })
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
            setArticle(data.article)
            setHasLoaded(true)
        }
        else {
            console.log('failed to view')
        }
    }
    if (!hasLoaded) reqView()

    async function reqLike() {
        const response = await fetch(`${window.location.origin}/like`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user,
                articleId,
            })
        })
        const data = await response.json()
        if (data.success) {
            setArticle(article => ({
                ...article,
                likes: [...article.likes, user.id]
            }))
        }
        else {
            console.log('failed to like')
        }
    }

    const [commentContent, setCommentContent] = useState('')

    async function reqComment() {
        const newComment: Comment = {
            writer: user,
            content: commentContent,
            replies: []
        }
        const response = await fetch(`${window.location.origin}/comment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user,
                articleId,
                comment: newComment
            })
        })
        const data = await response.json()
        if (data.success&&newComment.content!="") {
            setArticle(article => ({
                ...article,
                comments: [ ...article.comments, newComment ]
            }))
        }
        else {
            console.log('failed to comment')
        }
        setCommentContent('')
    }

    return (
        <>
            <div id="title">{article.title}</div>
            <div id="content">{article.content}</div>
            개추: {article.likes.length}
            <button id="like" onClick={reqLike}>개추하기</button>
            <div id="comment-input-wrapper">
                <div id="comment-title">
                    <FontAwesomeIcon icon={faCommentDots} />
                    댓글 쓰기
                </div>
                <div id="comment-input-container">
                    <textarea id="write-comment" value={commentContent} onChange={e => setCommentContent(e.target.value)}/>
                    <button id="post-comment" onClick={reqComment}>
                        <FontAwesomeIcon icon={faArrowUp} size="lg" />
                    </button>
                </div>
            </div>
            <div id="comment-container">
                {
                    article.comments.map(comment => (
                        <div className="comment">{comment.writer.name}: {comment.content}</div>
                    ))
                }
            </div>
        </>
    )
}

export default View