import React from "react";
import {Link} from "react-router-dom";
import {TabTitle} from "../Utils/DynamicTitle";

const RegisterPage = () => {
    TabTitle('Đăng ký | FIT Exam Admin');

    return (
        <div class="main-wrapper">
            <div class="account-page">
                <div class="container">
                    <h3 class="account-title text-white">Đăng ký</h3>
                    <div class="account-box">
                        <div class="account-wrapper">
                            <form action="">
                                <div class="form-group">
                                    <label>Họ và tên</label>
                                    <input type="text" class="form-control"/>
                                </div>
                                <div class="form-group">
                                    <label>Email</label>
                                    <input type="email" class="form-control"/>
                                </div>
                                <div class="form-group">
                                    <label>Mật khẩu</label>
                                    <input type="password" class="form-control"/>
                                </div>
                                <div class="form-group">
                                    <label>Nhập lại mật khẩu</label>
                                    <input type="password" class="form-control"/>
                                </div>
                                <div class="form-group text-center custom-mt-form-group">
                                    <button class="btn btn-primary btn-block account-btn" type="submit">Đăng ký</button>
                                </div>
                                <div class="text-center">
                                    <Link to="/login">Đã có tài khoản?</Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;