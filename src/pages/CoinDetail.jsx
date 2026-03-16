import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import './CoinDetails.css';

function CoinDetail() {
    const { id } = useParams();
    const [coin, setCoin] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        // Use the Metadata endpoint to get 1 specific coin by its symbol
        fetch(`https://data-api.coindesk.com/asset/v1/metadata?asset=${id}`)
            .then(res => res.json())
            .then(json => {
                // The Metadata API usually returns an object where the key is the symbol
                // or a single object under Data.
                if (json.Data) {
                    setCoin(json.Data);
                } else {
                    setCoin(null);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Detail Fetch Error:", err);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div className="detail-page"><p>Loading {id}...</p></div>;
    if (!coin) return <div className="detail-page"><p>Coin not found.</p><Link to="/">Back</Link></div>;

    // Mapping variables based on your JSON snippet
    const price = coin.PRICE_USD;
    const change24h = coin.SPOT_MOVING_24_HOUR_CHANGE_PERCENTAGE_USD;
    const mktCap = coin.CIRCULATING_MKT_CAP_USD;
    const volume = coin.SPOT_MOVING_24_HOUR_QUOTE_VOLUME_USD;

    return (
        <div className="detail-page">
            <header className="detail-header-bar">
                <Link to="/" className="back-button">
                    <span>←</span> Back to Overview
                </Link>
                <div className="badge">Rank #{coin.ID}</div>
            </header>

            <main className="detail-content">
                {/* Left Side: Identity & Green Price */}
                <section className="main-info-box">
                    <img src={coin.LOGO_URL} alt={id} />
                    <h1 style={{ fontSize: '2.2rem', margin: '10px 0' }}>{coin.NAME}</h1>

                    <div className="price-container">
                        <p className="label">Current Price</p>
                        <h2 className="price-value">
                            ${Number(price).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </h2>
                    </div>
                </section>

                {/* Right Side: Grid Stats */}
                <section className="stats-container">
                    <div className="stat-card">
                        <span className="label">Market Cap</span>
                        <span className="value">${Number(mktCap).toLocaleString()}</span>
                    </div>

                    <div className="stat-card">
                        <span className="label">24h Volume</span>
                        <span className="value">${Number(volume).toLocaleString()}</span>
                    </div>

                    <div className="stat-card">
                        <span className="label">Circulating Supply</span>
                        <span className="value">
                            {Number(coin.SUPPLY_CIRCULATING).toLocaleString()} {id}
                        </span>
                    </div>

                    <div className="stat-card" style={{
                        backgroundColor: change24h > 0 ? '#f8fff9' : '#fff8f8'
                    }}>
                        <span className="label">24h Change</span>
                        <span className="value" style={{ color: change24h > 0 ? '#28a745' : '#dc3545' }}>
                            {change24h > 0 ? '▲' : '▼'} {Math.abs(Number(change24h)).toFixed(2)}%
                        </span>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default CoinDetail;