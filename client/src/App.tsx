import { useState } from "react"
import Header from "./Header"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Board from "./Board"
import View from "./View"
import { User } from "../../interface"

function App() {
    const [user, setUser] = useState({
        id: '00-000',
        name: '문가온누리',
        accessToken: ''
    } as User)
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    return (
        <>
            <Header user={user} setUser={setUser} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Board
                        user={user} setUser={setUser}
                        isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>} />
                    <Route path="/view" element={<View />} />
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default App