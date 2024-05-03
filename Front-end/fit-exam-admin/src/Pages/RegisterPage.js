import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {TabTitle} from "../Utils/DynamicTitle";
import {registerApi} from "../Service/UserService";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const RegisterPage = () => {
    TabTitle('Đăng ký | FIT Exam Admin');

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confPassword, setConfPassword] = useState("");
    const [role, setRole] = useState(0);
    const navigate = useNavigate();

    const handleCheckboxChange = (event) => {
        const value = parseInt(event.target.value, 10);
        setRole(value);
    };

    const handleRegister = async () => {
        if (!name || !email || !password || !confPassword) {
            toast.error("Vui lòng điền đầy đủ thông tin!");
            return;
        }
        if (confPassword !== password) {
            toast.error("Mật khẩu xác nhận không đúng!");
            return;
        }

        let res = await registerApi(name, email, password, role);
        if (res) {
            if (res.status !== 400) {
                toast.success("Đăng ký thành công!", {
                    onClose: () => {
                        navigate("/login");
                    }
                });
            } else {
                toast.error("Email đã tồn tại!");
            }
        }
    }

    return (
        <div className="main-wrapper">
            <div className="account-page">
                <div className="container">
                    <h3 className="account-title text-white">Đăng ký</h3>
                    <div className="account-box">
                        <div className="account-wrapper">
                            <div className="form-group">
                                <label>Họ và tên</label>
                                <input type="text" className="form-control" id="name"
                                       value={name}
                                       onChange={(event) => {
                                           setName(event.target.value);
                                       }}
                                />
                            </div>
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
                            <div className="form-group">
                                <label>Nhập lại mật khẩu</label>
                                <input type="password" className="form-control" id="confPassword"
                                       value={confPassword}
                                       onChange={(event) => {
                                           setConfPassword(event.target.value);
                                       }}
                                />
                            </div>
                            <div className="form-group">
                                <input type="checkbox" required="required"
                                       value={1}
                                       checked={role === 1}
                                       onChange={handleCheckboxChange}
                                />
                                <label className="ml-2">Tôi là giáo viên?</label>
                            </div>
                            <div className="form-group text-center custom-mt-form-group">
                                <button className="btn btn-primary btn-block account-btn"
                                        type="submit" onClick={() => handleRegister()}>Đăng ký
                                </button>
                                <ToastContainer/>
                            </div>
                            <div className="text-center">
                                <Link to="/login">Đã có tài khoản?</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;