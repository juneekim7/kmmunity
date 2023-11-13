import type { Property, User } from '../../interface'
import { useGoogleLogin } from '@react-oauth/google'
import './Header.css'

function Header(props: Property) {
    const { user, setUser, isLoggedIn, setIsLoggedIn } = props

    const googleAuthLogin = useGoogleLogin({
        onSuccess: async (res) => {
            const accessToken = res.access_token
            console.log(accessToken)

            const response = await fetch('http://localhost:80/google_auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    accessToken
                })
            })

            const data = await response.json()
            if (data.success) {
                setUser(data.user as User)
                setIsLoggedIn(true)
            }
            else {
                console.log(data.error)
                alert('Login Fail\n' + data.error)
            }
        }
    })

    return (
        <header>
            <div id="logo">kμ</div>
            <div id="login" onClick={() => isLoggedIn || googleAuthLogin()}>{ isLoggedIn ? user.name : 'login' }</div>
        </header>
    )
}

export default Header
