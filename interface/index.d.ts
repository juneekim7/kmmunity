interface User {
    id: string
    name: string
    accessToken: string
}

interface Article {
    id: string,
    title: string,
    writer: User,
    content: string,
    likes: string[],
    comments: Comment[]
}

interface Comment {
    writer: User,
    content: string,
    replies: Reply[]
}

interface Reply {
    writer: User,
    content: string
}

interface Property {
    user: User,
    setUser: Function,
    isLoggedIn: boolean,
    setIsLoggedIn: Function,
    match?: {
        params: any
    }
}

export { User, Article, Comment, Reply, Property }