import { NavLink } from "react-router-dom";

export default function Payment() {
    return (
        <div className = "container">
            <div className = "page-header">
                <NavLink to="/" className="back-btn">
                    ⬅️
                </NavLink>
                <h2>💰 Thanh toán</h2>
            </div>
        </div>
    )
}