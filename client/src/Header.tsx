import type { Property, User } from '../../interface'
import { useGoogleLogin } from '@react-oauth/google'
import './Header.css'
import { useNavigate } from 'react-router-dom'

function Header(props: Property) {
    const { user, setUser, isLoggedIn, setIsLoggedIn } = props
    const navigate = useNavigate()

    const googleAuthLogin = useGoogleLogin({
        onSuccess: async (res) => {
            const accessToken = res.access_token
            console.log(accessToken)

            const response = await fetch(`${window.location.origin}/google_auth`, {
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
            <div id="logo" onClick={() => navigate('/')}>kμ</div>
            <div id="login" onClick={() => isLoggedIn || googleAuthLogin()}>{ isLoggedIn ? user.name : '로그인' }</div>
        </header>
    )
}

export default Header
