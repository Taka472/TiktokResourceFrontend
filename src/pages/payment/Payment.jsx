import { NavLink } from "react-router-dom";

export default function Payment() {
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