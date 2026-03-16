import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import CoinDetail from "./pages/CoinDetail.jsx";
import './pages/Home.css';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Homepage */}
                <Route path="/" element={<Home />} />

                {/* Detail page - :id handles BTC, ETH, etc. */}
                <Route path="/coin/:id" element={<CoinDetail />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;