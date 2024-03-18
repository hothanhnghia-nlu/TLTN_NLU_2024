import React from "react";
import {Link} from "react-router-dom";
import {TabTitle} from "../Utils/DynamicTitle";

const ForgotPasswordPage = () => {
    TabTitle('Quên mật khẩu | FIT Exam Admin');

    return (
        <div class="main-wrapper">
            <div class="account-page">
                <div class="container">
                    <h3 class="account-title text-white">Quên mật khẩu</h3>
                    <div class="account-box">
                        <div class="account-wrapper">
                            <form >
                                <div class="form-group">
                                    <label>Email</label>
                                    <input type="email" class="form-control"/>
                                </div>
                                <div class="form-group text-center custom-mt-form-group">
                                    <button class="btn btn-primary btn-block account-btn" type="submit">Đặt lại mật khẩu</button>
                                </div>
                                <div class="text-center">
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