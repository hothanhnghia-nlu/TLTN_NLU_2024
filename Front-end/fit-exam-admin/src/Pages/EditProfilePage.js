import React from "react";
import Header from "../Components/Header";
import {Link} from "react-router-dom";
import {TabTitle} from "../Utils/DynamicTitle";

const EditProfilePage = () => {
    TabTitle('Hồ sơ của tôi | FIT Exam Admin');

    return (
        <>
            <Header/>
            <div class="page-wrapper">
                <div class="content container-fluid">
                    <div class="page-header">
                        <div class="row">
                            <div class="col-lg-6 col-md-6 col-sm-6 col-12">
                                <h5 class="text-uppercase mb-0 mt-0 page-title">Chỉnh sửa hồ sơ</h5>
                            </div>
                            <div class="col-lg-6 col-md-6 col-sm-6 col-12">
                                <ul class="breadcrumb float-right p-0 mb-0">
                                    <li class="breadcrumb-item"><Link to="/"><i
                                        class="fas fa-home"></i> Trang chủ</Link></li>
                                    <li class="breadcrumb-item"><a href="#">Hồ sơ</a></li>
                                    <li class="breadcrumb-item"><span>Chỉnh sửa hồ sơ</span></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="page-content">
                        <div class="row">
                            <div class="col-lg-12 col-md-12 col-sm-12 col-12">
                                <div class="card">
                                    <div class="card-header">
                                        <div class="card-title">Thông tin cá nhân</div>
                                    </div>
                                    <div class="card-body">
                                        <div class="row">
                                            <div class="col-lg-6 col-md-6 col-sm-6 col-12">
                                                <form>
                                                    <div class="form-group">
                                                        <label>Họ tên</label>
                                                        <input type="text" class="form-control" placeholder="Họ và tên"/>
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Số điện thoại</label>
                                                        <input type="text" className="form-control" placeholder="Số điện thoại"/>
                                                    </div>
                                                    <div class="form-group">
                                                        <label>Ngày sinh</label>
                                                        <input class="form-control datetimepicker-input datetimepicker"
                                                               type="date" data-toggle="datetimepicker"/>
                                                    </div>
                                                </form>
                                            </div>
                                            <div class="col-lg-6 col-md-6 col-sm-6 col-12">
                                                <form>
                                                    <div className="form-group">
                                                        <label>Email</label>
                                                        <input type="email" className="form-control"
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

                                            <div class="col-lg-12 col-md-12 col-sm-12 col-12">
                                                <form>
                                                    <div class="form-group">
                                                        <label>Ảnh đại diện</label>
                                                        <input type="file" name="pic" accept="image/*"
                                                               class="form-control"/>
                                                    </div>
                                                </form>
                                            </div>
                                            <div class="col-lg-12 col-md-12 col-sm-12 col-12">
                                                <form>
                                                    <div class="form-group text-center custom-mt-form-group">
                                                        <button class="btn btn-primary mr-2" type="submit">Lưu</button>
                                                        <button class="btn btn-secondary" type="reset">Hủy</button>
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