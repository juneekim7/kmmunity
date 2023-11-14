import { useState } from "react"
import { Article, Property } from "../../interface"
import './Board.css'
import { Link, useNavigate } from "react-router-dom"

function Board(props: Property) {
    const navigate = useNavigate()
    const { user } = props
    const [articles, setArticles] = useState([] as Article[])
    let hasLoaded = false

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
            hasLoaded = true
        }
        else {
            console.log('failed')
        }
    }
    if (!hasLoaded) getArticles()
    return (
        <div id="board">
            {
                articles.reverse().map(article => (
                    <div className="article" onClick={() => navigate('/view', {
                        state: {
                            articleId: article.id
                        }
                    })}>{article.title}</div>
                ))
            }
            <button id="write">
                <Link to={'/write'}>write</Link>
            </button>
        </div>
    )
}

export default Board