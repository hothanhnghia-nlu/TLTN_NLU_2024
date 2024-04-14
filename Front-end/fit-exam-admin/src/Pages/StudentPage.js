import React from "react";
import {TabTitle} from "../Utils/DynamicTitle";
import {Link} from "react-router-dom";
import Header from "../Components/Header";

const AccountPage = () => {
    TabTitle('Sinh viên | FIT Exam Admin');

    return (
        <>
            <Header/>

            <div className="page-wrapper">
                <div className="content container-fluid">
                    <div className="page-header">
                        <div className="row">
                            <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                <h5 className="text-uppercase mb-0 mt-0 page-title">Sinh viên</h5>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                <ul className="breadcrumb float-right p-0 mb-0">
                                    <li className="breadcrumb-item"><Link to="/"><i
                                        className="fas fa-home"></i> Trang chủ</Link></li>
                                    <li className="breadcrumb-item"><span> Sinh viên</span></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="content-page">
                        <div className="row">
                            <div className="col-sm-8 col-5">
                            </div>
                            <div className="col-sm-4 col-7 text-right add-btn-col">
                                <Link to="#" className="btn btn-primary btn-rounded float-right" data-toggle="modal"
                                      data-target="#add_user"><i className="fas fa-plus"></i> Thêm sinh viên</Link>
                            </div>
                        </div>
                        <div className="row filter-row">
                            <div className="col-sm-6 col-md-3 col-lg-3 col-xl-2 col-12"/>
                            <div className="col-sm-6 col-md-3 col-lg-3 col-xl-2 col-12"/>
                            <div className="col-sm-6 col-md-3 col-lg-3 col-xl-2 col-12">
                                <div className="form-group form-focus">
                                    <input type="number" className="form-control floating"/>
                                    <label className="focus-label">MSSV</label>
                                </div>
                            </div>
                            <div className="col-sm-6 col-md-3 col-lg-3 col-xl-2 col-12">
                                <div className="form-group form-focus">
                                    <input type="text" className="form-control floating"/>
                                    <label className="focus-label">Họ tên</label>
                                </div>
                            </div>
                            <div className="col-sm-6 col-md-3 col-lg-3 col-xl-2 col-12">
                                <div className="form-group form-focus">
                                    <input type="text" className="form-control floating"/>
                                    <label className="focus-label">Số điện thoại</label>
                                </div>
                            </div>
                            <div className="col-sm-6 col-md-3 col-lg-3 col-xl-2 col-12">
                                <Link to="#" className="btn btn-search rounded btn-block mb-3"> search </Link>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12 mb-3">
                                <div className="table-responsive">
                                    <table className="table custom-table mb-0 datatable">
                                        <thead className="thead-light">
                                        <tr>
                                            <th>#</th>
                                            <th>Họ tên</th>
                                            <th>Ảnh đại diện</th>
                                            <th>Email</th>
                                            <th>Số điện thoại</th>
                                            <th>Ngày sinh</th>
                                            <th>Giới tính</th>
                                            <th className="text-center">Trạng thái</th>
                                            <th className="text-right">Tính năng</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr>
                                            <td>1</td>
                                            <td>Nguyễn Văn A</td>
                                            <td>Avatar</td>
                                            <td>nva@gmail.com</td>
                                            <td>0987654321</td>
                                            <td>01/01/2002</td>
                                            <td>Nam</td>
                                            <td className="text-center">Active</td>
                                            <td className="text-right">
                                                <div className="dropdown dropdown-action">
                                                    <Link to="#" className="action-icon dropdown-toggle"
                                                          data-toggle="dropdown" aria-expanded="false"><i
                                                        className="fas fa-ellipsis-v"></i></Link>
                                                    <div className="dropdown-menu dropdown-menu-right">
                                                        <Link className="dropdown-item" to="#" title="Edit"
                                                              data-toggle="modal" data-target="#edit_user"><i
                                                            className="fas fa-pencil-alt m-r-5"></i> Chỉnh sửa</Link>
                                                        <Link className="dropdown-item" to="#" title="Delete"
                                                              data-toggle="modal" data-target="#delete_user"><i
                                                            className="fas fa-trash-alt m-r-5"></i> Xóa</Link>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td>2</td>
                                            <td>Lê Thị Thu B</td>
                                            <td>Avatar</td>
                                            <td>lethub@gmail.com</td>
                                            <td>0123456789</td>
                                            <td>18/11/2003</td>
                                            <td>Nữ</td>
                                            <td className="text-center">Active</td>
                                            <td className="text-right">
                                                <div className="dropdown dropdown-action">
                                                    <Link to="#" className="action-icon dropdown-toggle"
                                                          data-toggle="dropdown" aria-expanded="false"><i
                                                        className="fas fa-ellipsis-v"></i></Link>
                                                    <div className="dropdown-menu dropdown-menu-right">
                                                        <Link className="dropdown-item" to="#" title="Edit"
                                                              data-toggle="modal" data-target="#edit_user"><i
                                                            className="fas fa-pencil-alt m-r-5"></i> Chỉnh sửa</Link>
                                                        <Link className="dropdown-item" to="#" title="Delete"
                                                              data-toggle="modal" data-target="#delete_user"><i
                                                            className="fas fa-trash-alt m-r-5"></i> Xóa</Link>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="add_user" className="modal" role="dialog">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content modal-lg">
                        <div className="modal-header">
                            <h4 className="modal-title">Thêm tài khoản</h4>
                            <button type="button" className="close" data-dismiss="modal">&times;</button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>Họ và tên</label>
                                            <input type="text" className="form-control" required="required"/>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>Email</label>
                                            <input type="email" className="form-control" required="required"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>Số điện thoại</label>
                                            <input type="text" className="form-control" required="required"/>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>Ngày sinh</label>
                                            <input type="date" className="form-control" required="required"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>Giới tính</label>
                                            <select className="form-control select">
                                                <option>Nam</option>
                                                <option>Nữ</option>
                                                <option>Khác</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>Vai trò</label>
                                            <select className="form-control select">
                                                <option>Admin</option>
                                                <option>Sinh viên</option>
                                                <option>Giáo viên</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12">
                                        <div className="form-group">
                                            <label>Ảnh đại diện</label>
                                            <input type="file" className="form-control" required="required"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="m-t-20 text-center">
                                    <button className="btn btn-primary btn-lg mb-3">Tạo tài khoản</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <div id="edit_user" className="modal" role="dialog">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content modal-lg">
                        <div className="modal-header">
                            <h4 className="modal-title">Chỉnh sửa tài khoản</h4>
                            <button type="button" className="close" data-dismiss="modal">&times;</button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>Họ và tên</label>
                                            <input type="text" className="form-control" required="required" value="Nguyễn Văn A"/>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>Email</label>
                                            <input type="email" className="form-control" required="required" value="nva@gmail.com"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>Số điện thoại</label>
                                            <input type="text" className="form-control" required="required" value="0987654321"/>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>Ngày sinh</label>
                                            <input type="date" className="form-control" required="required"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>Giới tính</label>
                                            <select className="form-control select">
                                                <option>Nam</option>
                                                <option>Nữ</option>
                                                <option>Khác</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>Vai trò</label>
                                            <select className="form-control select">
                                                <option>Admin</option>
                                                <option>Sinh viên</option>
                                                <option>Giáo viên</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>Trạng thái</label>
                                            <select className="form-control select">
                                                <option>Pending</option>
                                                <option>Approved</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>Ảnh đại diện</label>
                                            <input type="file" className="form-control" required="required"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="m-t-20 text-center">
                                    <button className="btn btn-primary btn-lg mb-3">Lưu thay đổi</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <div id="delete_user" className="modal" role="dialog">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content modal-md">
                        <div className="modal-header">
                            <h4 className="modal-title">Xóa Tài khoản</h4>
                        </div>
                        <div className="modal-body">
                            <p>Bạn có chắc muốn xóa tài khoản này?</p>
                            <div className="m-t-20 text-left">
                                <Link to="#" className="btn btn-white" data-dismiss="modal">Hủy</Link>
                                <button type="submit" className="btn btn-danger" style={{marginLeft: '10px'}}>Xóa</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AccountPage;