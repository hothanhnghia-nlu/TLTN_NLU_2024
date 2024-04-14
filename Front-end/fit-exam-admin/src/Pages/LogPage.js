import React from "react";
import {TabTitle} from "../Utils/DynamicTitle";
import {Link} from "react-router-dom";
import Header from "../Components/Header";

const ExamList = () => {
    TabTitle('Nhật ký | FIT Exam Admin');

    return (
        <>
            <Header/>

            <div className="page-wrapper">
                <div className="content container-fluid">
                    <div className="page-header">
                        <div className="row">
                            <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                <h5 className="text-uppercase mb-0 mt-0 page-title">Quản lý nhật ký</h5>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                <ul className="breadcrumb float-right p-0 mb-0">
                                    <li className="breadcrumb-item"><Link to="/"><i
                                        className="fas fa-home"></i> Trang chủ</Link></li>
                                    <li className="breadcrumb-item"><span> Nhật ký</span></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="content-page">
                            <div className="row">
                                <div className="col-md-12 mb-3">
                                    <div className="table-responsive">
                                        <table className="table custom-table datatable">
                                            <thead className="thead-light">
                                            <tr>
                                                <th>#</th>
                                                <th>Mã tài khoản</th>
                                                <th>Cấp độ</th>
                                                <th>Thông tin</th>
                                                <th>Địa chỉ IP</th>
                                                <th>Nội dung</th>
                                                <th>Trạng thái</th>
                                                <th>Ngày tạo</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr>
                                                <td>1</td>
                                                <td>2</td>
                                                <td>INFO</td>
                                                <td>Login</td>
                                                <td>192.168.1.6</td>
                                                <td>Email: nva@gmail.com is login successful</td>
                                                <td>SUCCESS</td>
                                                <td>01/01/2024 10:00:00</td>
                                            </tr>
                                            <tr>
                                                <td>2</td>
                                                <td>2</td>
                                                <td>ALERT</td>
                                                <td>Login</td>
                                                <td>192.168.1.6</td>
                                                <td>Email: nva@gmail.com is login failed</td>
                                                <td>FAILED</td>
                                                <td>01/01/2024 10:00:00</td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ExamList;