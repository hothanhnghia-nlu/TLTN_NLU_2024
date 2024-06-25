import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {TabTitle} from "../commons/DynamicTitle";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {sendEmail} from "../service/UserService";

const ForgotPasswordPage = () => {
    TabTitle('Quên mật khẩu | FIT Exam Admin');

    const [email, setEmail] = useState('');
    const [loadingAPI, setLoadingAPI] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        let userId = localStorage.getItem("id");
        if (userId) {
            navigate("/");
        }
    }, [navigate]);

    // Thực hiện Đặt lại mật khẩu
    const handleResetPassword = async () => {
        if (!email) {
            toast.error("Vui lòng nhập Email!");
            return;
        }
        setLoadingAPI(true);
        let res = await sendEmail(email);
        if (res) {
            if (res.status !== 400) {
                localStorage.setItem("email", email);
                toast.success("Đang gửi link đến Email của bạn!");
            } else {
                toast.error("Email không đúng!");
            }
        }
        setLoadingAPI(false);
    }

    return (
        <div className="main-wrapper">
            <div className="account-page">
                <div className="container">
                    <h3 className="account-title text-white">Quên mật khẩu</h3>
                    <div className="account-box">
                        <div className="account-wrapper">
                            <div className="form-group">
                                <label>Email</label>
                                <input type="email" className="form-control" id="email"
                                       value={email}
                                       onChange={(event) => {
                                           setEmail(event.target.value);
                                       }}
                                />
                            </div>
                            <div className="form-group text-center custom-mt-form-group">
                                <button className="btn btn-primary btn-block account-btn"
                                        type="submit" onClick={() => handleResetPassword()}>
                                    {loadingAPI && <i className="fas fa-sync fa-spin"></i>}
                                    &nbsp;Đặt lại mật khẩu
                                </button>
                                <ToastContainer/>
                            </div>
                            <div className="text-center">
                                <Link to="/login">Về trang đăng nhập</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ForgotPasswordPage;