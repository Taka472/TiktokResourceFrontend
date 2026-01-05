import { useEffect, useState } from 'react';
import './Dashboard.css';

export default function Dashboard() {
  const [appointments, setAppointments] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/appointment/getDashboard")
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      setAppointments(data);
      setLoading(false);
    })
    .catch((err) => {
      console.error(err);
    })
  }, [])

  if (loading) {
    return <div className="important">Đang tải dữ liệu...</div>;
  }

  if (!appointments) {
    return <div className="important">Không lấy được dữ liệu</div>;
  }

  return (
    <div className = "container">
      <div className = "header">
        <h1>Chào mừng trở lại</h1>
      </div>
      <div className = "important">
        <h2>📌 Thông tin quan trọng</h2>
        <div className = "section">
          <b>Hôm nay: </b>
          {appointments.today.length === 0 ? (
            <div className = "empty">Không có lịch</div>
          ) : (
            <ul>
              {appointments.today.map((a) => (
                <li key={a.id}>
                  {a.reviewer} -{" "}
                  {new Date(a.datetime).toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className = "summary">
          <div>🗓️ Tuần này: <b>{appointments.weekCount}</b> lịch</div>
          <div>💰 Chưa thanh toán: <b>{appointments.unpaidThisMonth}</b> người</div>
        </div>
      </div>

      <div className="utilities">
        <div className="utility-card">
          <div className="icon">📅</div>
          <div className="label">Lịch & Reviewer</div>
        </div>

        <div className="utility-card">
          <div className="icon">💰</div>
          <div className="label">Thanh toán</div>
        </div>

        <div className="utility-card">
          <div className="icon">👤</div>
          <div className="label">Quản lý Reviewer</div>
        </div>

        <div className="utility-card">
          <div className="icon">📊</div>
          <div className="label">Thống kê</div>
        </div>
      </div>
    </div>
  );
}