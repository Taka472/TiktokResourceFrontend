import { useEffect, useState } from "react";
import "./addCalendar.css";

export default function AddCalendar({ onClose, onSuccess, appointment }) {
    const [visible, setVisible] = useState(false);
    const [reviewer, setReviewer] = useState([]);
    const [form, setForm] = useState({
        reviewerId: "",
        deposit: "",
        finalPayment: "",
        date: "",
        time: "",
    });

    useEffect(() => {
        setVisible(true);
    }, []);

    const closeAnimation = () => {
        setVisible(false);
        setTimeout(onClose, 300);
    }

    useEffect(() => {
        if (appointment) {
            const d = new Date(appointment.appointmentDate);
            const dateStr = d.toISOString().slice(0, 10);
            const timeStr = d.toTimeString().slice(0, 5);

            setForm({
                reviewerId: appointment.reviewerId._id,
                date: dateStr,
                time: timeStr,
            });
        }
    }, [appointment]);

    useEffect(() => {
        fetch(process.env.REACT_APP_BACKEND + "/api/reviewer/getReviewerId")
            .then(res => res.json())
            .then(data => {
            setReviewer(data);
         })
        .catch(err => {
            console.error(err);
        });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const canDeleteCalendar = (appointment) => {
        if (!appointment?.appointmentDate) return false;

        const appointmentDate = new Date(appointment.appointmentDate);
        const today = new Date();

        // Set hôm nay về 00:00:00
        today.setHours(0, 0, 0, 0);

        return appointmentDate > today;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const datetime = new Date(`${form.date}T${form.time}`)
        try {
            let url = process.env.REACT_APP_BACKEND + "/api/appointment/addAppointment";
            let method = "POST";

            if (appointment) {
                url = process.env.REACT_APP_BACKEND + "/api/appointment/updateAppointment/" + appointment._id;
                method = "PUT";
            }

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    reviewerId: form.reviewerId,
                    datetime,
                }),
            });

            if (!res.ok) throw new Error("Lưu lịch thất bại");

            const savedAppointment = await res.json();
            console.log(savedAppointment);

            if (savedAppointment) {
                await fetch(process.env.REACT_APP_BACKEND + "/api/payment/createPayment/", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        appointmentId: savedAppointment._id,
                        deposit: 0,
                        finalPayment: 0,
                    })
                })
            }

            onSuccess();
            onClose();
        } catch (err) {
            console.error(err);
            alert("Không thể thêm lịch");
        }
    };

    return (
        <div className = {`modal ${visible ? "show" : ""}`} onClick={closeAnimation}>
            <form className={`appointment-form ${visible ? "show" : ""}`}
                onSubmit={handleSubmit}
                onClick={(e) => e.stopPropagation()}
            >
                <h3>Thêm lịch</h3>
                
                <label>
                    Tiktoker <span className="asterisk">*</span>
                    <select
                        name = "reviewerId"
                        value = {form.reviewerId}
                        onChange = {handleChange}
                        required
                    >
                        <option value = "">-- Chọn reviewer --</option>
                        {reviewer.map(r => (
                            <option key={r._id} value={r._id}>
                                {r.nickTiktok}
                            </option>
                        ))}
                    </select>
                </label>

                <label>
                    Ngày <span className="asterisk">*</span>
                    <input 
                        name = "date"
                        type = "date"
                        value = {form.date}
                        onChange = {handleChange}
                        required
                    />
                </label>

                <label>
                    Thời gian <span className="asterisk">*</span>
                    <input 
                        name = "time"
                        type = "time"
                        value = {form.time}
                        onChange = {handleChange}
                        required
                    />
                </label>

                <div className = "actions">
                    <button type = "button" className = "secondary" onClick={closeAnimation}>Hủy</button>
                    
                    {(appointment && canDeleteCalendar(appointment)) && (
                        <button
                            type="button"
                            className="delete-btn"
                            onClick={async () => {
                                if (!window.confirm("Bạn có chắc muốn xóa lịch này?")) return;

                                try {
                                    const res = await fetch(
                                        process.env.REACT_APP_BACKEND + "/api/appointment/deleteAppointment/" + appointment._id,
                                        { method: "DELETE" }
                                    );

                                    if (!res.ok) throw new Error("Xóa thất bại");

                                    onSuccess();
                                    closeAnimation();
                                    alert("✅ Đã xóa thành công");
                                } catch (err) {
                                    console.error(err);
                                    alert("Không thể xóa lịch");
                                }
                            }}
                        >
                            Xóa
                        </button>
                    )}
                    
                    <button type = "submit" className = "primary">Lưu lịch</button>
                </div>
            </form>
        </div>
    )
}