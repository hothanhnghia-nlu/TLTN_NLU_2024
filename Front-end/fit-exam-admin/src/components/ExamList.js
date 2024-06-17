import React, {useEffect, useState} from "react";
import {TabTitle} from "../commons/DynamicTitle";
import {Link} from "react-router-dom";
import Header from ".//Header";
import {createExam, deleteExam, fetchAllExamByCreatorId, updateExam} from "../service/ExamService";
import ReactPaginate from "react-paginate";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import moment from "moment/moment";
import {createQuestion} from "../service/QuestionService";

const ExamList = () => {
    TabTitle('Bài thi | FIT Exam Admin');

    const [listExams, setListExams] = useState([]);
    const [dataExamEdit, setDataExamEdit] = useState({});
    const [dataExamDelete, setDataExamDelete] = useState({});

    const [name, setName] = useState('');
    const [subjectId, setSubjectId] = useState('');
    const [examTime, setExamTime] = useState('');
    const [numberOfQuestions, setNumberOfQuestions] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loadingAPI, setLoadingAPI] = useState(false);

    const [content, setContent] = useState('');
    const [answerNum, setAnswerNum] = useState(0);
    const [options, setOptions] = useState([]);
    const [correctAnswers, setCorrectAnswers] = useState('');
    const [difficultyLevel, setDifficultyLevel] = useState('');
    const [isMultipleChoice, setIsMultipleChoice] = useState(false);
    const [selectedImage, setSelectedImage] = useState({
        file: null,
        name: '',
        preview: ''
    });

    const [query, setQuery] = useState('');

    const userId = localStorage.getItem("id");

    useEffect(() => {
        getExams(userId);
    }, [userId])

    const getExams = async (id) => {
        let res = await fetchAllExamByCreatorId({id});
        if (res) {
            setListExams(res);
        }
    }

    const [currentItems, setCurrentItems] = useState(null);
    const [searchedItems, setSearchItems] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [itemOffset, setItemOffset] = useState(0);
    const itemsPerPage = 5;

    useEffect(() => {
        handleSearch();
    }, [query]);

    useEffect(() => {
        const endOffset = itemOffset + itemsPerPage;
        const itemsToDisplay = query ? searchedItems : listExams;
        setCurrentItems(itemsToDisplay.slice(itemOffset, endOffset));
        setPageCount(Math.ceil(itemsToDisplay.length / itemsPerPage));
    }, [itemOffset, itemsPerPage, listExams, query, searchedItems]);

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % (query ? searchedItems.length : listExams.length);
        setItemOffset(newOffset);
    }

    const handleSearch = () => {
        if (query) {
            const filtered = listExams.filter(item => {
                const name = item.name.toLowerCase();
                const subject = item.subject ? item.subject.name.toLowerCase() : '';
                return name.includes(query.toLowerCase()) || subject.includes(query.toLowerCase());
            });
            setSearchItems(filtered);
        } else {
            setSearchItems(listExams);
        }
        setItemOffset(0);
    }

    const handleSave = async () => {
        if (!name || !subjectId || !examTime || !numberOfQuestions || !startDate || !endDate) {
            toast.error("Vui lòng điền đầy đủ thông tin!");
            return;
        }

        let res = await createExam(name, subjectId, userId, examTime, numberOfQuestions, startDate, endDate);

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

            if (dataExamEdit.startDate && dataExamEdit.endDate) {
                const formattedStartDate = moment(dataExamEdit.startDate).format('YYYY-MM-DDTHH:mm');
                const formattedEndDate = moment(dataExamEdit.endDate).format('YYYY-MM-DDTHH:mm');
                setStartDate(formattedStartDate);
                setEndDate(formattedEndDate);
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
        let examId = dataExamEdit.id;
        let res = await updateExam(examId, name, subjectId, examTime, numberOfQuestions, startDate, endDate);

        if (res && examId) {
            toast.success("Cập nhật bài thi thành công!", {
                onClose: () => {
                    window.location.reload();
                }
            });
        } else {
            toast.error("Cập nhật bài thi thất bại!");
        }
    }

    const confirmDelete = async () => {
        let examId = dataExamDelete.id;
        let res = await deleteExam(examId);

        if (res && examId) {
            toast.success("Xóa bài thi thành công!", {
                onClose: () => {
                    window.location.reload();
                }
            });
        } else {
            toast.error("Xóa bài thi thất bại!");
        }
    }

    const handleAnswerNumChange = (event) => {
        const value = event.target.value;

        if (value === '') {
            setAnswerNum('');
            setOptions([]);
        } else {
            const parsedValue = parseInt(value, 10);
            if (!isNaN(parsedValue) && parsedValue >= 0) {
                setAnswerNum(parsedValue);

                const newOptions = Array(parsedValue).fill('').map((_, index) => options[index] || {
                    content: '',
                    isCorrect: false
                });
                setOptions(newOptions);
            }
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedImage({
                file: file,
                name: file.name,
                preview: URL.createObjectURL(file)
            });
        }
    };

    const handleSaveQuestion = async () => {
        const imageFile = selectedImage?.file || null;

        if (!content || !difficultyLevel || !options || !correctAnswers || !answerNum) {
            toast.error("Vui lòng điền đầy đủ thông tin!");
            return;
        }

        const correctAnswersArray = correctAnswers.split('\n');

        try {
            setLoadingAPI(true);

            const updatedOptions = options.map(option => ({
                ...option,
                isCorrect: correctAnswersArray.includes(option.content)
            }));

            let res = await createQuestion(content, difficultyLevel, isMultipleChoice, updatedOptions, imageFile, name, subjectId);
            if (res && res.id) {
                setContent('');
                setDifficultyLevel('');
                setOptions([]);
                setSelectedImage({
                    file: null,
                    name: '',
                    preview: ''
                });
                setCorrectAnswers('');
                setAnswerNum(0);

                toast.success("Tạo câu hỏi thành công!");
            } else {
                toast.error("Tạo câu hỏi thất bại!");
            }
        } catch (error) {
            console.error("Error creating question:", error);
        } finally {
            setLoadingAPI(false);
        }
    }

    const handleAddQuestion = (exam) => {
        setDataExamEdit(exam);
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
                                <div className="row align-items-center">
                                    <div className="col-md-6">
                                        <div className="form-focus">
                                            <input type="text" className="form-control floating"
                                                   onChange={(e) => setQuery(e.target.value)}/>
                                            <label className="focus-label">Tên bài thi, Môn thi</label>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="text-right add-btn-col">
                                            <Link to="#" className="btn btn-primary float-right btn-rounded"
                                                  data-toggle="modal" data-target="#add_exam">
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
                                                {currentItems && currentItems.map((item, index) => {
                                                    const realIndex = itemOffset + index + 1;
                                                    return (
                                                        <tr key={`exams-${index}`}>
                                                            <td>{realIndex}</td>
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
                                                                <div className="dropdown dropdown-action">
                                                                    <Link to="#" className="action-icon dropdown-toggle"
                                                                          data-toggle="dropdown"
                                                                          aria-expanded="false"><i
                                                                        className="fas fa-ellipsis-v"></i></Link>
                                                                    <div className="dropdown-menu dropdown-menu-right">
                                                                        <Link className="dropdown-item" to="#"
                                                                              title="Add Manually"
                                                                              data-toggle="modal"
                                                                              data-target="#add_question"
                                                                              onClick={() => handleAddQuestion(item)}>
                                                                            <i className="fas fa-plus m-r-5"></i> Thêm
                                                                            câu hỏi</Link>
                                                                        <Link className="dropdown-item" to="#"
                                                                              title="Add from File"
                                                                              data-toggle="modal"
                                                                              data-target="#add_question_file">
                                                                            <i className="fas fa-file-upload m-r-5"></i> Thêm
                                                                            câu hỏi từ file</Link>
                                                                        <Link className="dropdown-item" to="#"
                                                                              title="Edit"
                                                                              data-toggle="modal"
                                                                              data-target="#edit_exam"
                                                                              onClick={() => handleEditExam(item)}>
                                                                            <i className="fas fa-pencil-alt m-r-5"></i> Chỉnh
                                                                            sửa bài thi</Link>
                                                                        <Link className="dropdown-item" to="#"
                                                                              title="Delete"
                                                                              data-toggle="modal"
                                                                              data-target="#delete_exam"
                                                                              onClick={() => handleDeleteExam(item)}>
                                                                            <i className="fas fa-trash-alt m-r-5"></i> Xóa
                                                                            bài thi</Link>
                                                                    </div>
                                                                </div>
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


            <div id="add_exam" className="modal fade" role="dialog">
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
                                               min="0"
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
                                               min="0"
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
                                               min="0"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <label>Ngày bắt đầu</label>
                                        <input type="datetime-local" className="form-control" required="required"
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
                                        <input type="datetime-local" className="form-control" required="required"
                                               value={endDate}
                                               onChange={(event) => {
                                                   setEndDate(event.target.value);
                                               }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="m-t-20 text-center">
                                <button className="btn btn-primary btn-lg"
                                        onClick={() => handleSave()}>Tạo bài thi
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="edit_exam" className="modal fade" role="dialog">
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
                                               min="0"
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
                                               min="0"
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
                                               min="0"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <label>Ngày bắt đầu</label>
                                        <input type="datetime-local" className="form-control" required="required"
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
                                        <input type="datetime-local" className="form-control" required="required"
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
                                        onClick={() => handleUpdate()}>Lưu thay đổi
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="delete_exam" className="modal fade" role="dialog">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content modal-md">
                        <div className="modal-header">
                            <h4 className="modal-title">Xóa Bài Thi</h4>
                        </div>
                        <div className="modal-body">
                            <p>Bạn có chắc muốn xóa bài thi này?</p>
                            <div className="m-t-20"><Link to="#" className="btn btn-white"
                                                          data-dismiss="modal">Hủy</Link>
                                <button type="submit" className="btn btn-danger" data-dismiss="modal"
                                        style={{marginLeft: '10px'}}
                                        onClick={() => confirmDelete()}>Xóa
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="add_question" className="modal fade" role="dialog">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Thêm câu hỏi</h4>
                            <button type="button" className="close" data-dismiss="modal">&times;</button>
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-sm-12">
                                    <div className="form-group">
                                        <label>Nội dung câu hỏi</label>
                                        <textarea className="form-control" required="required"
                                                  value={content}
                                                  onChange={(event) => {
                                                      setContent(event.target.value);
                                                  }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-4">
                                    <label>Tên bài thi</label>
                                    <input type="text" className="form-control" required="required"
                                           value={name}
                                           onChange={(event) => {
                                               setName(event.target.value);
                                           }}
                                    />
                                </div>
                                <div className="col-sm-4">
                                    <label>Đa lựa chọn?</label>
                                    <select
                                        className="form-control select"
                                        value={isMultipleChoice.toString()}
                                        onChange={(event) => setIsMultipleChoice(event.target.value === 'true')}>
                                        <option value="true">Phải</option>
                                        <option value="false">Không</option>
                                    </select>
                                </div>

                                <input type="number" className="form-control" hidden="hidden"
                                       value={subjectId}
                                       onChange={(event) => {
                                           setSubjectId(event.target.value);
                                       }}
                                />
                                <div className="col-sm-4">
                                    <div className="form-group">
                                        <label>Số câu trả lời</label>
                                        <input type="number" className="form-control" required="required"
                                               value={answerNum}
                                               onChange={handleAnswerNumChange}
                                        />
                                    </div>
                                </div>
                            </div>
                            {Array.from({length: Math.ceil(answerNum / 2)}).map((_, rowIndex) => (
                                <div className="row" key={rowIndex}>
                                    {options.slice(rowIndex * 2, rowIndex * 2 + 2).map((option, index) => (
                                        <div className="col-sm-6" key={rowIndex * 2 + index}>
                                            <div className="form-group">
                                                <label>Lựa chọn {String.fromCharCode(65 + rowIndex * 2 + index)}</label>
                                                <textarea className="form-control" required="required"
                                                          value={option.content}
                                                          onChange={(event) => {
                                                              const newOptions = [...options];
                                                              newOptions[rowIndex * 2 + index].content = event.target.value;
                                                              setOptions(newOptions);
                                                          }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                            <div className="row">
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <label>Đáp án đúng</label>
                                        <textarea className="form-control" required="required"
                                                  value={correctAnswers}
                                                  onChange={(event) => {
                                                      setCorrectAnswers(event.target.value);
                                                  }}
                                        />
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <label>Độ khó</label>
                                        <select
                                            className="form-control select"
                                            value={difficultyLevel}
                                            onChange={(event) => setDifficultyLevel(event.target.value)}>
                                            <option value="default">---Chọn độ khó---</option>
                                            <option value="Dễ">Dễ</option>
                                            <option value="Trung bình">Trung bình</option>
                                            <option value="Khó">Khó</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-8">
                                    <div className="form-group">
                                        <label>Ảnh minh họa (nếu có)</label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                        />
                                    </div>
                                </div>
                                <div className="col-sm-4">
                                    {selectedImage && (
                                        <img src={selectedImage.preview} width="100" height="120"
                                             alt="images-question"/>
                                    )}
                                </div>
                            </div>
                            <div className="m-t-20 text-center">
                                <button type="submit" className="btn btn-primary btn-lg"
                                        onClick={() => handleSaveQuestion()}>
                                    {loadingAPI && <i className="fas fa-sync fa-spin"></i>}
                                    &nbsp;Tạo câu hỏi
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