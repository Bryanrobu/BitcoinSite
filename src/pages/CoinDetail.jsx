import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import './CoinDetails.css';

export default function CoinDetail() {
    const { id } = useParams();
    const [coin, setCoin] = useState(null);
    const [loading, setLoading] = useState(true);

    const [isFav, setIsFav] = useState(() =>
        JSON.parse(localStorage.getItem("fav_coins") || "[]").includes(id)
    );

    const toggleFavorite = () => {
        const saved = JSON.parse(localStorage.getItem("fav_coins") || "[]");
        const updated = isFav ? saved.filter(symbol => symbol !== id) : [...saved, id];

        localStorage.setItem("fav_coins", JSON.stringify(updated));
        setIsFav(!isFav);
    };

    useEffect(() => {
        setLoading(true);
        fetch(`https://data-api.coindesk.com/asset/v1/metadata?asset=${id}`)
            .then(res => res.json())
            .then(json => setCoin(json.Data || null))
            .catch(err => console.error("Detail Fetch Error:", err))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <div className="detail-page"><p>Loading {id}...</p></div>;
    if (!coin) return <div className="detail-page"><p>Coin not found.</p><Link to="/">Back</Link></div>;

    const change24h = Number(coin.SPOT_MOVING_24_HOUR_CHANGE_PERCENTAGE_USD);
    const isPositive = change24h > 0;

    return (
        <div className="detail-page">
            <header className="detail-header-bar">
                <Link to="/" className="back-button">← Back to Overview</Link>
                <button onClick={toggleFavorite} className={`fav-detail-btn ${isFav ? 'active' : ''}`}>
                    {isFav ? "❤️ Favorited" : "🤍 Add to Favorites"}
                </button>
                <div className="badge">Rank #{coin.ID}</div>
            </header>

            <main className="detail-content">
                <section className="main-info-box">
                    <img src={coin.LOGO_URL} alt={id} />
                    <h1 style={{ fontSize: '2.2rem', margin: '10px 0' }}>{coin.NAME}</h1>
                    <div className="price-container">
                        <p className="label">Current Price</p>
                        <h2 className="price-value">
                            ${Number(coin.PRICE_USD).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </h2>
                    </div>
                </section>

                <section className="stats-container">
                    <div className="stat-card">
                        <span className="label">Market Cap</span>
                        <span className="value">${Number(coin.CIRCULATING_MKT_CAP_USD).toLocaleString()}</span>
                    </div>
                    <div className="stat-card">
                        <span className="label">24h Volume</span>
                        <span className="value">${Number(coin.SPOT_MOVING_24_HOUR_QUOTE_VOLUME_USD).toLocaleString()}</span>
                    </div>
                    <div className="stat-card">
                        <span className="label">Circulating Supply</span>
                        <span className="value">{Number(coin.SUPPLY_CIRCULATING).toLocaleString()} {id}</span>
                    </div>
                    <div className="stat-card" style={{ backgroundColor: isPositive ? '#f8fff9' : '#fff8f8' }}>
                        <span className="label">24h Change</span>
                        <span className="value" style={{ color: isPositive ? '#28a745' : '#dc3545' }}>
                            {isPositive ? '▲' : '▼'} {Math.abs(change24h).toFixed(2)}%
                        </span>
                    </div>
                </section>
            </main>
        </div>
    );
}