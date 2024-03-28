import React from "react";
import {Link} from "react-router-dom";

const Header = () => {
    return (
        <div className="main-wrapper">
            <div className="header-outer">
                <div className="header">
                    <a id="mobile_btn" className="mobile_btn float-left" href="#sidebar"><i className="fas fa-bars"
                                                                                            aria-hidden="true"></i></a>
                    <a id="toggle_btn" className="float-left" href="javascript:void(0);">
                        <img src="assets/img/sidebar/icon-21.png" alt=""/>
                    </a>

                    <ul className="nav float-left">
                        <li>
                            <div className="top-nav-search">
                                <a href="javascript:void(0);" className="responsive-search">
                                    <i className="fa fa-search"></i>
                                </a>
                                <form action="search.html">
                                    <input className="form-control" type="text" placeholder="Search here"/>
                                    <button className="btn" type="submit"><i className="fa fa-search"></i></button>
                                </form>
                            </div>
                        </li>
                        <li>
                            <Link to="/" className="mobile-logo d-md-block d-lg-none d-block">
                                <img src="assets/img/logo1.png" alt="" width="30" height="30"/></Link>
                        </li>
                    </ul>

                    <ul className="nav user-menu float-right">
                        <li className="nav-item dropdown has-arrow">
                            <a href="#" className=" nav-link user-link" data-toggle="dropdown">
                                <span className="user-img">
                                    <img className="rounded-circle" src="assets/img/user-06.jpg" width="30" alt="Admin"/>
                                    <span className="status online"></span>
                                </span>
                                <span className="user-name">Admin</span>
                            </a>
                            <div className="dropdown-menu">
                                <Link to="/my-profile" className="dropdown-item">Hồ sơ cá nhân</Link>
                                <Link to="/edit-profile" className="dropdown-item">Chỉnh sửa hồ sơ</Link>
                                <Link to="/login" class="dropdown-item">Đăng xuất</Link>
                            </div>
                        </li>
                    </ul>
                    <div className="dropdown mobile-user-menu float-right">
                        <a href="#" className="nav-link dropdown-toggle" data-toggle="dropdown" aria-expanded="false"><i className="fas fa-ellipsis-v"></i></a>
                        <div className="dropdown-menu dropdown-menu-right">
                            <Link to="/my-profile" className="dropdown-item">Hồ sơ cá nhân</Link>
                            <Link to="/edit-profile" className="dropdown-item">Chỉnh sửa hồ sơ</Link>
                            <Link to="/login" class="dropdown-item">Đăng xuất</Link>
                        </div>
                    </div>

                    <div className="sidebar" id="sidebar">
                        <div className="sidebar-inner slimscroll">
                            <div id="sidebar-menu" className="sidebar-menu">
                                <div className="header-left">
                                    <Link to="/" className="logo">
                                        <img src="assets/img/logo_fit.png" width="40" height="40" alt=""/>
                                            <span className="text-uppercase">FIT NLU</span>
                                    </Link>
                                </div>
                                <ul className="sidebar-ul">
                                    <li className="active">
                                        <Link to="/"><img src="assets/img/sidebar/icon-1.png" alt="icon"/><span>Thống kê</span></Link>
                                    </li>
                                    <li className="submenu">
                                        <a href="#"><img src="assets/img/sidebar/icon-2.png" alt="icon"/> <span> Giáo viên</span> </a>
                                    </li>
                                    <li className="submenu">
                                        <a href="#"><img src="assets/img/sidebar/icon-3.png" alt="icon"/> <span> Sinh viên</span> </a>
                                    </li>
                                    <li className="submenu">
                                        <a href="#"><img src="assets/img/sidebar/icon-4.png" alt="icon"/> <span> Môn học</span> </a>
                                    </li>
                                    <li className="submenu">
                                        <a href="javascript:void(0);"><img src="assets/img/sidebar/icon-7.png" alt="icon"/> <span>Bài thi</span> </a>
                                    </li>
                                    <li>
                                        <a href="calendar.html"><img src="assets/img/sidebar/icon-6.png" alt="icon"/> <span>Calendar</span></a>
                                    </li>
                                    <li>
                                        <a href="exam-list.html"><img src="assets/img/sidebar/icon-5.png" alt="icon"/> <span>Exam list</span></a>
                                    </li>
                                    <li>
                                        <a href="holidays.html"><img src="assets/img/sidebar/icon-8.png" alt="icon"/> <span>Holidays</span></a>
                                    </li>
                                    <li>
                                        <a href="calendar.html"><img src="assets/img/sidebar/icon-9.png" alt="icon"/><span> Events</span></a>
                                    </li>
                                    <li className="submenu">
                                        <a href="#"><img src="assets/img/sidebar/icon-10.png" alt="icon"/><span> Accounts </span> </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Header;