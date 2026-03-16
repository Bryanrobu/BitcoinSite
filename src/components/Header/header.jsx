import './Header.css';



function Header({onSearch, onPageSizeChange, pageSize, onFilterChange, filter}) {
    return (
        <header className="header">
            <div className="header-spacer">
                <input
                    className="header-input"
                    onChange={onSearch}
                    type="text"
                    placeholder="Search coins..."
                />

                <select
                    className="header-select"
                    onChange={(e) => onPageSizeChange(e.target.value)}
                    value={pageSize}
                >
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                </select>

                <select
                    className="header-select"
                    onChange={(e) => onFilterChange(e.target.value)}
                    value={filter}
                >
                    <option value="PRICE_USD">Price</option>
                    <option value="TOTAL_MKT_CAP_USD">Total Market Cap</option>
                </select>
            </div>
        </header>
    );
}



export default Header;