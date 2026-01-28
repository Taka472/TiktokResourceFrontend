import { useEffect, useState } from "react";
import "./addReviewer.css";
import { useLock } from "../../lockContext/lockContext";

export default function AddReviewer({ onClose, onSuccess, reviewer }) {
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        nickTiktok: "",
        followers: "",
        contactType: "zalo",
        contactValue: "",
        realName: ""
    });
    const [visible, setVisible] = useState(false);
    const { locked } = useLock();

    useEffect(() => {
        setVisible(true);
    }, [])

    useEffect(() => {
        if (reviewer) {
            setForm({
                nickTiktok: reviewer.nickTiktok || "",
                followers: reviewer.followers || "",
                contactType: reviewer.contact?.type || "zalo",
                contactValue: reviewer.contact?.value || "",
                realName: reviewer.name || "",
            });
        }
    }, [reviewer]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const closeAnimation = () => {
        setVisible(false);
        setTimeout(onClose, 300);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const url = reviewer
        ? `/api/reviewer/updateReviewer/${reviewer._id}`
        : `/api/reviewer/addReviewer`;

        const method = reviewer ? "PUT" : "POST";

        try {
            const res = await fetch(process.env.REACT_APP_BACKEND + url, {
                method: method,
                headers: { "Content-type": "application/json" },
                body: JSON.stringify({
                    nickTiktok: form.nickTiktok, 
                    followers: form.followers, 
                    contact: { 
                        type: form.contactType, 
                        value: form.contactValue, 
                    }, 
                    name: form.realName,
                }),
            });

            if (!res.ok) {
                throw new Error("Create reviewer failed");
            }

            onSuccess();
            closeAnimation();
        } catch (err) {
            console.error(err);
            alert("Không thể thêm reviewer");
        } finally {
            setSubmitting(false);
        }
    };

    const canDeleteReviewer = (reviewer) => {
        if (!reviewer.latestAppointmentDate) return true;

        const latest = new Date(reviewer.latestAppointmentDate);
        const now = new Date();

        return latest >= now;
    };

    const handleDelete = async () => {
        if (!window.confirm("Bạn có chắc muốn xóa reviewer này?")) return;

        try {
            const res = await fetch(
                process.env.REACT_APP_BACKEND + `/api/reviewer/deleteReviewer/${reviewer._id}`,
                { method: "DELETE" }
            );

            if (!res.ok) throw new Error();

            onSuccess();
            closeAnimation();
        } catch {
            alert("Không thể xóa reviewer");
        }
    };

    return (
        <div className = {`modal ${visible ? "show" : ""}`} onClick={closeAnimation}>
            <form className = {`reviewer-form ${visible ? "show" : ""}`} onSubmit={handleSubmit}
                onClick={(e) => e.stopPropagation()}
            >
                <h3>Thêm reviewer</h3>

                <label>
                    Nick Tiktok <span className="asterisk">*</span>
                    <input 
                        name = "nickTiktok"
                        value = {form.nickTiktok}
                        onChange = {handleChange}
                        placeholder = "Nick tiktok ở đây"
                        required
                        disabled={locked}
                    />
                </label>

                <label>
                    Lượng followers
                    <input 
                        name = "followers"
                        value = {form.followers}
                        onChange = {handleChange}
                        placeholder = "Lượng follower ở đây"
                        disabled={locked}
                    />
                </label>

                <label>
                    Liên hệ <span className="asterisk">*</span>
                    <div className = "contact-row">
                        <select
                            name = "contactType"
                            value = {form.contactType}
                            onChange = {handleChange}
                            disabled={locked}
                        >
                            <option value = "zalo">Zalo</option>
                            <option value = "instagram">Ig</option>
                            <option value = "gmail">Gmail</option>
                            <option value = "tiktok">Tiktok</option>
                        </select>

                        <input 
                            name = "contactValue"
                            value = {form.contactValue}
                            onChange = {handleChange}
                            placeholder = "Thông tin liên hệ ở đây"
                            disabled={locked}
                            style={{margin: "0px"}}
                        />
                    </div>
                </label>

                <label>
                    Tên tiktoker
                    <input 
                        name = "realName"
                        value = {form.realName}
                        onChange = {handleChange}
                        placeholder = "Tên tiktoker ở đây"
                        disabled={locked}
                    />
                </label>

                <div className = "actions">
                    <button type="button" className = "secondary" disabled={locked} onClick={closeAnimation}>Hủy</button>
                    {reviewer && canDeleteReviewer(reviewer) && (
                        <button
                            type="button"
                            className="delete-btn"
                            onClick={handleDelete}
                            disabled={locked}
                        >
                            Xóa
                        </button>
                    )}
                    <button type="submit" className = "primary" disabled={submitting || locked}>{submitting ? "Đang lưu..." : "Lưu"}</button>
                </div>
            </form>
        </div>
    )
}