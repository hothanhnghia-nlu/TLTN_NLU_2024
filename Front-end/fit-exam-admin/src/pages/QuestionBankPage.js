import React, {useEffect, useState} from "react";
import {TabTitle} from "../commons/DynamicTitle";
import {Link} from "react-router-dom";
import Header from "../components/Header";
import ReactPaginate from "react-paginate";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {deleteQuestion, fetchAllQuestionByUserId, fetchQuestionById, updateQuestion} from "../service/QuestionService";
import {fetchAllAnswerByQuestionId} from "../service/AnswerService";
import exportFromJSON from 'export-from-json';

const QuestionBankPage = () => {
    TabTitle('Ngân hàng câu hỏi | FIT Exam Admin');

    const [listQuestions, setListQuestions] = useState([]);
    const [listAnswers, setListAnswers] = useState([]);
    const [question, setQuestion] = useState({});
    const [dataQuestionEdit, setDataQuestionEdit] = useState({});
    const [dataQuestionDelete, setDataQuestionDelete] = useState({});
    const [filterQuery, setFilterQuery] = useState('');
    const [query, setQuery] = useState('');
    const [loadingAPI, setLoadingAPI] = useState(false);

    const [content, setContent] = useState('');
    const [examName, setExamName] = useState('');
    const [subjectId, setSubjectId] = useState('');
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

    const userId = localStorage.getItem("id");

    useEffect(() => {
        getQuestions(userId);
    }, [userId]);

    const getQuestions = async (id) => {
        let res = await fetchAllQuestionByUserId({id});
        if (res) {
            setListQuestions(res);
        }
    }

    const getQuestionById = async (id) => {
        let res = await fetchQuestionById({id});
        if (res) {
            setQuestion(res);
        }
    }

    // Thực hiện Xem Câu hỏi
    const handleViewQuestion = async (id) => {
        let res = await fetchAllAnswerByQuestionId({id});
        if (res) {
            setListAnswers(res);
        }
        getQuestionById(id);
    }

    const [currentItems, setCurrentItems] = useState(null);
    const [filteredItems, setFilteredItems] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [itemOffset, setItemOffset] = useState(0);
    const itemsPerPage = 5;

    useEffect(() => {
        handleShow();
    }, [filterQuery]);

    useEffect(() => {
        const endOffset = itemOffset + itemsPerPage;
        const itemsToDisplay = filterQuery ? filteredItems : listQuestions;
        setCurrentItems(itemsToDisplay.slice(itemOffset, endOffset));
        setPageCount(Math.ceil(itemsToDisplay.length / itemsPerPage));
    }, [itemOffset, itemsPerPage, filteredItems, filterQuery, listQuestions]);

    const handleShow = () => {
        if (filterQuery) {
            const filtered = listQuestions.filter(item => {
                return item.exam.subject.name.toLowerCase().includes(filterQuery.toLowerCase());
            });
            setFilteredItems(filtered);
        } else {
            setFilteredItems(listQuestions);
        }
        setItemOffset(0);
    }

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % (filterQuery ? filteredItems.length : listQuestions.length);
        setItemOffset(newOffset);
    }

    // Thực hiện Xuất file XML
    const handleExportXMLFile = () => {
        if (!filterQuery) {
            toast.error("Vui lòng nhập môn thi!");
            return;
        }

        if (filteredItems.length === 0 || !filteredItems[0].exam?.subject?.name) {
            toast.error("Không tìm thấy môn thi!");
            return;
        }

        const item = filteredItems[0];
        const fileName = item.exam.subject.name.replace(/\s+/g, '-');
        const exportType = 'xml';

        exportFromJSON({ data: filteredItems, fileName, exportType });
    }

    const handleAnswerNumChange = (event) => {
        const value = event.target.value;

        if (value === '') {
            setAnswerNum('');
            setOptions([]);
        } else {
            const parsedValue = parseInt(value, 10);
            if (!isNaN(parsedValue) && parsedValue >= 0) {
                const newOptions = Array(parsedValue).fill('').map((_, index) => options[index] || { content: '', isCorrect: false });

                setAnswerNum(parsedValue);
                setOptions(newOptions);
            }
        }
    }

    // Thực hiện Chọn file
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedImage({
                file: file,
                name: file.name,
                preview: URL.createObjectURL(file)
            });
        }
    }

    useEffect(() => {
        if (dataQuestionEdit && dataQuestionEdit.options) {
            setContent(dataQuestionEdit.content);
            setDifficultyLevel(dataQuestionEdit.difficultyLevel);
            setIsMultipleChoice(dataQuestionEdit.isMutipleChoice);
            setOptions(dataQuestionEdit.options);
            setExamName(dataQuestionEdit.examName);
            setExamName(dataQuestionEdit.examName);
            setSubjectId(dataQuestionEdit.subjectId);

            const correctOptions = dataQuestionEdit.options.filter(option => option.isCorrect);
            const correctAnswersString = correctOptions.map(option => option.content).join(', ');

            setCorrectAnswers(correctAnswersString);
        }
    }, [dataQuestionEdit]);

    const handleEditQuestion = (question) => {
        setDataQuestionEdit(question);
    }

    const handleDeleteQuestion = (question) => {
        setDataQuestionDelete(question);
    }

    // Thực hiện Cập nhật câu hỏi
    const handleUpdate = async () => {
        const imageFile = selectedImage?.file || null;
        const questionId = dataQuestionEdit.id;

        try {
            setLoadingAPI(true);

            options.forEach(option => {
                option.isCorrect = correctAnswers.split('\n').includes(option.content);
            });

            let res = await updateQuestion(questionId, content, difficultyLevel, isMultipleChoice, options, imageFile, examName, subjectId);
            if (res && questionId) {
                toast.success("Cập nhật câu hỏi thành công!");
                window.location.reload();
            } else {
                toast.error("Tạo câu hỏi thất bại!");
            }
        } catch (error) {
            console.error("Error creating question:", error);
        } finally {
            setLoadingAPI(false);
        }
    }

    // Thực hiện Xác nhận xóa
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

    const questionContent = question.content;
    const questionImages = question.images;
    let contentToDisplay, imageToDisplay;

    if (questionContent || (questionImages && questionImages.length > 0)) {
        contentToDisplay = <h4>Câu hỏi: {questionContent}</h4>;
        imageToDisplay = questionImages ? <img src={questionImages[0]?.url}  alt=""/> : null;
    } else {
        contentToDisplay = <h4>Không có câu hỏi nào</h4>;
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
                                <div className="row align-items-center">
                                    <div className="col-md-6">
                                        <div className="form-focus">
                                            <input type="text" className="form-control floating"
                                                   onChange={(e) => setQuery(e.target.value)}/>
                                            <label className="focus-label">Tìm kiếm Câu hỏi</label>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-focus">
                                            <input
                                                type="text"
                                                className="form-control floating"
                                                onChange={(e) => setFilterQuery(e.target.value)}
                                            />
                                            <label className="focus-label">Lọc theo Môn thi</label>
                                        </div>
                                    </div>
                                    <div className="col-md-2">
                                        <div className="text-right">
                                            <button className="btn btn-outline-info"
                                                onClick={handleExportXMLFile}>
                                                <img src="assets/img/xml-file.png" alt=""/>
                                                <span className="ml-1">Xuất file XML</span>
                                            </button>
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
                                                {currentItems && currentItems.filter(item => item.content.toLowerCase().includes(query.toLowerCase()))
                                                    .map((item, index) => {
                                                        const realIndex = itemOffset + index + 1;
                                                        return (
                                                            <tr key={`questions-${index}`}>
                                                                <td>{realIndex}</td>
                                                                <td>
                                                                    <h2>{item.content.length > 30 ? item.content.substring(0, 30) + '...' : item.content}</h2>
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


            <div id="view_question" className="modal fade" role="dialog">
                <div className="modal-dialog modal-dialog-centered modal-fullscreen">
                    <div className="modal-content modal-content1">
                        <div className="modal-header modal-header1">
                            <h4 className="modal-title">Chi tiết câu hỏi</h4>
                            <button type="button" className="close" data-dismiss="modal">&times;</button>
                        </div>
                        <div style={{margin: '8px'}}>
                            {contentToDisplay}
                            {imageToDisplay}
                            <div className="table-responsive">
                                <table className="table custom-table datatable">
                                    <thead className="thead-light">
                                    <tr>
                                        <th>Mã câu hỏi</th>
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
                                <div className="col-sm-4">
                                    <label>Tên bài thi</label>
                                    <input type="text" className="form-control" required="required"
                                           value={examName}
                                           onChange={(event) => {
                                               setExamName(event.target.value);
                                           }}
                                    />
                                </div>
                                <div className="col-sm-4">
                                    <label>Đa lựa chọn?</label>
                                    <select
                                        className="form-control select"
                                        value={dataQuestionEdit.isMutipleChoice ? 'true' : 'false'}
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
                                        <img src={selectedImage.preview} width="100" height="120" alt="images-question"/>
                                    )}
                                </div>
                            </div>
                            <div className="m-t-20 text-center">
                                <button type="submit" className="btn btn-primary btn-lg"
                                        onClick={() => handleUpdate()}>
                                    {loadingAPI && <i className="fas fa-sync fa-spin"></i>}
                                    &nbsp;Lưu thay đổi
                                </button>
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

export default QuestionBankPage;