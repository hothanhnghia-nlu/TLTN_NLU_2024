import React from "react";
import {TabTitle} from "../commons/DynamicTitle";
import {Link} from "react-router-dom";
import Header from "../components/Header";
import ReactPaginate from "react-paginate";

const ExamList = () => {
    TabTitle('Ngân hàng câu hỏi | FIT Exam Admin');

    return (
        <>
            <Header/>

            <div className="page-wrapper">
                <div className="content container-fluid">
                    <div className="page-header">
                        <div className="row">
                            <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                <h5 className="text-uppercase mb-0 mt-0 page-title">Ngân hàng câu hỏi</h5>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                <ul className="breadcrumb float-right p-0 mb-0">
                                    <li className="breadcrumb-item"><Link to="/"><i
                                        className="fas fa-home"></i> Trang chủ</Link></li>
                                    <li className="breadcrumb-item"><span> Câu hỏi</span></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="card flex-fill">
                            <div className="card-header">
                                <div className="row filter-row">
                                    <div className="col-md-6">
                                        <div className="form-focus">
                                            {/*<input type="text" className="form-control floating"*/}
                                            {/*       onChange={(e) => setQuery(e.target.value)}/>*/}
                                            <input type="text" className="form-control floating"/>
                                            <label className="focus-label">Câu hỏi</label>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="text-right add-btn-col">
                                            <Link to="#" className="btn btn-primary float-right btn-rounded"
                                                  data-toggle="modal" data-target="#add_question"
                                                  style={{borderRadius: "50px", textTransform: "none"}}>
                                                <i className="fas fa-plus"></i> Thêm câu hỏi</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="table-responsive">
                                            <table className="table custom-table datatable">
                                                <thead className="thead-light">
                                                <tr>
                                                    <th>#</th>
                                                    <th>Câu hỏi</th>
                                                    <th>Độ khó</th>
                                                    <th>Ngày tạo</th>
                                                    <th className="text-right">Tính năng</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                <tr>
                                                    <td>1</td>
                                                    <td>Định nghĩa ngôn ngữ lập trình Java?</td>
                                                    <td>Dễ</td>
                                                    <td>01/01/2024 10:00:00</td>
                                                    <td className="text-right">
                                                        <button type="submit" data-toggle="modal" data-target="#edit_question"
                                                                className="btn btn-primary btn-sm mb-1">
                                                            <i className="far fa-edit" title="Sửa"></i>
                                                        </button>
                                                        <button type="submit" data-toggle="modal" data-target="#delete_question"
                                                                className="btn btn-danger btn-sm mb-1" style={{marginLeft: '5px'}}>
                                                            <i className="far fa-trash-alt" title="Xóa"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                                </tbody>
                                            </table>

                                            {/*<ReactPaginate*/}
                                            {/*    nextLabel="sau >"*/}
                                            {/*    onPageChange={handlePageClick}*/}
                                            {/*    pageRangeDisplayed={3}*/}
                                            {/*    marginPagesDisplayed={2}*/}
                                            {/*    pageCount={pageCount}*/}
                                            {/*    previousLabel="< trước"*/}
                                            {/*    pageClassName="page-item"*/}
                                            {/*    pageLinkClassName="page-link"*/}
                                            {/*    previousClassName="page-item"*/}
                                            {/*    previousLinkClassName="page-link"*/}
                                            {/*    nextClassName="page-item"*/}
                                            {/*    nextLinkClassName="page-link"*/}
                                            {/*    breakLabel="..."*/}
                                            {/*    breakClassName="page-item"*/}
                                            {/*    breakLinkClassName="page-link"*/}
                                            {/*    containerClassName="pagination"*/}
                                            {/*    activeClassName="active"*/}
                                            {/*/>*/}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div id="add_question" className="modal" role="dialog">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content modal-lg">
                        <div className="modal-header">
                            <h4 className="modal-title">Thêm câu hỏi</h4>
                            <button type="button" className="close" data-dismiss="modal">&times;</button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="row">
                                    <div className="col-sm-12">
                                        <div className="form-group">
                                            <label>Câu hỏi</label>
                                            <input type="text" className="form-control" required="required"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>Lựa chọn A</label>
                                            <input type="text" className="form-control" required="required"/>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>Lựa chọn B</label>
                                            <input type="text" className="form-control" required="required"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>Lựa chọn C</label>
                                            <input type="text" className="form-control" required="required"/>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>Lựa chọn D</label>
                                            <input type="text" className="form-control" required="required"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>Đáp án</label>
                                            <input type="text" className="form-control" required="required"/>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>Thời gian</label>
                                            <input type="number" className="form-control" required="required"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="m-t-20 text-center">
                                    <button className="btn btn-primary btn-lg">Tạo câu hỏi</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <div id="edit_question" className="modal" role="dialog">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content modal-lg">
                        <div className="modal-header">
                            <h4 className="modal-title">Chỉnh sửa câu hỏi</h4>
                            <button type="button" className="close" data-dismiss="modal">&times;</button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="row">
                                    <div className="col-sm-12">
                                        <div className="form-group">
                                            <label>Câu hỏi</label>
                                            <input type="text" className="form-control" required="required" value="Định nghĩa ngôn ngữ lâp trình Java?"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>Lựa chọn A</label>
                                            <input type="text" className="form-control" required="required" value="Ngôn ngữ bậc thấp"/>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>Lựa chọn B</label>
                                            <input type="text" className="form-control" required="required" value="Ngôn ngữ bậc cao"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>Lựa chọn C</label>
                                            <input type="text" className="form-control" required="required" value="Ngôn ngữ tự nhiên"/>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>Lựa chọn D</label>
                                            <input type="text" className="form-control" required="required" value="Ngôn ngữ máy"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>Đáp án</label>
                                            <input type="text" className="form-control" required="required" value="Ngôn ngữ bậc cao"/>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>Thời gian thi</label>
                                            <input type="number" className="form-control" required="required" value="75"/>
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

            <div id="delete_question" className="modal" role="dialog">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content modal-md">
                        <div className="modal-header">
                            <h4 className="modal-title">Xóa câu hỏi</h4>
                        </div>
                        <form>
                            <div className="modal-body">
                                <p>Bạn có chắc muốn xóa câu hỏi này?</p>
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

export default ExamList;