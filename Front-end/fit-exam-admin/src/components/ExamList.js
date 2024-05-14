import React, {useEffect, useState} from "react";
import {TabTitle} from "../commons/DynamicTitle";
import {Link} from "react-router-dom";
import Header from ".//Header";
import {createExam, fetchAllExam} from "../service/ExamService";
import ReactPaginate from "react-paginate";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import moment from "moment/moment";
import {createFaculty} from "../service/FacultyService";

const ExamList = () => {
    TabTitle('Bài thi | FIT Exam Admin');

    const [listExams, setListExams] = useState([]);
    const [totalExams, setTotalExams] = useState(0);
    const [dataExamEdit, setDataExamEdit] = useState({});
    const [dataExamDelete, setDataExamDelete] = useState({});

    const [name, setName] = useState('');
    const [subjectId, setSubjectId] = useState('');
    const [examTime, setExamTime] = useState('');
    const [numberOfQuestions, setNumberOfQuestions] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const [query, setQuery] = useState('');
    const keys = ["name"];

    const userId = localStorage.getItem("id");

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
        setCurrentItems(listExams.slice(itemOffset, endOffset));
        setPageCount(Math.ceil(totalExams / itemsPerPage));
    }, [itemOffset, itemsPerPage, listExams, totalExams]);

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % totalExams;
        setItemOffset(newOffset);
    };

    const handleSave = async () => {
        const creatorId = userId;
        let res = await createExam(name, subjectId, creatorId, examTime, numberOfQuestions, startDate, endDate);
        if (res && res.id) {
            setName('');
            setSubjectId('');
            setExamTime('');
            setNumberOfQuestions('');
            setStartDate('');
            setEndDate('');

            toast.success("Tạo bài thi thành công!", {
                onClose: () => {
                    window.location.reload();
                }
            });
        } else {
            toast.error("Tạo bài thi thất bại!");
        }
    }

    useEffect(() => {
        if (dataExamEdit) {
            setName(dataExamEdit.name);
            setSubjectId(dataExamEdit.subjectId);
            setExamTime(dataExamEdit.examTime);
            setNumberOfQuestions(dataExamEdit.numberOfQuestions);
            setStartDate(dataExamEdit.startTime);
            setEndDate(dataExamEdit.endTime);

            if (dataExamEdit.dob) {
                const formattedDateTime = moment(dataExamEdit.dob).format('YYYY-MM-DDTHH:mm');
                setStartDate(formattedDateTime);
                setEndDate(formattedDateTime);
            }
        }
    }, [dataExamEdit]);

    const handleEditExam = (exam) => {
        setDataExamEdit(exam);
    }

    const handleDeleteExam = (exam) => {
        setDataExamDelete(exam);
    }

    const handleUpdate = async () => {
        // let examId = dataExamEdit.id;
        // let res = await updateExam(examId, name);
        //
        // if (res && examId) {
        //     toast.success("Cập nhật bài thi thành công!", {
        //         onClose: () => {
        //             window.location.reload();
        //         }
        //     });
        // } else {
        //     toast.error("Cập nhật bài thi thất bại!");
        // }
    }

    const confirmDelete = async () => {
        // let examId = dataExamDelete.id;
        // let res = await deleteExam(examId);
        //
        // if (res && examId) {
        //     toast.success("Xóa bài thi thành công!", {
        //         onClose: () => {
        //             window.location.reload();
        //         }
        //     });
        // } else {
        //     toast.error("Xóa bài thi thất bại!");
        // }
    }

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
                                                    <th className="text-center">Thời gian (p)</th>
                                                    <th className="text-center">Tổng số câu hỏi</th>
                                                    <th>Người tạo</th>
                                                    <th className="text-right">Tính năng</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {currentItems && currentItems.filter((current) => keys.some(key => current[key].toLowerCase().includes(query)))
                                                    .map((item, index) => {
                                                        return (
                                                            <tr key={`exams-${index}`}>
                                                                <td>{item.id}</td>
                                                                <td>
                                                                    <h2>{item.name}</h2>
                                                                </td>
                                                                <td>
                                                                    {item.subject ? (
                                                                        <h2>{item.subject.name}</h2>
                                                                    ) : (
                                                                        <span>Invalid subject</span>
                                                                    )}
                                                                </td>
                                                                <td className="text-center">{item.examTime}</td>
                                                                <td className="text-center">{item.numberOfQuestions}</td>
                                                                <td>
                                                                    {item.user ? (
                                                                        <h2>{item.user.name}</h2>
                                                                    ) : (
                                                                        <span>Invalid creator</span>
                                                                    )}
                                                                </td>
                                                                <td className="text-right">
                                                                    <button type="submit" data-toggle="modal"
                                                                            data-target="#edit_exam"
                                                                            className="btn btn-primary btn-sm mb-1"
                                                                            onClick={() => handleEditExam(item)}>
                                                                        <i className="far fa-edit" title="Sửa"></i>
                                                                    </button>
                                                                    <button type="submit" data-toggle="modal"
                                                                            data-target="#delete_exam"
                                                                            className="btn btn-danger btn-sm mb-1"
                                                                            style={{marginLeft: '5px'}}
                                                                            onClick={() => handleDeleteExam(item)}>
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
                            <div className="row">
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <label>Tên bài thi</label>
                                        <input type="text" className="form-control" required="required"
                                               value={name}
                                               onChange={(event) => {
                                                   setName(event.target.value);
                                               }}
                                        />
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <label>Thời gian thi</label>
                                        <input type="number" className="form-control" required="required"
                                               value={examTime}
                                               onChange={(event) => {
                                                   setExamTime(event.target.value);
                                               }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <label>Mã môn thi</label>
                                        <input type="number" className="form-control" required="required"
                                               value={subjectId}
                                               onChange={(event) => {
                                                   setSubjectId(event.target.value);
                                               }}
                                        />
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <label>Số câu hỏi</label>
                                        <input type="number" className="form-control" required="required"
                                               value={numberOfQuestions}
                                               onChange={(event) => {
                                                   setNumberOfQuestions(event.target.value);
                                               }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <label>Ngày bắt đầu</label>
                                        <input type="date" className="form-control" required="required"
                                               value={startDate}
                                               onChange={(event) => {
                                                   setStartDate(event.target.value);
                                               }}
                                        />
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <label>Ngày kết thúc</label>
                                        <input type="date" className="form-control" required="required"
                                               value={endDate}
                                               onChange={(event) => {
                                                   setEndDate(event.target.value);
                                               }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="m-t-20 text-center">
                                <button className="btn btn-primary btn-lg" data-dismiss="modal"
                                        onClick={() => handleSave()}>Tạo bài thi</button>
                            </div>
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
                            <div className="row">
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <label>Tên bài thi</label>
                                        <input type="text" className="form-control" required="required"
                                               value={name}
                                               onChange={(event) => {
                                                   setName(event.target.value);
                                               }}
                                        />
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <label>Thời gian thi</label>
                                        <input type="number" className="form-control" required="required"
                                               value={examTime}
                                               onChange={(event) => {
                                                   setExamTime(event.target.value);
                                               }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <label>Môn thi</label>
                                        <input type="number" className="form-control" required="required"
                                               value={subjectId}
                                               onChange={(event) => {
                                                   setSubjectId(event.target.value);
                                               }}
                                        />
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <label>Số câu hỏi</label>
                                        <input type="number" className="form-control" required="required"
                                               value={numberOfQuestions}
                                               onChange={(event) => {
                                                   setNumberOfQuestions(event.target.value);
                                               }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <label>Ngày bắt đầu</label>
                                        <input type="date" className="form-control" required="required"
                                               value={startDate}
                                               onChange={(event) => {
                                                   setStartDate(event.target.value);
                                               }}
                                        />
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <label>Ngày kết thúc</label>
                                        <input type="date" className="form-control" required="required"
                                               value={endDate}
                                               onChange={(event) => {
                                                   setEndDate(event.target.value);
                                               }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="m-t-20 text-center">
                                <button className="btn btn-primary btn-lg">Lưu thay đổi</button>
                            </div>
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
                        <div className="modal-body">
                            <p>Bạn có chắc muốn xóa bài thi này?</p>
                            <div className="m-t-20"><Link to="#" className="btn btn-white"
                                                          data-dismiss="modal">Hủy</Link>
                                <button type="submit" className="btn btn-danger"
                                        style={{marginLeft: '10px'}}>Xóa
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer/>
        </>
    )
}

export default ExamList;