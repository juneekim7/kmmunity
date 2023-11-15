import { useState } from "react"
import { Article, Property } from "../../interface"
import './Write.css'
import { useNavigate } from "react-router-dom"

function Write(props: Property) {
    const { user } = props
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const navigate = useNavigate()

    async function reqWrite() {
        const response = await fetch(`${window.location.origin}/write`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user,
                article: {
                    id: '',
                    title,
                    writer: user,
                    content,
                    comments: []
                } as Article
            })
        })
        const data = await response.json()
        if (data.success) {
            navigate(`/view`, {
                state: {
                    articleId: data.articleId
                }
            })
        }
        else {
            console.log('failed to write')
        }
    }

    return (
        <>
            <input id="title" value={title} placeholder="title" onChange={(e) => setTitle(e.target.value)}/>
            <textarea id="content" onChange={(e) => setContent(e.target.value)}>{content}</textarea>
            <button onClick={reqWrite}>post</button>
        </>
    )
}

export default Write