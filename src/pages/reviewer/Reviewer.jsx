import { useEffect, useState } from "react";
import "./Reviewer.css";
import AddReviewer from "../../form/addReviewer/addReviewer";
import { NavLink } from "react-router-dom";

function formatDateTime(date) {
    const d = new Date(date);

    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();

    const hour = String(d.getHours()).padStart(2, "0");
    const minute = String(d.getMinutes()).padStart(2, "0");

    return `${hour}:${minute} - ${day}/${month}/${year} `;
}

const isSoon = (date) => {
    const d = new Date(date);
    const today = new Date();
    const diff = (d - today) / (1000 * 60 * 60 * 24);
    return diff >= 0;
};

export default function Reviewer() {
    const [reviewer, setReviewer] = useState([]);
    const [showAddReviewer, setShowAddReviewer] = useState(false);
    const [editReviewer, setEditReviewer] = useState();
    const [toast, setToast] = useState("");

    const fetchData = () => {
        fetch(process.env.REACT_APP_BACKEND + "/api/reviewer/getAllReviewer")
        .then(res => res.json())
        .then(data => {
            setReviewer(data);
        })
        .catch(err => console.error(err.message));
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className = "container">
            <div className = "page-header">
                <NavLink to="/" className="back-btn">
                    ⬅️
                </NavLink>
                <h2>👤 Quản lý Reviewer</h2>

                <button className = "primary" onClick = {() => { setShowAddReviewer(true) }}>➕ Thêm reviewer</button>
            </div>

            <div className = "reviewer-list">
                {reviewer.map(r => (
                    <div key={r._id} className = "reviewer-card" onClick={() => {setEditReviewer(r)}}>
                        <div className = "info">
                            <div className = "nick">{r.nickTiktok}</div>
                            <div className = {`status ${
                                r.latestAppointmentDate
                                ? isSoon(r.latestAppointmentDate)
                                    ? "soon"
                                    : "has"
                                : "none"
                            }`}>
                                {r.hasAppointment ? `${formatDateTime(r.latestAppointmentDate)}` : "⚪ Chưa có lịch"}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {(showAddReviewer || editReviewer) && (
                <AddReviewer 
                    onClose = {() => {
                        setShowAddReviewer(false);
                        setEditReviewer(null);
                    }}
                    onSuccess = {() => {
                        fetchData();
                        setToast("✅ Đã lưu thành công");
                        setTimeout(() => setToast(""), 2000);
                    }}
                    reviewer = {editReviewer}
                />
            )}

            {toast && <div className="toast-success">{toast}</div>}
        </div>
    )
}