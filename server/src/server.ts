import type { Article, User } from '../../interface'
import express from 'express'
import ViteExpress from 'vite-express'
import bodyParser from 'body-parser'
import axios from 'axios'
import dotenv from 'dotenv'
import { MongoClient, ServerApiVersion } from 'mongodb'

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

async function insertArticle(item: Article) {
    const articles = clientDB.db('data').collection<Article>('articles')
    const result = await articles.insertOne(item)
    console.log('article inserted with id ' + result.insertedId)
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

async function isValidUser(user: User) {
    return await getUser(user.accessToken) === user
}

app.post('/google_auth', async (req, res) => {
    try {
        const accessToken = req.body.accessToken
        const user = await getUser(accessToken)

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
    if (! await isValidUser(user)) {
        res.status(401)
    }

    const articles = clientDB.db('data').collection<Article>('articles')
    const articleCursor = articles.find()
    res.json(await articleCursor.toArray())
})

app.post('/write', async (req, res) => {
    const user = req.body.user as User
    if (! await isValidUser(user)) {
        res.status(401)
    }

})

app.post('/view', async (req, res) => {
    const user = req.body.user as User
    if (! await isValidUser(user)) {
        res.status(401)
    }

    const pageNum = req.body.pageNum
    res.json([])
})