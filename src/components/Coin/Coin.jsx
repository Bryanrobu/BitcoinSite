import './Coin.css';

export default function Coin({ img, shortName, name, price, isFavorite, onToggleFav }) {
    return (
        <div className="CoinFrame">
            <button
                onClick={onToggleFav}
                className={`fav-btn ${isFavorite ? 'favorited' : ''}`}
            >
                {isFavorite ? "❤️ Favorited" : "🤍 Favorite"}
            </button>
            <img className="image" src={img} alt={name} />
            <h2>{shortName}</h2>
            <h3>{name}</h3>
            <span>${price}</span>
        </div>
    );
}