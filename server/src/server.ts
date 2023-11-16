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

/** return article's id (I know this is bad code but... sorry T.T) */
async function insertArticle(item: Article) {
    const articles = clientDB.db('data').collection<Article>('articles')
    const result = await articles.insertOne(item)
    console.log(`article ${result.insertedId} inserted by ${item.writer.name}`)
    return result.insertedId.toString()
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
    const articleId = await insertArticle(article)
    if (articleId) {
        res.json({
            success: true,
            articleId
        })
    }
    else {
        res.json({
            success: false
        })
    }
})

async function viewArticle(articleId: string) {
    const articles = clientDB.db('data').collection<Article>('articles')
    const article = articles.findOne({
        _id: new ObjectId(articleId)
    })
    return await article as Article
}

app.post('/view', async (req, res) => {
    const user = req.body.user as User
    if (!isValidUser(user)) {
        res.status(401)
        return
    }

    const articleId = req.body.articleId
    const article = await viewArticle(articleId)
    if (article) {
        res.json({
            success: true,
            article
        })
    }
    else {
        res.json({
            success: false
        })
    }
})

async function addComment(articleId: string, comment: Comment) {
    const articles = clientDB.db('data').collection<Article>('articles')
    const article = articles.findOneAndUpdate({
        _id: new ObjectId(articleId)
    }, {
        $push: {
            comments: comment
        }
    })
    return await article as Article
}

app.post('/comment', async (req, res) => {
    const user = req.body.user as User
    if (!isValidUser(user)) {
        res.status(401)
        return
    }

    const articleId: string = req.body.articleId
    const comment: Comment = req.body.comment
    comment.writer.accessToken = ''
    comment.replies = []
    const article = await addComment(articleId, comment)
    if (article) {
        res.json({
            success: true,
            article
        })
    }
    else {
        res.json({
            success: false
        })
    }
})

async function addLike(articleId: string, userId: string) {
    const articles = clientDB.db('data').collection<Article>('articles')
    const article = articles.findOneAndUpdate({
        _id: new ObjectId(articleId)
    }, {
        $push: {
            likes: userId
        }
    })
    return await article as Article
}

app.post('/like', async (req, res) => {
    const user = req.body.user as User
    if (!isValidUser(user)) {
        res.status(401)
        return
    }

    const articleId: string = req.body.articleId
    const userId = user.id
    const article = await addLike(articleId, userId)
    if (article) {
        res.json({
            success: true,
            article
        })
    }
    else {
        res.json({
            success: false
        })
    }
})

async function addReply(articleId: string, commentIndex: Number, reply: Reply) {
    const articles = clientDB.db('data').collection<Article>('articles')
    const article = articles.findOneAndUpdate({
        _id: new ObjectId(articleId)
    }, {
        $push: {
            [`comments.${commentIndex}.replies`]: reply
        }
    })
    return await article as Article
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
    reply.writer.accessToken = ''
    const article = await addReply(articleId, commentIndex, reply)
    if (article) {
        res.json({
            success: true,
            article
        })
    }
    else {
        res.json({
            success: false
        })
    }
})