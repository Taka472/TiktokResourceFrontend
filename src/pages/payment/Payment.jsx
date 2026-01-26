import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import PaymentCard from "./PaymentCard";
import PaymentForm from "../../form/payment/paymentForm";
import './Payment.css';

export default function Payment() {
    const [data, setData] = useState([]);
    const [month, setMonth] = useState(() => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
    });
    const [selectedPayment, setSelectedPayment] = useState();
    const [showForm, setShowForm] = useState(false);

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

    const reloadData = async () => {
        try {
            const res = 
            await fetch(process.env.REACT_APP_BACKEND + `/api/payment/getPaymentDashboard?time=${month}`);

            const data = await res.json();
            setData(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetch(process.env.REACT_APP_BACKEND + `/api/payment/getPaymentDashboard?time=${month}`)
        .then(res => res.json())
        .then(data => {
            setData(data);
        })
        .catch(err => {
            console.error(err);
        })
    }, [month]);

    return (
        <div className = "container">
            <div className = "page-header">
                <NavLink to="/" className="back-btn">
                    ⬅️
                </NavLink>
                <h2>💰 Thanh toán</h2>
            </div>
            
            <div className = "month-switch">
                <button onClick={() => changeMonth(-1)}>⬅️</button>
                <span>{formatMonth(month)}</span>
                <button onClick={() => changeMonth(1)}>➡️</button>
            </div>

            <div className = "payment-container">
                {data.map(item => (
                    <PaymentCard 
                        key={item.appointmentId}
                        data={item}
                        onClick={() => {setSelectedPayment(item); setShowForm(true)}}
                    />
                ))}
            </div>

            {showForm && (
                <div className="payment-overlay" onClick={() => setShowForm(false)}>
                    <div
                        className="payment-form-wrapper"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <PaymentForm 
                            payment={selectedPayment}
                            onClose={() => setShowForm(false)}
                            onSave={reloadData}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}