import {React, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {TabTitle} from "../commons/DynamicTitle";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {changePassword} from "../service/UserService";

const ChangePasswordPage = () => {
    TabTitle('Đặt lại mật khẩu | FIT Exam Admin');

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confPassword, setConfPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confPasswordError, setConfPasswordError] = useState('');
    const navigate = useNavigate();

    const userId = localStorage.getItem("id");

    function handlePasswordChange(event) {
        const password = event.target.value;
        setNewPassword(password);
        if (!validatePassword(password)) {
            setPasswordError('Mật khẩu phải chứa ít nhất một chữ cái viết thường, một chữ cái viết hoa, một ký tự đặc biệt và có ít nhất 8 ký tự.');
        } else if (password === oldPassword) {
            setPasswordError('Mật khẩu mới không được trùng mật khẩu cũ.');
        } else {
            setPasswordError('');
        }
    }

    function handleConfPasswordChange(event) {
        const newConfPassword = event.target.value;
        setConfPassword(newConfPassword);
        if (newConfPassword !== newPassword) {
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
        if (!oldPassword || !newPassword || !confPassword) {
            toast.error("Vui lòng nhập mật khẩu!");
            return;
        }

        let res = await changePassword(userId, newPassword);
        if (res) {
            toast.success("Đổi mật khẩu thành công!", {
                onClose: () => {
                    localStorage.removeItem("id");
                    navigate("/login");
                }
            });
        } else {
            toast.error("Đổi mật khẩu thất bại!");
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
                                <label>Mật khẩu cũ</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="password"
                                    value={oldPassword}
                                    onChange={(event) => {
                                        setOldPassword(event.target.value);
                                    }}
                                />
                            </div>
                            <div className="form-group">
                                <label>Mật khẩu mới</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="password"
                                    value={newPassword}
                                    onChange={handlePasswordChange}
                                />
                                {passwordError && <div style={{ color: 'red' }}>{passwordError}</div>}
                            </div>
                            <div className="form-group">
                                <label>Xác thực mật khẩu mới</label>
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
                            <div className="text-center">
                                <Link to="/">Về trang chủ</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChangePasswordPage;