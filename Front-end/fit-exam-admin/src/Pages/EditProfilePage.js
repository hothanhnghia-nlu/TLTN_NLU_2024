import React from "react";
import Header from "../Components/Header";
import {Link} from "react-router-dom";
import {TabTitle} from "../Utils/DynamicTitle";

const EditProfilePage = () => {
    TabTitle('Hồ sơ của tôi | FIT Exam Admin');

    return (
        <>
            <Header/>
            <div className="page-wrapper">
                <div className="content container-fluid">
                    <div className="page-header">
                        <div className="row">
                            <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                <h5 className="text-uppercase mb-0 mt-0 page-title">Chỉnh sửa hồ sơ</h5>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                <ul className="breadcrumb float-right p-0 mb-0">
                                    <li className="breadcrumb-item"><Link to="/"><i
                                        className="fas fa-home"></i> Trang chủ</Link></li>
                                    <li className="breadcrumb-item"><Link to="#">Hồ sơ</Link></li>
                                    <li className="breadcrumb-item"><span>Chỉnh sửa hồ sơ</span></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="page-content">
                        <div className="row">
                            <div className="col-lg-12 col-md-12 col-sm-12 col-12">
                                <div className="card">
                                    <div className="card-header">
                                        <div className="card-title">Thông tin cá nhân</div>
                                    </div>
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                                <form>
                                                    <div className="form-group">
                                                        <label>Họ tên</label>
                                                        <input type="text" className="form-control" required="required" placeholder="Họ và tên"/>
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Số điện thoại</label>
                                                        <input type="text" className="form-control" required="required" placeholder="Số điện thoại"/>
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Ngày sinh</label>
                                                        <input className="form-control datetimepicker-input datetimepicker"
                                                               type="date" data-toggle="datetimepicker"/>
                                                    </div>
                                                </form>
                                            </div>
                                            <div class="col-lg-6 col-md-6 col-sm-6 col-12">
                                                <form>
                                                    <div className="form-group">
                                                        <label>Email</label>
                                                        <input type="email" className="form-control" required="required"
                                                               placeholder="Địa chỉ email"/>
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Giới tính</label>
                                                        <select className="form-control select">
                                                            <option value="Nam">Nam</option>
                                                            <option value="Nữ">Nữ</option>
                                                            <option value="Khác">Khác</option>
                                                        </select>
                                                    </div>
                                                </form>
                                            </div>

                                            <div className="col-lg-12 col-md-12 col-sm-12 col-12">
                                                <form>
                                                    <div className="form-group">
                                                        <label>Ảnh đại diện</label>
                                                        <input type="file" name="pic" accept="image/*"
                                                               className="form-control" required="required"/>
                                                    </div>
                                                </form>
                                            </div>
                                            <div class="col-lg-12 col-md-12 col-sm-12 col-12">
                                                <form>
                                                    <div className="form-group text-center custom-mt-form-group">
                                                        <button className="btn btn-primary mr-2" type="submit">Lưu</button>
                                                        <button className="btn btn-secondary" type="reset">Hủy</button>
                                                    </div>
                                                </form>
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

export default EditProfilePage;