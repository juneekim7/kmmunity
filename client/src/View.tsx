import { useLocation } from "react-router-dom"
import { Article, Property } from "../../interface"
import { useState } from "react"

function View(props: Property) {
    const { user } = props
    const location = useLocation()
    const state = location.state as { articleId: string }
    const articleId = state.articleId
    
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    let hasLoaded = false

    async function reqView() {
        const response = await fetch('http://localhost:80/view', {
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
            hasLoaded = true
        }
        else {
            console.log('failed to view')
        }
    }
    if (!hasLoaded) reqView()

    return (
        <>
            <div id="title">{title}</div>
            <div id="content">{content}</div>
        </>
    )
}

export default View