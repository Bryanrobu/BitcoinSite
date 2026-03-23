import { useEffect, useState } from "react";
import './Home.css';
import Coin from "../components/Coin/Coin.jsx";
import Header from "../components/Header/header.jsx";
import { Link } from "react-router-dom";

export default function Home() {
    const [zoekData, setZoekData] = useState("");
    const [coindeskData, setCoindeskData] = useState([]);
    const [pageSize, setPageSize] = useState("100");
    const [filter, setFilter] = useState("CIRCULATING_MKT_CAP_USD");
    const [direction, setDirection] = useState("DESC");
    const [loading, setLoading] = useState(true);

    const [favorites, setFavorites] = useState(() => {
        try { return JSON.parse(localStorage.getItem("fav_coins")) || []; }
        catch { return []; }
    });

    useEffect(() => {
        localStorage.setItem("fav_coins", JSON.stringify(favorites));
    }, [favorites]);

    const toggleFavorite = (e, symbol) => {
        e.preventDefault();
        e.stopPropagation();
        setFavorites(prev => prev.includes(symbol) ? prev.filter(s => s !== symbol) : [...prev, symbol]);
    };

    useEffect(() => {
        fetch(`https://data-api.coindesk.com/asset/v1/top/list?page=1&page_size=${pageSize}&sort_by=${filter}&sort_direction=${direction}&groups=ID,BASIC,SUPPLY,PRICE,MKT_CAP,VOLUME,CHANGE,TOPLIST_RANK&toplist_quote_asset=USD`)
            .then(res => res.json())
            .then(json => {
                setCoindeskData(json?.Data?.LIST || []);
                setLoading(false);
            })
            .catch(err => {
                console.error("Fetch error:", err);
                setLoading(false);
            });
    }, [pageSize, filter, direction]);

    const displayCoins = coindeskData
        .filter(coin =>
            coin.SYMBOL.toLowerCase().includes(zoekData.toLowerCase()) ||
            coin.URI.toLowerCase().includes(zoekData.toLowerCase())
        )
        .sort((a, b) => favorites.includes(b.SYMBOL) - favorites.includes(a.SYMBOL));

    return (
        <>
            <Header
                onSearch={e => setZoekData(e.target.value)}
                onPageSizeChange={e => setPageSize(e.target.value)}
                pageSize={pageSize}
                onFilterChange={setFilter}
                filter={filter}
                onDirectionChange={setDirection}
                direction={direction}
            />

            <div className="container">
                {loading && coindeskData.length === 0 ? (
                    <p>Loading market data...</p>
                ) : (
                    displayCoins.map(item => (
                        <Link
                            key={item.SYMBOL}
                            to={`/coin/${item.SYMBOL}`}
                            style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                            <Coin
                                img={item.LOGO_URL}
                                shortName={item.SYMBOL}
                                name={item.URI}
                                price={Number(item.PRICE_USD || 0).toFixed(2)}
                                isFavorite={favorites.includes(item.SYMBOL)}
                                onToggleFav={(e) => toggleFavorite(e, item.SYMBOL)}
                            />
                        </Link>
                    ))
                )}
            </div>
        </>
    );
}