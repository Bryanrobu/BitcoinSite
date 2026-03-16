import { useEffect, useState } from "react";
import './Home.css';
import Coin from "../components/Coin/Coin.jsx";
import Header from "../components/Header/header.jsx";
import { Link } from "react-router-dom";

function Home() {
    const [zoekData, setZoekData] = useState("");
    const [coindeskData, setCoindeskData] = useState(null);
    const [pageSize, setPageSize] = useState("25");
    const [filter, setFilter] = useState("PRICE_USD");
    const [loading, setLoading] = useState(true);

    function zoeken(event) {
        setZoekData(event.target.value);
    }

    function setPage(event) {
        setPageSize(event.target.value);
    }

    useEffect(() => {
        setLoading(true);
        fetch(`https://data-api.coindesk.com/asset/v1/top/list?page=1&page_size=${pageSize}&sort_by=${filter}&sort_direction=DESC&groups=ID,BASIC,SUPPLY,PRICE,MKT_CAP,VOLUME,CHANGE,TOPLIST_RANK&toplist_quote_asset=USD`)
            .then(response => response.json())
            .then(jsonResponse => {
                setCoindeskData(jsonResponse);
                setLoading(false);
            })
            .catch(err => {
                console.error("Fetch error:", err);
                setLoading(false);
            });
    }, [pageSize, filter]);

    return (
        <>
            <Header
                onSearch={zoeken}
                onPageSizeChange={setPage}
                pageSize={pageSize}
                onFilterChange={setFilter}
                filter={filter}
            />

            <div className="container">
                {loading ? (
                    <p>Loading market data...</p>
                ) : (
                    coindeskData?.Data?.LIST
                        ?.filter(coin =>
                            coin.SYMBOL.toLowerCase().includes(zoekData.toLowerCase()) ||
                            coin.URI.toLowerCase().includes(zoekData.toLowerCase())
                        )
                        .map(item => (
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
                                />
                            </Link>
                        ))
                )}
            </div>
        </>
    );
}

export default Home;