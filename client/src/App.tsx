import Header from "./Header"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Board from "./Board"
import View from "./View"

function App() {
    return (
        <>
            <Header />
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Board />} />
                    <Route path="/view" element={<View />} />
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default App