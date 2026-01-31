import { NavLink } from "react-router-dom";
import './Statistic.css';
import { useEffect, useState } from "react";
import MoneyCard from "./MoneyCard";
import Chart from "./Chart";
import ReviewerList from "./ReviewerList";

export default function Statistic() {
    const [month, setMonth] = useState(() => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
    });
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch(process.env.REACT_APP_BACKEND + `/api/statistic/getStatistic?time=${month}`)
        .then(res => res.json())
        .then(data => {
            setData(data);
        })
    }, [month]);

    const changeMonth = (delta) => {
        const [y, m] = month.split("-").map(Number);
        const d = new Date(y, m - 1 + delta, 1);
        setMonth(
            `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
        );
    }

    const formatMonth = (m) => {
        const [y, mo] = m.split("-");
        return `Tháng ${mo}/${y}`;
    }

    if (data) {
        return (
            <div className = "container">
                <div className = "page-header">
                    <NavLink to="/" className="back-btn">
                        ⬅️
                    </NavLink>
                    <h2>📊 Thống kê</h2>
                </div>

                <div className = "month-switch">
                    <button onClick={() => changeMonth(-1)}>⬅️</button>
                    <span>{formatMonth(month)}</span>
                    <button onClick={() => changeMonth(1)}>➡️</button>
                </div>

                <MoneyCard title="Tổng tiền chi tháng này" style={{width: "100%"}} value={data.totalSpent} highlight />

                <div className = "statistic-info">
                    <div className = "statistic-number">
                        <MoneyCard title="Tiền cọc" value={data.totalDeposit} />
                        <MoneyCard title="Tiền thanh toán cuối" value={data.totalFinalPayment} />
                    </div>
                    <Chart deposit={data.depositPercent} final={data.finalPercent} />
                </div>

                <h3>Đánh giá các Reviewer</h3>
                <ReviewerList reviewers={data.reviewers} />
            </div>
        )
    } 
}