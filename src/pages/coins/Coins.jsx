import { NavLink } from 'react-router-dom';
import './Coins.css';

export default function Coins() {
    return (
        <div className = "container">
            <div className = "page-header">
                <NavLink to="/" className="back-btn">
                    ⬅️
                </NavLink>
                <h2>🪙 Mua Coins</h2>
            </div>
        </div>
    )
}