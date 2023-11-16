import { useState } from "react"
import { Article as ArticleType, Property } from "../../interface"
import { Link, useNavigate } from "react-router-dom"
import Article from "./components/Article"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import './Board.css'

function Board(props: Property) {
    const navigate = useNavigate()
    const { user } = props
    const [articles, setArticles] = useState([] as ArticleType[])
    const [hasLoaded, setHasLoaded] = useState(false)

    async function getArticles() {
        const response = await fetch(`${window.location.origin}/board`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user
            })
        })
        const data = await response.json()
        if (data.success) {
            setArticles(data.articles.reverse())
            setHasLoaded(true)
        }
        else console.log('failed')
    }
    if (!hasLoaded) getArticles()
    return (
        <>
            <div id="board-container">
                <div id="board-header">
                    글 목록
                </div>
                <div id="board">
                    {
                        articles.map(article => (
                            <Article title={article.title} onClick={() => navigate('/view', {state: {articleId: article.id}})} />
                        ))
                    }
                </div>
            </div>
            <button id="write">
                <Link to={'/write'}>
                    <FontAwesomeIcon icon={faPenToSquare} size="lg" />
                </Link>
            </button>
        </> 
    )
}

export default Board