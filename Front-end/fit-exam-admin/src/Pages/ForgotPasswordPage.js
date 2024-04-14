import React from "react";
import {Link} from "react-router-dom";
import {TabTitle} from "../Utils/DynamicTitle";

const ForgotPasswordPage = () => {
    TabTitle('Quên mật khẩu | FIT Exam Admin');

    return (
        <div className="main-wrapper">
            <div className="account-page">
                <div className="container">
                    <h3 className="account-title text-white">Quên mật khẩu</h3>
                    <div className="account-box">
                        <div className="account-wrapper">
                            <form >
                                <div className="form-group">
                                    <label>Email</label>
                                    <input type="email" className="form-control" required="required"/>
                                </div>
                                <div className="form-group text-center custom-mt-form-group">
                                    <button className="btn btn-primary btn-block account-btn" type="submit">Đặt lại mật khẩu</button>
                                </div>
                                <div className="text-center">
                                    <Link to="/login">Về trang đăng nhập</Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ForgotPasswordPage;