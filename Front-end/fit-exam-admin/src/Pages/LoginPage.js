import React from "react";
import {Link} from "react-router-dom";
import {TabTitle} from "../Utils/DynamicTitle";

const LoginPage = () => {
    TabTitle('Đăng nhập | FIT Exam Admin');

    return (
        <div className="main-wrapper">
            <div className="account-page">
                <div className="container">
                    <h3 className="account-title text-white">Đăng nhập</h3>
                    <div className="account-box">
                        <div className="account-wrapper">
                            <form action="/">
                                <div className="form-group">
                                    <label>Email</label>
                                    <input type="email" className="form-control"/>
                                </div>
                                <div class="form-group">
                                    <label>Mật khẩu</label>
                                    <input type="password" class="form-control"/>
                                </div>
                                <div className="text-right">
                                    <Link to="/forgot-password">Quên mật khẩu?</Link>
                                </div>
                                <div class="form-group text-center custom-mt-form-group">
                                    <button class="btn btn-primary btn-block account-btn" type="submit">Đăng nhập</button>
                                </div>
                                <div className="text-center">
                                    <Link to="/signup">Chưa có tài khoản?</Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;