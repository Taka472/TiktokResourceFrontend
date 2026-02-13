export default function ReviewerList({ reviewers }) {
    if (!reviewers || reviewers.length === 0) {
        return <p className = "empty">Chưa có thanh toán tháng này</p>
    }

    const formatMoney = (value) => {
        if (value === null || value === undefined || value === "") return "";
        return Number(value).toLocaleString("en-US");
    };

    return (
        <div className = "reviewer-list">
            {reviewers.map((r, idx) => (
                <div className = "reviewer-card" key={idx}>
                    <div className = "reviewer-name"><b>{r.reviewerName}</b></div>
                    <div className = "reviewer-ratio">Tỉ lệ: {Number(r.ratio).toFixed(3)}</div>
                    <div className = "reviewer-meta">
                        <span>Followers: {r.followers}</span>
                        <span>Tổng thanh toán: {formatMoney(r.totalPayment)}</span>
                    </div>
                </div>
            ))}
        </div>
    )
}