interface User {
    id: string
    name: string
    accessToken: string
}

interface Article {
    title: string,
    writer: User,
    time: string,
    content: string,
    comments: Comment[]
}

interface Comment {
    writer: User,
    time: string,
    content: string,
    replies: Reply[]
}

interface Reply {
    writer: User,
    time: string,
    content: string
}

export { User, Article, Comment, Reply }