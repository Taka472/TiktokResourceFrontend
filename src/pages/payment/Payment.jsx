import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import PaymentCard from "./PaymentCard";

export default function Payment() {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch(process.env.REACT_APP_BACKEND + "/api/payment/getPaymentDashboard")
        .then(res => res.json())
        .then(data => {
            console.log(data);
            setData(data);
        })
        .catch(err => {
            console.error(err);
        })
    }, []);

    return (
        <div className = "container">
            <div className = "page-header">
                <NavLink to="/" className="back-btn">
                    ⬅️
                </NavLink>
                <h2>💰 Thanh toán</h2>
            </div>

            {data.map(item => (
                <PaymentCard 
                    key={item.appointmentId}
                    data={item}
                    onClick={() => {console.log("Edit this payment")}}
                />
            ))}
        </div>
    )
}