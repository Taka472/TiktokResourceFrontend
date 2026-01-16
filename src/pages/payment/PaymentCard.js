import "./Payment.css";

const payment_status = {
    unpaid: {
        label: "Chưa thanh toán",
        color: "#EF4444",
    },
    pending: {
        label: "Chờ xác thực",
        color: "#F59E0B",
    },
    verified: {
        label: "Đã thanh toán",
        color: "#22C55E",
    }
}

export default function PaymentCard ({ data }) {
    const status = payment_status[data.paymentStatus];
    console.log(status);

    return (
        <div className = "payment-card">
            <div className = "payment-info">
                <div className = "payment-name">
                    {data.reviewer.nickTiktok}
                </div>
                <div className = {`payment-status ${status.className}`}>
                    {status.label}
                </div>
            </div>
        </div>
    )
}