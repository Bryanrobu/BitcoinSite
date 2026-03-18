import './Header.css';

export default function Header({ onSearch, onPageSizeChange, pageSize, onFilterChange, filter, onDirectionChange, direction }) {
    return (
        <header className="header">
            <div className="header-spacer">
                <input
                    className="header-input"
                    onChange={onSearch}
                    type="text"
                    placeholder="Search coins..."
                />
                <select className="header-select" onChange={onPageSizeChange} value={pageSize}>
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="75">75</option>
                    <option value="100">100</option>
                </select>
                <select className="header-select" onChange={e => onFilterChange(e.target.value)} value={filter}>
                    <option value="CIRCULATING_MKT_CAP_USD">Circulating Market Cap</option>
                    <option value="PRICE_USD">Price in USD</option>
                    <option value="TOTAL_MKT_CAP_USD">Total Market Cap</option>
                </select>
                <select className="header-select" onChange={e => onDirectionChange(e.target.value)} value={direction}>
                    <option value="DESC">Desc</option>
                    <option value="ASC">Asc</option>
                </select>
            </div>
        </header>
    );
}