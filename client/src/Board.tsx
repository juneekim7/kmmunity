import { useState } from "react"
import { Article, Property } from "../../interface"
import './Board.css'

function Board(props: Property) {
    const { user } = props
    const [articles, setArticles] = useState([] as Article[])
    const [hasLoaded, setHasLoaded] = useState(false)

    async function getArticles() {
        const response = await fetch('http://localhost:80/board', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user
            })
        })
        const data = await response.json()
        if (data.success) {
            setArticles(data.articles)
            setHasLoaded(true)
        }
        else {
            console.log('failed')
        }
    }
    if (!hasLoaded) getArticles()
    return (
        <div id="board">
            {
                articles.map(article => (
                    <div className="article">{article.title}</div>
                ))
            }
        </div>
    )
}

export default Board