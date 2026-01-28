import "./Payment.css";

const payment_status = {
    pending: {
        label: "Chưa thanh toán",
        color: "#EF4444",
    },
    deposit: {
        label: "Đã cọc",
        color: "#F59E0B",
    },
    verified: {
        label: "Đã thanh toán",
        color: "#22C55E",
    }
}

export default function PaymentCard ({ data, onClick }) {
    const status = payment_status[data.paymentStatus];

    return (
        <div className = "payment-card" onClick={onClick}>
            <div className = "payment-info">
                <div className = "payment-name">
                    {data.reviewer.nickTiktok}
                </div>
                <div className = {`payment-status`} style={{color: status.color}}>
                    {status.label}
                </div>
            </div>
        </div>
    )
}