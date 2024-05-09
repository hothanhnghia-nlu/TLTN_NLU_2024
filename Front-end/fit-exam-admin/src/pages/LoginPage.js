import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {TabTitle} from "../commons/DynamicTitle";
import {loginApi} from "../service/UserService";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const LoginPage = () => {
    TabTitle('Đăng nhập | FIT Exam Admin');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        let userId = localStorage.getItem("id");
        if (userId) {
            navigate("/");
        }
    }, [navigate]);

    const handleLogin = async () => {
        if (!email || !password) {
            toast.error("Vui lòng nhập email hoặc mật khẩu!");
            return;
        }

        let res = await loginApi(email, password);
        if (res) {
            if (res.status !== 400) {
                localStorage.setItem("id", res.id);
                navigate("/");
            } else {
                toast.error("Email hoặc mật khẩu không đúng!");
            }
        }
    }

    return (
        <div className="main-wrapper">
            <div className="account-page">
                <div className="container">
                    <h3 className="account-title text-white">Đăng nhập</h3>
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
                            <div className="form-group">
                                <label>Mật khẩu</label>
                                <input type="password" className="form-control" id="password"
                                       value={password}
                                       onChange={(event) => {
                                           setPassword(event.target.value);
                                       }}
                                />
                            </div>
                            <div className="text-right">
                                <Link to="/forgot-password">Quên mật khẩu?</Link>
                            </div>
                            <div className="form-group text-center custom-mt-form-group">
                                <button className="btn btn-primary btn-block account-btn"
                                        type="submit" onClick={() => handleLogin()}>Đăng nhập</button>
                                <ToastContainer />
                            </div>
                            <div className="text-center">
                                <Link to="/signup">Chưa có tài khoản?</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;