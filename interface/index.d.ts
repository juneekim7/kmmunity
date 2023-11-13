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

interface Property {
    user: User,
    setUser: Function,
    isLoggedIn: boolean,
    setIsLoggedIn: Function
}

export { User, Article, Comment, Reply, Property }