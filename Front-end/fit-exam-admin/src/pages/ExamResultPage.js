import React, {useEffect, useState} from "react";
import {TabTitle} from "../commons/DynamicTitle";
import {Link} from "react-router-dom";
import Header from "../components/Header";
import moment from "moment/moment";
import {fetchAllResultByTeacherId, fetchResultDetailByQuestionId} from "../service/ResultService";
import ReactPaginate from "react-paginate";
import {CSVLink} from "react-csv";

const ExamResultPage = () => {
    TabTitle('Kết quả thi | FIT Exam Admin');

    const [listResults, setListResults] = useState([]);
    const [listAnswers, setListAnswers] = useState([]);
    const [totalResults, setTotalResults] = useState([]);
    const [dataExport, setDataExport] = useState([]);
    const [query, setQuery] = useState('');

    const userId = localStorage.getItem("id");
    
    useEffect(() => {
        getResults(userId);
    }, [userId]);

    const getResults = async (id) => {
        let res = await fetchAllResultByTeacherId({id});
        if (res) {
            setListResults(res);
            setTotalResults(res.length);
        }
    }

    const handleViewAnswer = async (id) => {
        let res = await fetchResultDetailByQuestionId({id});
        if (res) {
            setListAnswers(res);
        }
    }

    const convertDate = ({date}) => {
        const dateMoment = moment(date);
        return dateMoment.format('DD-MM-YYYY HH:mm:ss');
    }

    const [currentItems, setCurrentItems] = useState(null);
    const [pageCount, setPageCount] = useState(0);
    const [itemOffset, setItemOffset] = useState(0);
    const itemsPerPage = 5;

    useEffect(() => {
        const endOffset = itemOffset + itemsPerPage;
        setCurrentItems(listResults.slice(itemOffset, endOffset));
        setPageCount(Math.ceil(totalResults / itemsPerPage));
    }, [itemOffset, itemsPerPage, listResults, totalResults]);

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % totalResults;
        setItemOffset(newOffset);
    };

    const currentDate = () => {
        const currentDate = new Date();
        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();
        return `${day < 10 ? '0' + day : day}-${month < 10 ? '0' + month : month}-${year}`;
    }

    const getUsersExport = (event, done) => {
        let result = [];
        if (listResults && listResults.length > 0) {
            result.push(["STT", "Tên thí sinh", "Tên bài thi", "Tổng số câu đúng", "Điểm thi", "Tổng thời gian thi", "Ngày thi"])
            listResults.map((item, index) => {
                let arr = [];
                arr[0] = item.id;
                arr[1] = item.user.name;
                arr[2] = item.exam.name;
                arr[3] = item.totalCorrectAnswer;
                arr[4] = item.score;
                arr[5] = item.overallTime;
                arr[6] = convertDate({date: item.examDate});
                result.push(arr);
            });
            setDataExport(result);
            done();
        }
    }

    const getClassification = (item) => {
        if (item.score >= 5.0) {
            return <td className="text-center" style={{color: 'red', fontWeight: 'bold'}}>ĐẠT</td>
        } else {
            return <td className="text-center" style={{color: 'red', fontWeight: 'bold'}}>KHÔNG ĐẠT</td>
        }
    }

    function convertToMinutesSeconds(totalMinutes) {
        var minutes = Math.floor(totalMinutes);
        var seconds = Math.round((totalMinutes - minutes) * 60);
        return minutes + "m" + seconds + "s";
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
                                <h5 className="text-uppercase mb-0 mt-0 page-title">Kết quả thi</h5>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                <ul className="breadcrumb float-right p-0 mb-0">
                                    <li className="breadcrumb-item"><Link to="/"><i
                                        className="fas fa-home"></i> Trang chủ</Link></li>
                                    <li className="breadcrumb-item"><span> Kết quả thi</span></li>
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
                                            <input type="text" className="form-control floating" onChange={(e) => setQuery(e.target.value)}/>
                                            <label className="focus-label">Tên thí sinh</label>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="text-right">
                                            <CSVLink
                                                filename={"KET_QUA_THI_" + currentDate() + ".csv"}
                                                className="btn btn-outline-primary mr-2"
                                                data={dataExport}
                                                asyncOnClick={true}
                                                onClick={getUsersExport}>
                                                <img src="assets/img/excel.png" alt=""/>
                                                <span className="ml-2">Excel</span>
                                            </CSVLink>
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
                                                    <th>#</th>
                                                    <th>Tên thí sinh</th>
                                                    <th>Tên bài thi</th>
                                                    <th className="text-center">Số câu đúng</th>
                                                    <th className="text-center">Điểm thi</th>
                                                    <th className="text-center">Kết quả</th>
                                                    <th className="text-center">Tổng thời gian thi</th>
                                                    <th>Ngày thi</th>
                                                    <th className="text-right">Tính năng</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {currentItems && currentItems.filter(current => current.user.name.toLowerCase().includes(query))
                                                    .map((item, index) => {
                                                        return (
                                                            <tr key={`results-${index}`}>
                                                                <td>{item.id}</td>
                                                                <td>
                                                                    {item.user ? (
                                                                        <h2>{item.user.name}</h2>
                                                                    ) : (
                                                                        <span>Invalid user</span>
                                                                    )}
                                                                </td>
                                                                <td>
                                                                    {item.exam ? (
                                                                        <h2>{item.exam.name}</h2>
                                                                    ) : (
                                                                        <span>Invalid exam</span>
                                                                    )}
                                                                </td>
                                                                <td className="text-center">{item.totalCorrectAnswer}</td>
                                                                <td className="text-center">{item.score}</td>
                                                                {getClassification(item)}
                                                                <td className="text-center">{convertToMinutesSeconds(item.overallTime)}</td>
                                                                <td>{convertDate({date: item.examDate})}</td>
                                                                <td className="text-right">
                                                                    <button type="submit" data-toggle="modal"
                                                                            data-target="#view_answer"
                                                                            className="btn btn-primary btn-sm mb-1"
                                                                            onClick={() => handleViewAnswer(item.id)}>
                                                                        <i className="far fa-eye" title="Xem"></i>
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

            <div id="view_answer" className="modal fade" role="dialog">
                <div className="modal-dialog modal-dialog-centered modal-fullscreen">
                    <div className="modal-content modal-content1">
                        <div className="modal-header modal-header1">
                            <h4 className="modal-title">Chi tiết câu trả lời</h4>
                            <button type="button" className="close" data-dismiss="modal">&times;</button>
                        </div>
                        <div>
                            <div className="table-responsive">
                                <table className="table custom-table datatable">
                                    <thead className="thead-light">
                                    <tr>
                                        <th>#</th>
                                        <th>Câu hỏi</th>
                                        <th>Câu trả lời</th>
                                        <th>Đúng/sai</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {listAnswers && listAnswers.length > 0 &&
                                        listAnswers.map((item, index) => {
                                            const realIndex = itemOffset + index + 1;
                                            return (
                                                <tr key={`answers-${index}`}>
                                                    <td>{realIndex}</td>
                                                    <td>
                                                        {item.question ? (
                                                            <h2>{item.question.content}</h2>
                                                        ) : (
                                                            <span>Invalid question</span>
                                                        )}
                                                    </td>
                                                    <td>
                                                        {item.answer ? (
                                                            <h2>{item.answer.content}</h2>
                                                        ) : (
                                                            <span>Invalid question</span>
                                                        )}
                                                    </td>
                                                    {getCorrectAnswer(item)}
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
        </>
    )
}

export default ExamResultPage;