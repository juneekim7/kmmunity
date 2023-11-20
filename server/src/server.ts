import type { Article, Comment, Reply, User } from '../../interface'
import express from 'express'
import ViteExpress from 'vite-express'
import bodyParser from 'body-parser'
import axios from 'axios'
import dotenv from 'dotenv'
import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb'

const app = express()
ViteExpress.config({
    mode: 'production',
    inlineViteConfig: {
        build: {
            outDir: '../client/dist'
        }
    }
})
ViteExpress.listen(app, 80, () => {
    console.log('The server has started!')
})
app.use(bodyParser.json())

dotenv.config()
const clientDB = new MongoClient(`mongodb+srv://${process.env.MONGODB_ID}:${process.env.MONGODB_PASSWORD}@kmmunity.wxkzmxx.mongodb.net/?retryWrites=true&w=majority`, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
    }
})

const validToken = {}

function isValidUser(user) {
    return validToken[user.id] === user.accessToken
}

async function getUser(accessToken: string) {
    const { data } = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`
    )
    if (data.hd !== 'ksa.hs.kr') {
        throw new Error('Only KSA students are allowed to login.')
    }
    return {
        id: data.family_name,
        name: data.given_name,
        accessToken: accessToken
    } as User
}

app.post('/google_auth', async (req, res) => {
    try {
        const accessToken = req.body.accessToken
        console.log(accessToken)
        const user = await getUser(accessToken)
        user.name = 'ㅇㅇ'

        validToken[user.id] = accessToken

        res.json({
            success: true,
            user
        })
    } catch(err) {
        if (!(err instanceof Error)) return
        res.json({
            success: false,
            error: err.message
        })
    }
})

app.post('/board', async (req, res) => {
    const user = req.body.user as User
    if (!isValidUser(user)) {
        res.status(401)
        return
    }

    const articles = clientDB.db('data').collection<Article>('articles')
    const articleCursor = articles.find()
    if (articleCursor) {
        res.json({
            success: true,
            articles: (await articleCursor.toArray()).map(article => {
                article.writer.id = ''
                article.likes = article.likes.map((userId) => (userId == user.id ? userId : null))
                article.id = article._id.toString()
                return article
            })
        })
    }
    else {
        res.json({
            success: false,
            articles: []
        })
    }
})

async function insertArticle(item: Article) {
    const articles = clientDB.db('data').collection<Article>('articles')
    try {
        const result = await articles.insertOne(item)
        console.log(`article ${result.insertedId} inserted by ${item.writer.name}`)
        return {
            success: true,
            articleId: result.insertedId.toString()
        }
    } catch (e) {
        return {
            success: false,
            error: e.toString()
        }
    }
}

app.post('/write', async (req, res) => {
    const user = req.body.user as User
    const article = req.body.article as Article
    if (!isValidUser(user) || !article) {
        res.status(401)
        return
    }

    article.writer.accessToken = ''
    article.likes = []
    article.comments = []
    const result = await insertArticle(article)
    res.json(result)
})

async function viewArticle(articleId: string) {
    const articles = clientDB.db('data').collection<Article>('articles')
    try {
        const article = await articles.findOne({
            _id: new ObjectId(articleId)
        })
        return {
            success: true,
            article
        }
    } catch(e) {
        return {
            success: false,
            error: e.toString()
        }
    }
}

app.post('/view', async (req, res) => {
    const user = req.body.user as User
    if (!isValidUser(user)) {
        res.status(401)
        return
    }

    const articleId = req.body.articleId
    const result = await viewArticle(articleId)
    res.json(result)
})

async function addComment(articleId: string, comment: Comment) {
    const articles = clientDB.db('data').collection<Article>('articles')
    try {
        const article = await articles.findOneAndUpdate({
            _id: new ObjectId(articleId)
        }, {
            $push: {
                comments: comment
            }
        }) as Article
        return {
            success: true,
            article
        }
    } catch(e) {
        return {
            success: false,
            error: e.toString()
        }
    }
}

app.post('/comment', async (req, res) => {
    const user = req.body.user as User
    if (!isValidUser(user)) {
        res.status(401)
        return
    }

    const articleId: string = req.body.articleId
    const comment: Comment = req.body.comment
    if (comment.content === '') {
        res.json({
            success: false,
            error: 'Blank comment'
        })
    }

    comment.writer.accessToken = ''
    comment.replies = []
    const result = await addComment(articleId, comment)
    res.json(result)
})

async function addLike(articleId: string, userId: string) {
    const articles = clientDB.db('data').collection<Article>('articles')
    const article = await articles.findOne({
        _id: new ObjectId(articleId)
    })
    if (article.likes.includes(userId)) {
        return {
            success: false,
            error: 'already liked'
        }
    }
    const updatedArticle = await articles.findOneAndUpdate({
        _id: new ObjectId(articleId)
    }, {
        $push: {
            likes: userId
        }
    })
    return {
        success: true,
        article: updatedArticle as Article
    }
}

app.post('/like', async (req, res) => {
    const user = req.body.user as User
    if (!isValidUser(user)) {
        res.status(401)
        return
    }

    const articleId: string = req.body.articleId
    const userId = user.id
    const result = await addLike(articleId, userId)
    res.json(result)
})

async function addReply(articleId: string, commentIndex: number, reply: Reply) {
    const articles = clientDB.db('data').collection<Article>('articles')
    const article = await articles.findOne({
        _id: new ObjectId(articleId)
    })
    if (commentIndex >= article.comments.length) {
        return {
            success: false,
            error: 'invalid commentIndex'
        }
    }

    const updatedArticle = await articles.findOneAndUpdate({
        _id: new ObjectId(articleId)
    }, {
        $push: {
            [`comments.${commentIndex}.replies`]: reply
        }
    }) as Article
    return {
        success: true,
        article: updatedArticle
    }
}

app.post('/reply', async (req, res) => {
    const user = req.body.user as User
    if (!isValidUser(user)) {
        res.status(401)
        return
    }

    const articleId: string = req.body.articleId
    const commentIndex = req.body.commentIndex
    const reply: Reply = req.body.reply
    if (reply.content === '') {
        res.json({
            success: false,
            error: 'Blank reply'
        })
    }
    else if (commentIndex == -1) {
        res.json({
            success: false,
            error: 'No target comment'
        })
    }
    reply.writer.accessToken = ''
    const result = await addReply(articleId, commentIndex, reply)
    res.json(result)
})