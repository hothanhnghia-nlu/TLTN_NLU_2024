import React, {useEffect, useState} from "react";
import Header from "../components/Header";
import {Link} from "react-router-dom";
import {TabTitle} from "../commons/DynamicTitle";
import {fetchUserById} from "../service/UserService";
import moment from "moment";

const ProfilePage = () => {
    TabTitle('Hồ sơ của tôi | FIT Exam Admin');

    const userId = localStorage.getItem("id");
    const [user, setUser] = useState([]);

    useEffect(() => {
        getUserInfo(userId);
    }, [userId]);

    const getUserInfo = async (id) => {
        let res = await fetchUserById({id});
        if (res) {
            setUser(res);
        }
    }

    const convertDate = ({date}) => {
        const dateMoment = moment(date);
        return dateMoment.format('DD/MM/YYYY');
    }

    const getRole = ({role}) => {
        if (role === 0) {
            return 'Sinh viên';
        } else if (role === 1 ){
            return 'Giảng viên';
        } else {
            return 'Quản trị viên';
        }
    }

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
                                            <Link href=""><img className="avatar" src="assets/img/user.jpg" alt=""/></Link>
                                        </div>
                                    </div>
                                    <div className="profile-basic">
                                        <div className="row">
                                            <div className="col-md-5">
                                                <div className="profile-info-left">
                                                    <h2 className="user-name">{user.name}</h2>
                                                    <h4 className="company-role">Chức vụ:
                                                        <span style={{marginLeft: "10px", color: "blue"}}>{getRole({role: user.role})}</span>
                                                    </h4>
                                                </div>
                                            </div>
                                            <div className="col-md-7">
                                                <ul className="personal-info">
                                                    <li>
                                                        <span className="title">Số điện thoại:</span>
                                                        <span className="text"><Link to="">{user.phone}</Link></span>
                                                    </li>
                                                    <li>
                                                        <span className="title">Email:</span>
                                                        <span className="text"><Link to=""><span className="__cf_email__"
                                                                                                data-cfemail="422827242427303b2f352d2c2502273a232f322e276c212d2f">{user.email}</span></Link></span>
                                                    </li>
                                                    <li>
                                                        <span className="title">Ngày sinh:</span>
                                                        <span className="text">{convertDate({date: user.dob})}</span>
                                                    </li>

                                                    <li>
                                                        <span className="title">Giới tinh:</span>
                                                        <span className="text">{user.gender}</span>
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