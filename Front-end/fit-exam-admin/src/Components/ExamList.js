import React, {useEffect, useState} from "react";
import {TabTitle} from "../Utils/DynamicTitle";
import {Link} from "react-router-dom";
import Header from "../Components/Header";
import {fetchAllExam} from "../Service/ExamService";
import ReactPaginate from "react-paginate";

const ExamList = () => {
    TabTitle('Bài thi | FIT Exam Admin');

    const [listExams, setListExams] = useState([]);
    const [totalExams, setTotalExams] = useState(0);
    const [query, setQuery] = useState("");
    const keys = ["name"];

    useEffect(() => {
        getExams();
    }, [])

    const getExams = async () => {
        let res = await fetchAllExam();
        if (res) {
            setListExams(res);
            setTotalExams(res.length);
        }
    }

    const [currentItems, setCurrentItems] = useState(null);
    const [pageCount, setPageCount] = useState(0);
    const [itemOffset, setItemOffset] = useState(0);
    const itemsPerPage = 5;

    useEffect(() => {
        const endOffset = itemOffset + itemsPerPage;
        console.log(`Loading items from ${itemOffset} to ${endOffset}`);
        setCurrentItems(listExams.slice(itemOffset, endOffset));
        setPageCount(Math.ceil(totalExams / itemsPerPage));
    }, [itemOffset, itemsPerPage, listExams, totalExams]);

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % totalExams;
        console.log(`User requested page number ${event.selected}, which is offset ${newOffset}`);
        setItemOffset(newOffset);
    };

    return (
        <>
            <Header/>

            <div className="page-wrapper">
                <div className="content container-fluid">
                    <div className="page-header">
                        <div className="row">
                            <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                <h5 className="text-uppercase mb-0 mt-0 page-title">Bài thi</h5>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                <ul className="breadcrumb float-right p-0 mb-0">
                                    <li className="breadcrumb-item"><Link to="/"><i
                                        className="fas fa-home"></i> Trang chủ</Link></li>
                                    <li className="breadcrumb-item"><span> Bài thi</span></li>
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
                                            <input type="text" className="form-control floating"
                                                   onChange={(e) => setQuery(e.target.value)}/>
                                            <label className="focus-label">Tên bài thi</label>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="text-right add-btn-col">
                                            <Link to="#" className="btn btn-primary float-right btn-rounded"
                                                  data-toggle="modal" data-target="#add_exam"
                                                  style={{borderRadius: "50px", textTransform: "none"}}>
                                                <i className="fas fa-plus"></i> Thêm bài thi</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="table-responsive">
                                            <table className="table custom-table mb-3 datatable">
                                                <thead className="thead-light">
                                                <tr>
                                                    <th>STT</th>
                                                    <th>Tên bài thi</th>
                                                    <th>Môn thi</th>
                                                    <th>Thời gian (p)</th>
                                                    <th>Tổng số câu hỏi</th>
                                                    <th>Người tạo</th>
                                                    <th className="text-right">Tính năng</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {currentItems && currentItems.filter((current) => keys.some(key => current[key].toLowerCase().includes(query)))
                                                    .map((item, index) => {
                                                    return (
                                                        <tr>
                                                            <td>{item.id}</td>
                                                            <td>
                                                                <h2><Link to="exam-detail.html"
                                                                          className="avatar text-white">J</Link><Link
                                                                    to="exam-detail.html">{item.name}</Link></h2>
                                                            </td>
                                                            <td>{item.subjectId}</td>
                                                            <td>{item.examTime}</td>
                                                            <td>{item.numberOfQuestions}</td>
                                                            <td>{item.creatorId}</td>
                                                            <td className="text-right">
                                                                <button type="submit" data-toggle="modal"
                                                                        data-target="#edit_exam"
                                                                        className="btn btn-primary btn-sm mb-1">
                                                                    <i className="far fa-edit" title="Sửa"></i>
                                                                </button>
                                                                <button type="submit" data-toggle="modal"
                                                                        data-target="#delete_exam"
                                                                        className="btn btn-danger btn-sm mb-1"
                                                                        style={{marginLeft: '5px'}}>
                                                                    <i className="far fa-trash-alt" title="Xóa"></i>
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                                }
                                                </tbody>
                                            </table>

                                            <ReactPaginate
                                                nextLabel="sau >"
                                                onPageChange={handlePageClick}
                                                pageRangeDisplayed={3}
                                                marginPagesDisplayed={2}
                                                pageCount={pageCount}
                                                previousLabel="< trước"
                                                pageClassName="page-item"
                                                pageLinkClassName="page-link"
                                                previousClassName="page-item"
                                                previousLinkClassName="page-link"
                                                nextClassName="page-item"
                                                nextLinkClassName="page-link"
                                                breakLabel="..."
                                                breakClassName="page-item"
                                                breakLinkClassName="page-link"
                                                containerClassName="pagination"
                                                activeClassName="active"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div id="add_exam" className="modal" role="dialog">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content modal-lg">
                        <div className="modal-header">
                            <h4 className="modal-title">Thêm bài thi</h4>
                            <button type="button" className="close" data-dismiss="modal">&times;</button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>Tên bài thi</label>
                                            <input type="text" className="form-control" required="required"/>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>Thời gian thi</label>
                                            <input type="number" className="form-control" required="required"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>Môn thi</label>
                                            <select className="form-control select">
                                                <option>-- Chọn môn thi --</option>
                                                <option>Maths</option>
                                                <option>Computer</option>
                                                <option>Science</option>
                                                <option>Maths</option>
                                                <option>Tamil</option>
                                                <option>English</option>
                                                <option>Social Science</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>Trạng thái</label>
                                            <select className="form-control select">
                                                <option>Pending</option>
                                                <option>Approved</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12">
                                        <div className="form-group">
                                            <label>Hình ảnh</label>
                                            <input type="file" className="form-control" required="required"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="m-t-20 text-center">
                                    <button className="btn btn-primary btn-lg">Tạo bài thi</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <div id="edit_exam" className="modal" role="dialog">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content modal-lg">
                        <div className="modal-header">
                            <h4 className="modal-title">Chỉnh sửa bài thi</h4>
                            <button type="button" className="close" data-dismiss="modal">&times;</button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>Tên bài thi</label>
                                            <input type="text" className="form-control" required="required"
                                                   value="Kiểm tra Giữa kỳ lần 1"/>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>Thời gian thi</label>
                                            <input type="number" className="form-control" required="required"
                                                   value="10"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>Môn thi</label>
                                            <select className="form-control select">
                                                <option>Maths</option>
                                                <option>Computer</option>
                                                <option>Science</option>
                                                <option>Maths</option>
                                                <option>Tamil</option>
                                                <option>English</option>
                                                <option>Social Science</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>Trạng thái</label>
                                            <select className="form-control select">
                                                <option>Pending</option>
                                                <option>Approved</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12">
                                        <div className="form-group">
                                            <label>Hình ảnh</label>
                                            <input type="file" className="form-control" required="required"/>
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

            <div id="delete_exam" className="modal" role="dialog">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content modal-md">
                        <div className="modal-header">
                            <h4 className="modal-title">Xóa Bài Thi</h4>
                        </div>
                        <form>
                            <div className="modal-body">
                                <p>Bạn có chắc muốn xóa bài thi này?</p>
                                <div className="m-t-20"><Link to="#" className="btn btn-white"
                                                              data-dismiss="modal">Hủy</Link>
                                    <button type="submit" className="btn btn-danger"
                                            style={{marginLeft: '10px'}}>Xóa
                                    </button>
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