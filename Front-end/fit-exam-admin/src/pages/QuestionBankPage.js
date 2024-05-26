import React, {useEffect, useState} from "react";
import {TabTitle} from "../commons/DynamicTitle";
import {Link} from "react-router-dom";
import Header from "../components/Header";
import ReactPaginate from "react-paginate";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {createQuestion, fetchAllQuestionByUserId, fetchShuffleQuestions} from "../service/QuestionService";
import {deleteQuestion, updateQuestion} from "../service/QuestionService";
import {fetchAllAnswerByQuestionId} from "../service/AnswerService";

const ExamList = () => {
    TabTitle('Ngân hàng câu hỏi | FIT Exam Admin');

    const [listQuestions, setListQuestions] = useState([]);
    const [listAnswers, setListAnswers] = useState([]);
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [dataQuestionEdit, setDataQuestionEdit] = useState({});
    const [dataQuestionDelete, setDataQuestionDelete] = useState({});
    
    const [content, setContent] = useState('');
    const [examName, setExamName] = useState('');
    const [answerNum, setAnswerNum] = useState(0);
    const [options, setOptions] = useState([]);
    const [answer, setAnswer] = useState('');
    const [difficultyLevel, setDifficultyLevel] = useState('');
    const [selectedImage, setSelectedImage] = useState({
        file: null,
        name: '',
        preview: ''
    });

    const [query, setQuery] = useState('');
    const keys = ["content"];

    const userId = localStorage.getItem("id");

    useEffect(() => {
        getQuestions(userId);
    }, [userId]);

    const getQuestions = async (id) => {
        let res = await fetchAllQuestionByUserId({id});
        if (res) {
            setListQuestions(res);
            setTotalQuestions(res.length);
        }
    }

    const handleShuffleQuestions = async (id) => {
        let res = await fetchShuffleQuestions({id});
        if (res) {
            setListQuestions(res);
            setTotalQuestions(res.length);
        }
    }

    const handleViewQuestion = async (id) => {
        let res = await fetchAllAnswerByQuestionId({id});
        if (res) {
            setListAnswers(res);
        }
    }

    const [currentItems, setCurrentItems] = useState(null);
    const [pageCount, setPageCount] = useState(0);
    const [itemOffset, setItemOffset] = useState(0);
    const itemsPerPage = 5;

    useEffect(() => {
        const endOffset = itemOffset + itemsPerPage;
        setCurrentItems(listQuestions.slice(itemOffset, endOffset));
        setPageCount(Math.ceil(totalQuestions / itemsPerPage));
    }, [itemOffset, itemsPerPage, listQuestions, totalQuestions]);

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % totalQuestions;
        setItemOffset(newOffset);
    };

    const handleAnswerNumChange = (event) => {
        const value = event.target.value;

        if (value === '') {
            setAnswerNum('');
            setOptions([]);
        } else {
            const parsedValue = parseInt(value, 10);
            if (!isNaN(parsedValue) && parsedValue >= 0) {
                setAnswerNum(parsedValue);

                const newOptions = Array(parsedValue).fill('').map((_, index) => options[index] || { content: '', isCorrect: false });
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

    const handleSave = async () => {
        const imageFile = selectedImage?.file || null;

        if (!content || !difficultyLevel || !options || !answer || !answerNum) {
            toast.error("Vui lòng điền đầy đủ thông tin!");
            return;
        }

        try {
            options.forEach(option => {
                option.isCorrect = option.content === answer;
            });

            let res = await createQuestion(content, difficultyLevel, options, imageFile, examName);
            if (res && res.id) {
                setContent('');
                setDifficultyLevel('');
                setOptions([]);
                setSelectedImage(null);

                toast.success("Tạo bài thi thành công!");
            } else {
                toast.error("Tạo câu hỏi thất bại!");
            }
        } catch (error) {
            console.error("Error creating question:", error);
        }
    }

    useEffect(() => {
        if (dataQuestionEdit && dataQuestionEdit.options) {
            setContent(dataQuestionEdit.content);
            setDifficultyLevel(dataQuestionEdit.difficultyLevel);
            setOptions(dataQuestionEdit.options);
            setExamName(dataQuestionEdit.examName);
            setOptions(dataQuestionEdit.options);
        }
    }, [dataQuestionEdit]);

    const handleEditQuestion = (question) => {
        setDataQuestionEdit(question);
    }

    const handleDeleteQuestion = (question) => {
        setDataQuestionDelete(question);
    }

    const handleUpdate = async () => {
        const imageFile = selectedImage?.file || null;
        const questionId = dataQuestionEdit.id;

        try {
            options.forEach(option => {
                option.isCorrect = option.content === answer;
            });

            let res = await updateQuestion(questionId, content, difficultyLevel, options, imageFile, examName);
            if (res && questionId) {
                toast.success("Cập nhật câu hỏi thành công!");
                window.location.reload();
            } else {
                toast.error("Tạo câu hỏi thất bại!");
            }
        } catch (error) {
            console.error("Error creating question:", error);
        }
    }

    const confirmDelete = async () => {
        let questionId = dataQuestionDelete.id;
        let res = await deleteQuestion(questionId);

        if (res && questionId) {
            toast.success("Xóa câu hỏi thành công!", {
                onClose: () => {
                    window.location.reload();
                }
            });
        } else {
            toast.error("Xóa câu hỏi thất bại!");
        }
    }

    const getCorrectAnswer = (item) => {
        if (item.isCorrect === true) {
            return <td>Đúng</td>;
        } else {
            return <td>Sai</td>;
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
                                            <input type="text" className="form-control floating"
                                                   onChange={(e) => setQuery(e.target.value)}/>
                                            <label className="focus-label">Câu hỏi</label>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="text-right">
                                            <div className="dropdown">
                                                <Link className="btn btn-outline-primary float-right mr-4 dropdown-toggle"
                                                      to="#" role="button" data-toggle="dropdown" aria-expanded="false"
                                                      style={{borderRadius: "50px", textTransform: "none"}}>
                                                    Thêm câu hỏi <span></span>
                                                </Link>

                                                <div className="dropdown-menu">
                                                    <Link to="#" className="dropdown-item" data-toggle="modal" data-target="#add_question">Thêm thủ công</Link>
                                                    <Link to="#" className="dropdown-item" data-toggle="modal" >Thêm từ file</Link>
                                                </div>
                                            </div>
                                            <div>
                                                <button className="btn btn-outline-secondary float-right mr-4"
                                                        style={{borderRadius: "50px", textTransform: "none"}}
                                                onClick={() => handleShuffleQuestions(userId)}>
                                                   <i className="fas fa-sync"></i> Trộn câu hỏi
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="table-responsive">
                                            <table className="table custom-table datatable" style={{marginBottom: '10px'}}>
                                                <thead className="thead-light">
                                                <tr>
                                                    <th>#</th>
                                                    <th>Nội dung câu hỏi</th>
                                                    <th>Ảnh minh họa</th>
                                                    <th>Bài thi</th>
                                                    <th>Môn thi</th>
                                                    <th>Độ khó</th>
                                                    <th className="text-right">Tính năng</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {currentItems && currentItems.filter((current) => keys.some(key => current[key].toLowerCase().includes(query)))
                                                    .map((item, index) => {
                                                        return (
                                                            <tr key={`questions-${index}`}>
                                                                <td>{item.id}</td>
                                                                <td>
                                                                    <h2>{item.content}</h2>
                                                                </td>
                                                                <td className="text-center">
                                                                    {item.images && item.images.length > 0 ? (
                                                                        <img src={item.images[0].url} alt="images-question" style={{ maxWidth: '50px', maxHeight: '70px' }} />
                                                                    ) : (
                                                                        <span>No Image</span>
                                                                    )}
                                                                </td>
                                                                <td>
                                                                    {item.exam ? (
                                                                        <h2>{item.exam.name}</h2>
                                                                    ) : (
                                                                        <span>Invalid exam</span>
                                                                    )}
                                                                </td>
                                                                <td>
                                                                    {item.exam.subject ? (
                                                                        <h2>{item.exam.subject.name}</h2>
                                                                    ) : (
                                                                        <span>Invalid subject</span>
                                                                    )}
                                                                </td>
                                                                <td>{item.difficultyLevel}</td>
                                                                <td className="text-right">
                                                                    <div className="dropdown dropdown-action">
                                                                        <Link to="#" className="action-icon dropdown-toggle"
                                                                              data-toggle="dropdown" aria-expanded="false"><i
                                                                            className="fas fa-ellipsis-v"></i></Link>
                                                                        <div className="dropdown-menu dropdown-menu-right">
                                                                            <Link className="dropdown-item" to="#" title="Edit"
                                                                                  data-toggle="modal" data-target="#view_question"
                                                                                  onClick={() => handleViewQuestion(item.id)}>
                                                                                <i className="fas fa-eye m-r-5"></i> Xem chi tiết</Link>
                                                                            <Link className="dropdown-item" to="#" title="Edit"
                                                                                  data-toggle="modal" data-target="#edit_question"
                                                                                  onClick={() => handleEditQuestion(item)}>
                                                                                <i className="fas fa-pencil-alt m-r-5"></i> Chỉnh sửa</Link>
                                                                            <Link className="dropdown-item" to="#" title="Delete"
                                                                                  data-toggle="modal" data-target="#delete_question"
                                                                                  onClick={() => handleDeleteQuestion(item)}>
                                                                                <i className="fas fa-trash-alt m-r-5"></i> Xóa</Link>
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
                                <div className="col-sm-8">
                                    <label>Tên bài thi</label>
                                    <input type="text" className="form-control" required="required"
                                           value={examName}
                                           onChange={(event) => {
                                               setExamName(event.target.value);
                                           }}
                                    />
                                </div>
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
                            {Array.from({ length: Math.ceil(answerNum / 2) }).map((_, rowIndex) => (
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
                                               value={answer}
                                               onChange={(event) => {
                                                   setAnswer(event.target.value);
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
                                        <img src={selectedImage.preview} width="100" height="120" alt="images-question"/>
                                    )}
                                </div>
                            </div>
                            <div className="m-t-20 text-center">
                                <button type="submit" className="btn btn-primary btn-lg"
                                        onClick={() => handleSave()}>Tạo câu hỏi</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="view_question" className="modal fade" role="dialog">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content modal-content1">
                        <div className="modal-header modal-header1">
                            <h4 className="modal-title">Chi tiết câu hỏi</h4>
                            <button type="button" className="close" data-dismiss="modal">&times;</button>
                        </div>
                        <div className="modal-body">
                            <div className="table-responsive">
                                <table className="table custom-table datatable">
                                    <thead className="thead-light">
                                    <tr>
                                        <th>#</th>
                                        <th>Nội dung câu trả lời</th>
                                        <th>Đúng/sai</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {listAnswers && listAnswers.length > 0 &&
                                        listAnswers.map((item, index) => {
                                            return (
                                                <tr key={`answers-${index}`}>
                                                    <td>{item.questionId}</td>
                                                    <td>{item.content}</td>
                                                    <td>{getCorrectAnswer(item)}</td>
                                                </tr>
                                            )
                                        })
                                    }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="edit_question" className="modal fade" role="dialog">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Chỉnh sửa câu hỏi</h4>
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
                                <div className="col-sm-8">
                                    <label>Tên bài thi</label>
                                    <input type="text" className="form-control" required="required"
                                           value={examName}
                                           onChange={(event) => {
                                               setExamName(event.target.value);
                                           }}
                                    />
                                </div>
                                <div className="col-sm-4">
                                    <div className="form-group">
                                        <label>Số câu trả lời</label>
                                        <input type="number" className="form-control" required="required"
                                               value={options.length}
                                               onChange={handleAnswerNumChange}
                                        />
                                    </div>
                                </div>
                            </div>
                            {options.map((option, index) => (
                                index % 2 === 0 && (
                                    <div className="row" key={index}>
                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <label>Lựa chọn {String.fromCharCode(65 + index)}</label>
                                                <textarea className="form-control" required="required"
                                                          value={option.content}
                                                          onChange={(event) => {
                                                              const newOptions = [...options];
                                                              newOptions[index].content = event.target.value;
                                                              setOptions(newOptions);
                                                          }}
                                                />
                                            </div>
                                        </div>
                                        {index + 1 < options.length && (
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label>Lựa chọn {String.fromCharCode(65 + index + 1)}</label>
                                                    <textarea className="form-control" required="required"
                                                              value={options[index + 1].content}
                                                              onChange={(event) => {
                                                                  const newOptions = [...options];
                                                                  newOptions[index + 1].content = event.target.value;
                                                                  setOptions(newOptions);
                                                              }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )
                            ))}
                            <div className="row">
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <label>Đáp án đúng</label>
                                        <textarea className="form-control" required="required"
                                               value={answer}
                                               onChange={(event) => {
                                                   setAnswer(event.target.value);
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
                                        <img src={selectedImage.preview} width="100" height="120" alt="images-question"/>
                                    )}
                                </div>
                            </div>
                            <div className="m-t-20 text-center">
                                <button type="submit" className="btn btn-primary btn-lg"
                                        onClick={() => handleUpdate()}>Lưu thay đổi</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="delete_question" className="modal fade" role="dialog">
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
                                    <button type="submit" className="btn btn-danger"
                                            onClick={() => confirmDelete()}
                                            style={{marginLeft: '10px'}}>Xóa</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <ToastContainer/>
        </>
    )
}

export default ExamList;