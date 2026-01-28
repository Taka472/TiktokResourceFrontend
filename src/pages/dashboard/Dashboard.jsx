import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Dashboard.css';

export default function Dashboard() {
  const [appointments, setAppointments] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(process.env.REACT_APP_BACKEND + "/api/appointment/getDashboard")
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

  const formatMoney = (value) => {
    if (value === null || value === undefined || value === "") return "";
    return Number(value).toLocaleString("en-US");
  };

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
          <div>🗓️ Tuần này: <b>{appointments.weekCount} lịch</b></div>
          <div>💰 Đã thanh toán tháng này: <b>{appointments.paidThisMonth} người</b></div>
          <div>💸 Đã chi tháng này: <b>{formatMoney(appointments.totalPaid)} đồng</b></div>
        </div>
      </div>

      <div className="utilities">
        <NavLink to="/calendar" className="utility-card">
          <div className="icon">📅</div>
          <div className="label">Lịch hẹn</div>
        </NavLink>

        <NavLink to="/payment" className="utility-card">
          <div className="icon">💰</div>
          <div className="label">Thanh toán</div>
        </NavLink>

        <NavLink to="/reviewer" className="utility-card">
          <div className="icon">👤</div>
          <div className="label">Quản lý Reviewer</div>
        </NavLink>

        <NavLink to="/statistic" className="utility-card">
          <div className="icon">📊</div>
          <div className="label">Thống kê</div>
        </NavLink>
      </div>
    </div>
  );
}