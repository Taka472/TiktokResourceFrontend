import { PieChart, Pie } from 'recharts';

export default function Chart({ deposit, final }) {
    const data = [
        { name: "Tiền cọc", value: Number(deposit), fill: "#f59e0b" },
        { name: "Thanh toán cuối", value: Number(final), fill: "#22c55e" }
    ];

    const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value }) => {
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text
            x={x}
            y={y}
            fill="#fff"
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={12}
            fontWeight="600"
            >
            {`${value.toFixed(1)}%`}
            </text>
        );
    };

    return (
        <div className = "chart-card">
            <PieChart width={160} height={160}>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    dataKey="value"
                    label={renderLabel}
                    labelLine={false}
                    startAngle={90}
                    endAngle={-270}
                />
            </PieChart>

            <div className = "legend">
                <span style={{ color: "#f59e0b"}}>● Tiền cọc</span>
                <span style={{ color: "#22c55e" }}>● Thanh toán cuối</span>
            </div>
        </div>
    )
}