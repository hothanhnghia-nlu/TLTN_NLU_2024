import React, {useEffect, useState} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import {fetchUserById} from "../service/UserService";

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const userId = localStorage.getItem("id");
    const [user, setUser] = useState([]);
    const [show, setShow] = useState(false);
    const [activeMenu, setActiveMenu] = useState(location.pathname);

    useEffect(() => {
        const getUserInfo = async (id) => {
            let res = await fetchUserById({ id });
            if (res) {
                setUser(res);
                setShow(res.role === 2);
            }
        };

        if (userId) {
            getUserInfo(userId);
        }
    }, [userId]);

    const handleLogout = () => {
        localStorage.removeItem("id");
        navigate("/login");
    };

    useEffect(() => {
        setActiveMenu(location.pathname);
    }, [location.pathname]);

    return (
        <div className="main-wrapper">
            <div className="header-outer">
                <div className="header">
                    <Link id="mobile_btn" className="mobile_btn float-left" to="#sidebar">
                        <i className="fas fa-bars" aria-hidden="true"></i>
                    </Link>
                    <Link id="toggle_btn" className="float-left" to="javascript:void(0);">
                        <img src="assets/img/sidebar/icon-21.png" alt="" />
                    </Link>

                    <ul className="nav float-left">
                        <li>
                            <Link to="/" className="mobile-logo d-md-block d-lg-none d-block">
                                <img src="assets/img/logo_fit.png" alt="" width="30" height="30" />
                            </Link>
                        </li>
                    </ul>

                    <ul className="nav user-menu float-right">
                        <li className="nav-item dropdown has-arrow">
                            <Link to="#" className="nav-link user-link" data-toggle="dropdown">
                                <span className="user-img">
                                    {user.image ? (
                                        <img className="rounded-circle" src={user.image.url} alt={user.name} width="30" />
                                    ) : (
                                        <img className="rounded-circle" src="assets/img/user.jpg" alt={user.name} width="30" />
                                    )}
                                    <span className="status online"></span>
                                </span>
                                <span className="user-name"> {user.name}</span>
                            </Link>
                            <div className="dropdown-menu">
                                <Link to="/my-profile" className="dropdown-item">Hồ sơ cá nhân</Link>
                                <Link to="/edit-profile" className="dropdown-item">Chỉnh sửa hồ sơ</Link>
                                <Link to="/change-password" className="dropdown-item">Đổi mật khẩu</Link>
                                <h5 className="dropdown-item" style={{ cursor: "pointer" }} onClick={handleLogout}>Đăng xuất</h5>
                            </div>
                        </li>
                    </ul>
                    <div className="dropdown mobile-user-menu float-right">
                        <Link to="#" className="nav-link dropdown-toggle" data-toggle="dropdown" aria-expanded="false"><i className="fas fa-ellipsis-v"></i></Link>
                        <div className="dropdown-menu dropdown-menu-right">
                            <Link to="/my-profile" className="dropdown-item">Hồ sơ cá nhân</Link>
                            <Link to="/edit-profile" className="dropdown-item">Chỉnh sửa hồ sơ</Link>
                            <Link to="/change-password" className="dropdown-item">Đổi mật khẩu</Link>
                            <h5 className="dropdown-item" style={{ cursor: "pointer" }} onClick={handleLogout}>Đăng xuất</h5>
                        </div>
                    </div>

                    <div className="sidebar" id="sidebar">
                        <div className="sidebar-inner slimscroll">
                            <div id="sidebar-menu" className="sidebar-menu">
                                <div className="header-left">
                                    <Link to="/" className="logo">
                                        <img src="assets/img/logo_fit.png" width="40" height="40" alt="" />
                                        <span className="text-uppercase">FIT Exam</span>
                                    </Link>
                                </div>
                                <ul className="sidebar-ul">
                                    <li className={`submenu ${activeMenu === '/' ? 'active' : ''}`}>
                                        <Link to="/"><img src="assets/img/sidebar/icon-1.png" alt="icon" /><span>Thống kê</span></Link>
                                    </li>
                                    <li className={`submenu ${activeMenu === '/students' ? 'active' : ''}`}>
                                        <Link to="/students"><img src="assets/img/sidebar/icon-3.png" alt="icon" /><span>Sinh viên</span></Link>
                                    </li>
                                    <li className={`submenu ${activeMenu === '/exams' ? 'active' : ''}`}>
                                        <Link to="/exams"><img src="assets/img/sidebar/icon-7.png" alt="icon" /><span>Bài thi</span></Link>
                                    </li>
                                    <li className={`submenu ${activeMenu === '/question-bank' ? 'active' : ''}`}>
                                        <Link to="/question-bank"><img src="assets/img/sidebar/icon-7.png" alt="icon" /><span>Ngân hàng câu hỏi</span></Link>
                                    </li>
                                    <li className={`submenu ${activeMenu === '/exam-result' ? 'active' : ''}`}>
                                        <Link to="/exam-result"><img src="assets/img/sidebar/icon-12.png" alt="icon" /><span>Kết quả thi</span></Link>
                                    </li>
                                    {show && (
                                        <>
                                            <li className={`submenu ${activeMenu === '/teachers' ? 'active' : ''}`}>
                                                <Link to="/teachers"><img src="assets/img/sidebar/icon-2.png" alt="icon" /><span>Giảng viên</span></Link>
                                            </li>
                                            <li className={`submenu ${activeMenu === '/faculties' ? 'active' : ''}`}>
                                                <Link to="/faculties"><img src="assets/img/sidebar/icon-18.png" alt="icon" /><span>Khoa</span></Link>
                                            </li>
                                            <li className={`submenu ${activeMenu === '/subjects' ? 'active' : ''}`}>
                                                <Link to="/subjects"><img src="assets/img/sidebar/icon-4.png" alt="icon" /><span>Môn học</span></Link>
                                            </li>
                                            <li className={`submenu ${activeMenu === '/logs' ? 'active' : ''}`}>
                                                <Link to="/logs"><img src="assets/img/sidebar/icon-12.png" alt="icon" /><span>Nhật ký</span></Link>
                                            </li>
                                        </>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;