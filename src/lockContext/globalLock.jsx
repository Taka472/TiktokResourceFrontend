import { useState } from 'react';
import { useLock } from './lockContext';
import './globalLock.css';

export default function GlobalLock() {
    const { locked, lock, unlock } = useLock();
    const [show, setShow] = useState(false);
    const [password, setPassword] = useState("");

    const handleUnlock = async () => {
        const res = await fetch(process.env.REACT_APP_BACKEND + "/api/unlock", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password }),
        })

        if (res.ok) {
            unlock();
            setShow(false);
            setPassword("");
        } else {
            alert("Sai mật khẩu");
        }
    };

    const closeModal = () => {
        setShow(false);
        setPassword("");
    }

    return (
        <div>
            <div className = "global-lock" onClick = {() => {locked ? setShow(true) : lock()}}>
                {locked ? "🔒" : "🔓"}
            </div>

            {show && locked && (
                <div className = "lock-modal" onClick={closeModal}>
                    <div className = "lock-box" onClick={(e) => {e.stopPropagation()}}>
                        <h3>🔐 Mở khóa</h3>
                        <input 
                            type="password"
                            placeholder='Nhập mật khẩu'
                            autoFocus
                            value={password}
                            onChange={(e) => {setPassword(e.target.value)}}
                        />
                        <button className="primary" onClick={handleUnlock}>Mở khóa</button>
                    </div>
                </div>
            )}
        </div>
    )
}