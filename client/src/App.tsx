import { useState } from "react"
import Header from "./Header"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Board from "./Board"
import View from "./View"
import { User } from "../../interface"
import Write from "./Write"
import { GoogleOAuthProvider } from "@react-oauth/google"

function App() {
    const [user, setUser] = useState<User>({
        id: '00-000',
        name: '문가온누리',
        accessToken: ''
    })
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    return (
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID as string}
        onScriptLoadError={() => console.log('fail')}
        onScriptLoadSuccess={async () => {
            const accessToken = localStorage['accessToken']

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
        }}>
            <BrowserRouter>
                <Header user={user} setUser={setUser}
                isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
                <div id="content-container">
                    <Routes>
                        <Route path="/" element={
                            <Board user={user} setUser={setUser}
                            isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
                        } />
                        <Route path="/write" element={
                            <Write user={user} setUser={setUser}
                            isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
                        } />
                        <Route path="/view" element={
                            <View user={user} setUser={setUser}
                            isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
                        } />
                    </Routes>
                </div>
            </BrowserRouter>
        </GoogleOAuthProvider>
    )
}

export default App