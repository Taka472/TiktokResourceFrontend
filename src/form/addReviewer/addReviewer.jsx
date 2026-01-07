import { useEffect, useState } from "react";
import "./addReviewer.css";

export default function AddReviewer({ onClose, onSuccess }) {
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        nickTiktok: "",
        followers: "",
        contactType: "zalo",
        contactValue: "",
        realName: ""
    });
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setVisible(true);
    }, [])

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

        try {
            const res = await fetch(process.env.REACT_APP_BACKEND + "/api/reviewer/addReviewer", {
                method: "POST",
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
                    />
                </label>

                <label>
                    Lượng followers
                    <input 
                        name = "followers"
                        value = {form.followers}
                        onChange = {handleChange}
                        placeholder = "Lượng follower ở đây"
                    />
                </label>

                <label>
                    Liên hệ <span className="asterisk">*</span>
                    <div className = "contact-row">
                        <select
                            name = "contactType"
                            value = {form.contactType}
                            onChange = {handleChange}
                        >
                            <option value = "zalo">Zalo</option>
                            <option value = "instagram">Ig</option>
                        </select>

                        <input 
                            name = "contactValue"
                            value = {form.contactValue}
                            onChange = {handleChange}
                            placeholder = "Thông tin liên hệ ở đây"
                            required
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
                    />
                </label>

                <div className = "actions">
                    <button type="button" className = "secondary" onClick={closeAnimation}>Hủy</button>
                    <button type="submit" className = "primary" disabled={submitting}>{submitting ? "Đang lưu..." : "Lưu"}</button>
                </div>
            </form>
        </div>
    )
}