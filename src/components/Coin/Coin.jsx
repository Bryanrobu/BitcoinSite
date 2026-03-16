import './Coin.css'

function Coin({img, shortName, name, price}) {

    function Click() {
        console.log("test")
    }
    return (
        <div className={"CoinFrame"}>
            <img className={"image"} alt={"Coin logo"} src={img}/>
            <h2>{shortName}</h2>
            <h3>{name}</h3>
            <span>${parseFloat(price).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})} USD</span>
        </div>
    );
}

export default Coin
