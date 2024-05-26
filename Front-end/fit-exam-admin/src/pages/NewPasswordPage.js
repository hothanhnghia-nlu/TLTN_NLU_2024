import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {TabTitle} from "../commons/DynamicTitle";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {changePassword, fetchUserIdByEmail} from "../service/UserService";

const NewPasswordPage = () => {
    TabTitle('Đặt lại mật khẩu | FIT Exam Admin');

    const [password, setPassword] = useState('');
    const [confPassword, setConfPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confPasswordError, setConfPasswordError] = useState('');
    const [userId, setUserId] = useState('');
    const navigate = useNavigate();

    let userEmail = localStorage.getItem("email");

    useEffect(() => {
        let userId = localStorage.getItem("id");
        if (userId) {
            navigate("/");
        }
    }, [navigate]);

    useEffect(() => {
        getUserId(userEmail);
    }, [userEmail]);

    useEffect(() => {
        if (!userEmail) {
            navigate("/forgot-password");
        }
    }, [navigate, userEmail]);

    const getUserId = async (email) => {
        let res = await fetchUserIdByEmail({email});
        if (res) {
            setUserId(res);
        }
    }

    function handlePasswordChange(event) {
        const newPassword = event.target.value;
        setPassword(newPassword);
        if (!validatePassword(newPassword)) {
            setPasswordError('Mật khẩu phải chứa ít nhất một chữ cái viết thường, một chữ cái viết hoa, một ký tự đặc biệt và có ít nhất 8 ký tự.');
        } else {
            setPasswordError('');
        }
    }

    function handleConfPasswordChange(event) {
        const newConfPassword = event.target.value;
        setConfPassword(newConfPassword);
        if (newConfPassword !== password) {
            setConfPasswordError('Mật khẩu xác nhận không khớp.');
        } else {
            setConfPasswordError('');
        }
    }

    function validatePassword(password) {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return regex.test(password);
    }

    const handleSaveChange = async () => {
        if (!password || !confPassword) {
            toast.error("Vui lòng nhập mật khẩu!");
            return;
        }

        let res = await changePassword(userId, password);
        if (res) {
            toast.success("Đặt lại mật khẩu thành công!", {
                onClose: () => {
                    localStorage.removeItem("email");
                    navigate("/login");
                }
            });
        } else {
            toast.error("Đặt lại mật khẩu thất bại!");
        }
    }

    return (
        <div className="main-wrapper">
            <div className="account-page">
                <div className="container">
                    <h3 className="account-title text-white">Đặt lại mật khẩu</h3>
                    <div className="account-box">
                        <div className="account-wrapper">
                            <div className="form-group">
                                <label>Mật khẩu</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="password"
                                    value={password}
                                    onChange={handlePasswordChange}
                                />
                                {passwordError && <div style={{ color: 'red' }}>{passwordError}</div>}
                            </div>
                            <div className="form-group">
                                <label>Nhập lại mật khẩu</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="confPassword"
                                    value={confPassword}
                                    onChange={handleConfPasswordChange}
                                />
                                {confPasswordError && <div style={{ color: 'red' }}>{confPasswordError}</div>}
                            </div>
                            <div className="form-group text-center custom-mt-form-group">
                                <button className="btn btn-primary btn-block account-btn"
                                        type="submit" onClick={() => handleSaveChange()}>Lưu thay đổi</button>
                                <ToastContainer />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NewPasswordPage;