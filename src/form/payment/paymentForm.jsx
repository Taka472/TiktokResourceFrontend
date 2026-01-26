import { useEffect, useState } from 'react';
import './paymentForm.css';

export default function PaymentForm({ payment, onClose, onSave }) {
    const [deposit, setDeposit] = useState(0);
    const [finalPayment, setFinalPayment] = useState(0);

    const [depositImage, setDepositImage] = useState(null);
    const [finalPaymentImage, setFinalPaymentImage] = useState(null);

    const [depositPreview, setDepositPreview] = useState(null);
    const [finalPreview, setFinalPreview] = useState(null);

    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (payment) {
            setDeposit(payment.deposit || 0);
            setFinalPayment(payment.finalPayment || 0);

            if (payment.depositImage) {
            setDepositPreview(payment.depositImage);
            }

            if (payment.finalPaymentImage) {
            setFinalPreview(payment.finalPaymentImage);
            }
        }
    }, [payment]);

    const handleSubmit = async () => {
        if (saving) return;
        setSaving(true);
        try {
            // 1. Update số tiền
            const res = await fetch(
                process.env.REACT_APP_BACKEND + `/api/payment/updatePayment/${payment.paymentId}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        deposit: Number(deposit),
                        finalPayment: Number(finalPayment),
                    }),
                }
            );

            if (!res.ok) throw new Error("Update payment failed");

            // 2. Upload ảnh cọc nếu còn
            if (depositImage) {
                const fd = new FormData();
                fd.append("image", depositImage);

                await fetch(
                    process.env.REACT_APP_BACKEND + `/api/payment/uploadDepositPayment/${payment.paymentId}`,
                    {
                        method: "POST",
                        body: fd,
                    }
                );
            }

            // 3. Upload ảnh final nếu còn
            if (finalPaymentImage) {
                const fd = new FormData();
                fd.append("image", finalPaymentImage);

                await fetch(
                    process.env.REACT_APP_BACKEND + `/api/payment/uploadPaymentImage/${payment.paymentId}`,
                    {
                        method: "POST",
                        body: fd,
                    }
                );
            }

            await onSave();
            onClose();
        } catch (err) {
            console.error(err);
            alert("Lưu thanh toán thất bại");
        } finally {
            setSaving(false);
        }
    };

    const formatMoney = (value) => {
        if (value === null || value === undefined || value === "") return "";
        return Number(value).toLocaleString("en-US");
    };

    const parseMoney = (value) => {
        return Number(value.replace(/,/g, "")) || 0;
    };

    return (
        <div className = {`payment-form`}>
            <div className = "header">
                <h3 className = 'title'>{payment.reviewer.nickTiktok}</h3>
                <button className = "close-btn" onClick={() => {onClose()}}>x</button>
            </div>

            <label>Tiền cọc (nếu có)</label>
            <input 
                type = "text"
                value = {formatMoney(deposit)}
                onChange = {e => setDeposit(parseMoney(e.target.value))}
                placeholder = "Tiền cọc ở đây nếu có"
            />
            
            <label>Tiền final</label>
            <input 
                type = "text"
                value = {formatMoney(finalPayment)}
                onChange = {e => setFinalPayment(parseMoney(e.target.value))}
                placeholder = "Tiền final ở đây"
            />

            <div className = "payment-image">
                <div className = "image-block">
                    <label>Ảnh cọc</label>
                    <input 
                        type = "file"
                        onChange = {(e) => {
                            const file = e.target.files[0];
                            if (file) {
                                setDepositImage(file);
                                setDepositPreview(URL.createObjectURL(file))
                            }
                        }}
                    />

                    {depositPreview && (
                            <div>
                                <img src={depositPreview} alt="deposit" />
                            </div>
                        )}
                    </div>

                <div className = "image-block">
                    <label>Ảnh tiền final</label>

                    <input 
                        type = "file"
                        onChange = {(e) => {
                            const file = e.target.files[0];
                            if (file) {
                                setFinalPaymentImage(file);
                                setFinalPreview(URL.createObjectURL(file));
                            }
                        }}
                    />

                    {finalPreview && (
                        <div>
                            <img src={finalPreview} alt="final" />
                        </div>
                    )}
                </div>
            </div>
            {payment.paymentStatus === "pending" && (
                <button className="save-btn" disabled={saving} onClick={handleSubmit}>
                    {saving ? "💾 Đang lưu" : "💾 Lưu thanh toán"}
                </button>  
            )}
        </div>
    )
}