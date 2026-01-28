import { NavLink } from "react-router-dom";
import './Statistic.css';

export default function Statistic() {
    return (
        <div className = "container">
            <div className = "page-header">
                <NavLink to="/" className="back-btn">
                    ⬅️
                </NavLink>
                <h2>📊 Thống kê</h2>
            </div>
        </div>
    )
}