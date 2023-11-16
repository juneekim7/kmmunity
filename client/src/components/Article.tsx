import "./Article.css"

interface ArticleProps {
    title: string
    onClick: () => void
}

const Article: React.FC<ArticleProps> = (props) => {
    return (
        <div className="article" onClick={props.onClick}>
            {props.title}   
        </div>
    )
}

export default Article