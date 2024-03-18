import React from "react";
import Header from "../Components/Header";
import {Link} from "react-router-dom";
import {TabTitle} from "../Utils/DynamicTitle";

const ProfilePage = () => {
    TabTitle('Hồ sơ của tôi | FIT Exam Admin');

    return (
        <>
            <Header/>
            <div className="page-wrapper">
                <div className="content container-fluid">
                    <div className="page-header">
                        <div className="row">
                            <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                <h5 className="text-uppercase mb-0 mt-0 page-title">Hồ sơ của tôi</h5>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                <ul className="breadcrumb float-right p-0 mb-0">
                                    <li className="breadcrumb-item"><Link to="/"><i
                                        className="fas fa-home"></i> Trang chủ</Link></li>
                                    <li className="breadcrumb-item"><span> Hồ sơ</span></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="card-box m-b-0">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="profile-view">
                                    <div className="profile-img-wrap">
                                        <div className="profile-img">
                                            <a href=""><img className="avatar" src="assets/img/user.jpg" alt=""/></a>
                                        </div>
                                    </div>
                                    <div className="profile-basic">
                                        <div className="row">
                                            <div className="col-md-5">
                                                <div className="profile-info-left">
                                                    <h3 className="user-name m-t-0">Jeffrey M. Wong</h3>
                                                    <h5 className="company-role m-t-0 m-b-0">Preschool</h5>
                                                    <small className="text-muted">H.O.D</small>
                                                    <div className="staff-id">Employee ID : HOD-0001</div>
                                                </div>
                                            </div>
                                            <div className="col-md-7">
                                                <ul className="personal-info">
                                                    <li>
                                                        <span className="title">Số điện thoại:</span>
                                                        <span className="text"><a href="">973-584-58700</a></span>
                                                    </li>
                                                    <li>
                                                        <span className="title">Email:</span>
                                                        <span className="text"><a href=""><span className="__cf_email__"
                                                                                                data-cfemail="422827242427303b2f352d2c2502273a232f322e276c212d2f">[email&#160;protected]</span></a></span>
                                                    </li>
                                                    <li>
                                                        <span className="title">Ngày sinh:</span>
                                                        <span className="text">2nd August</span>
                                                    </li>

                                                    <li>
                                                        <span className="title">Giới tinh:</span>
                                                        <span className="text">Male</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ProfilePage;