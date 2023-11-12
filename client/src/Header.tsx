import { useGoogleLogin } from "@react-oauth/google"
import './Header.css'

function Header() {
    const googleAuthLogin = useGoogleLogin({
        onSuccess: async (res) => {
            const accessToken = res.access_token
            console.log(accessToken)

            fetch('http://localhost:3000/google_auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ accessToken }),
                mode: 'no-cors',
                credentials: 'include'
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
