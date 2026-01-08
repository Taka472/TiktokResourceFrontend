import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Dashboard.css';
import { getToken } from "firebase/messaging";
import { messaging } from "../../firebase/firebase";

export default function Dashboard() {
  const [appointments, setAppointments] = useState(null);
  const [loading, setLoading] = useState(true);
  const enabled = Notification.permission === "granted";

  async function enableNotification() {
    // const permission = await Notification.requestPermission();
    // if (permission !== "granted") return;

    // const token = await getToken(messaging, {
    //   vapidKey: "YOUR_VAPID_KEY",
    // });

    // // GỬI TOKEN LÊN BACKEND
    // await fetch("/api/notification/save-token", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ token }),
    // });
  }

  useEffect(() => {
    fetch(process.env.REACT_APP_BACKEND + "/api/appointment/getDashboard")
    .then((res) => res.json())
    .then((data) => {
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
          <div>💰 Đã thanh toán tháng này: <b>{appointments.paidThisMonth}</b> người</div>
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

      <button className="primary notification" onClick={enableNotification}>
        {enabled ?  "🔔 Tắt thông báo lịch hẹn" : "🔔 Bật thông báo lịch hẹn"}
      </button>
    </div>
  );
}