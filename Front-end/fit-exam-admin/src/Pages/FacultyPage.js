import React from "react";
import {TabTitle} from "../Utils/DynamicTitle";
import {Link} from "react-router-dom";
import Header from "../Components/Header";

const FacultyPage = () => {
    TabTitle('Quản lý khoa | FIT Exam Admin');

    return (
        <>
            <Header/>

            <div className="page-wrapper">
                <div className="content container-fluid">
                    <div className="page-header">
                        <div className="row">
                            <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                <h5 className="text-uppercase mb-0 mt-0 page-title">Khoa</h5>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                <ul className="breadcrumb float-right p-0 mb-0">
                                    <li className="breadcrumb-item"><Link to="/"><i
                                        className="fas fa-home"></i> Trang chủ</Link></li>
                                    <li className="breadcrumb-item"><span> Khoa</span></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="row">
                            <div className="col-sm-4 col-12">
                            </div>
                            <div className="col-sm-8 col-12 text-right add-btn-col">
                                <Link to="#" className="btn btn-primary float-right btn-rounded"
                                      data-toggle="modal" data-target="#add_subject">
                                    <i className="fas fa-plus"></i> Thêm khoa</Link>
                            </div>
                        </div>
                        <div className="content-page">
                            <div className="row filter-row">
                                <div className="col-sm-6 col-md-3"/>
                                <div className="col-sm-6 col-md-3">
                                    <div className="form-group form-focus">
                                        <input type="number" className="form-control floating"/>
                                        <label className="focus-label">Mã khoa</label>
                                    </div>
                                </div>
                                <div className="col-sm-6 col-md-3">
                                    <div className="form-group form-focus">
                                        <input type="text" className="form-control floating"/>
                                        <label className="focus-label">Tên khoa</label>
                                    </div>
                                </div>
                                <div className="col-sm-6 col-md-3">
                                    <Link to="#" className="btn btn-search rounded btn-block mb-3"> Tìm kiếm </Link>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12 mb-3">
                                    <div className="table-responsive">
                                        <table className="table custom-table datatable">
                                            <thead className="thead-light">
                                            <tr>
                                                <th>Mã khoa</th>
                                                <th>Tên khoa</th>
                                                <th className="text-right">Tính năng</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr>
                                                <td>145</td>
                                                <td>
                                                    <h2>Công nghệ thông tin</h2>
                                                </td>
                                                <td className="text-right">
                                                    <button type="submit" data-toggle="modal" data-target="#edit_subject"
                                                            className="btn btn-primary btn-sm mb-1">
                                                        <i className="far fa-edit" title="Sửa"></i>
                                                    </button>
                                                    <button type="submit" data-toggle="modal" data-target="#delete_subject"
                                                            className="btn btn-danger btn-sm mb-1" style={{marginLeft: '5px'}}>
                                                        <i className="far fa-trash-alt" title="Xóa"></i>
                                                    </button>
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
            </div>


            <div id="add_subject" className="modal" role="dialog">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content modal-lg">
                        <div className="modal-header">
                            <h4 className="modal-title">Thêm khoa</h4>
                            <button type="button" className="close" data-dismiss="modal">&times;</button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>Mã khoa</label>
                                            <input type="number" className="form-control" required="required"/>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>Tên khoa</label>
                                            <input type="text" className="form-control" required="required"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="m-t-20 text-center">
                                    <button className="btn btn-primary btn-lg">Tạo khoa</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <div id="edit_subject" className="modal" role="dialog">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content modal-lg">
                        <div className="modal-header">
                            <h4 className="modal-title">Chỉnh sửa khoa</h4>
                            <button type="button" className="close" data-dismiss="modal">&times;</button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>Mã khoa</label>
                                            <input type="number" className="form-control" required="required" value="145"/>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>Tên khoa</label>
                                            <input type="text" className="form-control" required="required" value="Công nghệ thông tin"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="m-t-20 text-center">
                                    <button className="btn btn-primary btn-lg">Lưu thay đổi</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <div id="delete_subject" className="modal" role="dialog">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content modal-md">
                        <div className="modal-header">
                            <h4 className="modal-title">Xóa khoa</h4>
                        </div>
                        <form>
                            <div className="modal-body">
                                <p>Bạn có chắc muốn xóa khoa này?</p>
                                <div className="m-t-20"><Link to="#" className="btn btn-white"
                                                              data-dismiss="modal">Hủy</Link>
                                    <button type="submit" className="btn btn-danger" style={{marginLeft: '10px'}}>Xóa</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default FacultyPage;