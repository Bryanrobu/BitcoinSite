import { useEffect, useState } from "react";
import './Home.css';
import Coin from "../components/Coin/Coin.jsx";
import Header from "../components/Header/header.jsx";
import Chart from "chart.js/auto";
import { Pie } from "react-chartjs-2";
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

    const dataVoorGrafiek = {
        labels: coindeskData.slice(0, 10).map(coin => coin.SYMBOL),
        datasets: [
            {
                label: 'Top 10 Cryptomunten Dominantie',
                data: coindeskData.slice(0, 10).map(coin => Number(coin.CIRCULATING_MKT_CAP_USD) || 0),
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                    '#FF9F40',
                    '#C9CBCF',
                    '#00CC99',
                    '#6666FF',
                    '#FF66FF'
                ],
                borderColor: '#ffffff',
                borderWidth: 2,
                hoverOffset: 15
            },
        ],
    };

    const grafiekOpties = {
        plugins: {
            title: {
                display: true,
                font: { size: 18 }
            },
            legend: {
                display: true,
                position: 'bottom'
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const value = context.raw;
                        return ` $${Number(value).toLocaleString()}`;
                    }
                }
            }
        },
        maintainAspectRatio: false
    };

    const filterLabels = {
        CIRCULATING_MKT_CAP_USD: "Circulating Market Cap",
        TOTAL_MKT_CAP_USD: "Total Market Cap",
        VOLUME_24H_USD: "24h Volume",
        PRICE_USD: "Price"
    };

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

            {!loading && coindeskData.length > 0 && (
                <div className="piechart">
                    <h2 style={{ textAlign: 'center' }}>Top 10 {filterLabels[filter] || "Market Cap"}</h2>
                    <Pie data={dataVoorGrafiek} options={grafiekOpties} />
                </div>
            )}

            <div className="container">
                {loading && coindeskData.length === 0 ? (
                    <p>Loading market data...</p>
                ) : (
                    displayCoins.map(item => (
                        <Link
                            key={item.SYMBOL}
                            to={`/coin/${item.SYMBOL}`}
                            style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
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