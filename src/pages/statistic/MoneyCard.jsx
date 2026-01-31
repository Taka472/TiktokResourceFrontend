export default function MoneyCard({ title, value, highlight }) {
    const formatMoney = (value) => {
        if (value === null || value === undefined || value === "") return "";
        return Number(value).toLocaleString("en-US");
    };
    
    return (
        <div className = {`money-card ${highlight ? "highlight" : ""}`}>
            <div className = "title">{title}</div>
            <div className = "value">{formatMoney(value)}</div>
        </div>
    )
}