import Header from "./Header"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Board from "./Board"
import Article from "./Article"

function App() {
    return (
        <>
            <Header />
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Board />} />
                    <Route path="/article" element={<Article />} />
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default App