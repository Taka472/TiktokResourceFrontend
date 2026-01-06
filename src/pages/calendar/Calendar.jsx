import { useEffect, useState } from "react";
import "./Calendar.css";

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

export default function Calendar() {
    const [todayAppointment, setTodayAppointment] = useState([]);
    const [weekStart, setWeekStart] = useState(getStartOfWeek(new Date()));

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
        return formatDate(date) + " - " + formatDate(date.getDate() + 6);
    }

    useEffect(() => {
        fetch(process.env.REACT_APP_BACKEND + "/api/appointment/getTodayAppointment")
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            setTodayAppointment(data.today);
        })
        .catch((err) => {
            console.error(err);
        })
    }, [])

    return (
        <div className = "container">
            <div className = "page-header">
                <h2>📅 Quản lý lịch</h2>

                <div className="actions">
                    <button className="primary">➕ Thêm lịch</button>
                    <button className="secondary">➕ Thêm reviewer</button>
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
                {getWeekDays(weekStart).map((day) => (
                    <div key={day.toISOString()} className="day-card">
                    <div className="day-name">
                        {day.toLocaleDateString("vi-VN", { weekday: "short" })}
                    </div>
                    <div className="day-date">
                        {formatDate(day)}
                    </div>

                    {/* {weekAppointments[day.getDay()]?.map(a => (
                        <AppointmentCard key={a.id} {...a} />
                    ))} */}
                    </div>
                ))}
            </div>
        </div>
    )
}