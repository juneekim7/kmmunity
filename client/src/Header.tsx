import { useGoogleLogin } from "@react-oauth/google"
import './Header.css'

function Header() {
    const googleAuthLogin = useGoogleLogin({
        onSuccess: async (res) => {
            const accessToken = res.access_token
            console.log(accessToken)

            fetch('http://localhost:80/google_auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    "accessToken": accessToken
                })
            })
            console.log(res)
        }
    })

    return (
        <header>
            <div id="logo">kμ</div>
            <div id="login" onClick={() => googleAuthLogin()}>login</div>
        </header>
    )
}

export default Header
