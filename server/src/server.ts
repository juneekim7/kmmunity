import express from 'express'
import bodyParser from 'body-parser'

const app = express()
app.use(bodyParser.urlencoded({ extended : false }))
app.use(bodyParser.json())
app.post('/google_auth', (req, res) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:5173")
    const accessToken = req.body.accessToken
    console.log(accessToken)
    // const { data } = await axios.get(
    //     `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`
    // )
})
app.listen(3000, () => {
    console.log('server started!')
})