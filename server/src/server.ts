import type { Article, Comment, User } from '../../interface'
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
    console.log('server start')
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
        throw new Error('Only KSA students are allowed to login')
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
    res.json({
        success: true,
        articles: (await articleCursor.toArray()).map(item => {
            item.id = item._id.toString()
            return item
        })
    })
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
    article.comments = []
    const articleId = await insertArticle(article)
    console.log(articleId)
    res.json({
        success: true,
        articleId
    })
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
    res.json({
        success: true,
        article
    })
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
    res.json({
        success: true,
        article
    })
})