import express from 'express'
import ViteExpress from 'vite-express'
import bodyParser from 'body-parser'
import { resolve } from 'path'

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
app.post('/google_auth', (req, res) => {
    console.log(req.body)
    const accessToken = req.body.accessToken
    console.log(accessToken)
    // const { data } = await axios.get(
    //     `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`
    // )
})