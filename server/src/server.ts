import express from 'express'

const app = express()
app.post('/google_auth', async (req, res) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:5173")
    // const { data } = await axios.get(
    //     `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`
    // )
})
app.listen(3000, () => {
    console.log('server started!')
})