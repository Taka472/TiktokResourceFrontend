import { useEffect, useState } from "react";
import "./Calendar.css";
import AddReviewer from "../../form/addReviewer/addReviewer";
import AddCalendar from "../../form/addCalendar/addCalendar";

function getStartOfWeek(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    d.setDate(d.getDate() + diff);
    d.setHours(0, 0, 0, 0);
    return d;
}

function getWeekDays(start) {
    return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        return d;
    })
}

function isToday(date) {
    const today = new Date();
    return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
    )
}

export default function Calendar() {
    const [todayAppointment, setTodayAppointment] = useState([]);
    const [weekStart, setWeekStart] = useState(getStartOfWeek(new Date()));
    const [showAddReviewer, setShowAddReviewer] = useState(false);
    const [showAddCalendar, setShowAddCalendar] = useState(false);
    const [weekAppointments, setWeekAppointments] = useState([]);
    const [reloadWeek, setReloadWeek] = useState(0);
    const [editAppointment, setEditAppointment] = useState(null);
    const [toast, setToast] = useState("");

    function changeWeek(days) {
        const newDate = new Date(weekStart);
        newDate.setDate(newDate.getDate() + days);
        setWeekStart(newDate);
    }

    function formatDate(date) {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        return `${day}/${month}`;

    }

    function formatWeek(date) {
        const end = new Date(date);
        end.setDate(end.getDate() + 6);
        return formatDate(date) + " - " + formatDate(end);
    }

    useEffect(() => {
        fetch(process.env.REACT_APP_BACKEND + "/api/appointment/getTodayAppointment")
        .then((res) => res.json())
        .then((data) => {
            setTodayAppointment(data.today);
        })
        .catch((err) => {
            console.error(err);
        })
    }, [])

    useEffect(() => {
        const startParam = weekStart.toISOString();

        fetch(process.env.REACT_APP_BACKEND + "/api/appointment/getWeekAppointment?start=" + startParam)
        .then((res) => res.json())
        .then(data => {
            const grouped = {};

            data.forEach(a => {
                const d = new Date(a.appointmentDate);
                d.setHours(0, 0, 0, 0);
                const key = d.toISOString();

                if (!grouped[key]) grouped[key] = [];
                grouped[key].push(a);
            });

            setWeekAppointments(grouped);
        })
    }, [weekStart, reloadWeek])

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa cuộc hẹn này?")) return;
    }

    return (
        <div className = "container">
            <div className = "page-header">
                <h2>📅 Quản lý lịch</h2>

                <div className="actions">
                    <button className="primary" onClick = {() => setShowAddCalendar(true)}>➕ Thêm lịch</button>
                    {(showAddCalendar || editAppointment) && (
                        <AddCalendar 
                            onClose = {() => {
                                setShowAddCalendar(false); 
                                setEditAppointment(null);
                            }}
                            onSuccess = {() => {
                                setReloadWeek(prev => prev + 1);
                                setToast("✅ Đã lưu thành công");
                                setTimeout(() => setToast(""), 2000);
                            }}
                            appointment = {editAppointment}
                        />
                    )}
                    <button className="secondary" onClick = {() => setShowAddReviewer(true)}>➕ Thêm reviewer</button>
                    {showAddReviewer && (
                        <AddReviewer 
                            onClose = {() => setShowAddReviewer(false)}
                            onSuccess = {() => {
                                setReloadWeek(prev => prev + 1);
                                setToast("✅ Đã lưu thành công");
                                setTimeout(() => setToast(""), 2000);
                            }}
                        />
                    )}
                </div>
            </div>

            <div className="section">
                <h3>📌 Hôm nay</h3>
                {todayAppointment.length === 0 ? (
                    <div className="empty">Không có lịch</div>
                ) : (
                    <ul>
                        {todayAppointment.map((a) => (
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

            <div className="week-nav">
                <button onClick={() => changeWeek(-7)}>⬅️</button>
                <div className="week-label">
                    Ngày {formatWeek(weekStart)}
                </div>
                <button onClick={() => changeWeek(7)}>➡️</button>
            </div>
            <div className="week-days">
                {getWeekDays(weekStart).map((day) => {
                    const dayKey = new Date(day);
                    dayKey.setHours(0, 0, 0, 0);
                    return (
                        <div key={day.toISOString()} className={`day-card ${isToday(day) ? "today" : ""}`}>
                        <div className="day-name">
                            {day.toLocaleDateString("vi-VN", { weekday: "short" })}
                        </div>
                        <div className="day-date">
                            {formatDate(day)}
                        </div>

                        {weekAppointments[dayKey.toISOString()]?.map(a => (
                            <div key={a._id} className = "appointment-item"
                                onClick={() => setEditAppointment(a)}
                            >
                                <div className = "time">
                                    {new Date(a.appointmentDate).toLocaleTimeString("vi-VN", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </div>
                                <div className = "name">{a.reviewerId.nickTiktok}</div>
                            </div>
                        ))}
                    </div>
                )})}
            </div>
            {toast && <div className="toast-success">{toast}</div>}
        </div>
    )
}