import React, {useEffect, useState} from "react";
import {TabTitle} from "../commons/DynamicTitle";
import {Link} from "react-router-dom";
import Header from "../components/Header";
import moment from "moment/moment";
import {fetchAllLog} from "../service/LogService";
import ReactPaginate from "react-paginate";

const ExamList = () => {
    TabTitle('Nhật ký | FIT Exam Admin');
    
    const [listLogs, setListLogs] = useState([]);
    const [totalLogs, setTotalLogs] = useState([]);
    const [query, setQuery] = useState('');
    const keys = ["source", "content"];

    useEffect(() => {
        getLogs();
    }, [])

    const getLogs = async () => {
        let res = await fetchAllLog();
        if (res) {
            setListLogs(res);
            setTotalLogs(res.length);
        }
    }

    const convertDate = ({date}) => {
        const dateMoment = moment(date);
        return dateMoment.format('DD/MM/YYYY HH:mm:ss');
    }

    const getLogStatus = (item) => {
        if (item.status === 0) {
            return <td className="badge-primary" style={{padding: '5px'}}>SUCCESS</td>;
        } else {
            return <td className="badge-danger" style={{padding: '5px'}}>FAILED</td>;
        }
    }

    const [currentItems, setCurrentItems] = useState(null);
    const [pageCount, setPageCount] = useState(0);
    const [itemOffset, setItemOffset] = useState(0);
    const itemsPerPage = 5;

    useEffect(() => {
        const endOffset = itemOffset + itemsPerPage;
        console.log(`Loading items from ${itemOffset} to ${endOffset}`);
        setCurrentItems(listLogs.slice(itemOffset, endOffset));
        setPageCount(Math.ceil(totalLogs / itemsPerPage));
    }, [itemOffset, itemsPerPage, listLogs, totalLogs]);

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % totalLogs;
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
                                <h5 className="text-uppercase mb-0 mt-0 page-title">Quản lý nhật ký</h5>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                <ul className="breadcrumb float-right p-0 mb-0">
                                    <li className="breadcrumb-item"><Link to="/"><i
                                        className="fas fa-home"></i> Trang chủ</Link></li>
                                    <li className="breadcrumb-item"><span> Nhật ký</span></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="card flex-fill">
                            <div className="card-header">
                                <div className="row filter-row">
                                    <div className="col-md-6"/>
                                    <div className="col-md-6">
                                        <div className="form-focus">
                                            <input type="text" className="form-control floating"
                                                   onChange={(e) => setQuery(e.target.value)}/>
                                            <label className="focus-label">Tìm kiếm</label>
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
                                                    <th>Mã tài khoản</th>
                                                    <th>Cấp độ</th>
                                                    <th>Thông tin</th>
                                                    <th>Địa chỉ IP</th>
                                                    <th>Nội dung</th>
                                                    <th>Trạng thái</th>
                                                    <th>Ngày tạo</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {currentItems && currentItems.filter((current) => keys.some(key => current[key].toLowerCase().includes(query)))
                                                    .map((item, index) => {
                                                    return (
                                                        <tr key={`logs-${index}`}>
                                                            <td>{item.id}</td>
                                                            <td>{item.userId}</td>
                                                            <td>{item.level}</td>
                                                            <td>{item.source}</td>
                                                            <td>{item.ip}</td>
                                                            <td>{item.content}</td>
                                                            <td>{getLogStatus(item)}</td>
                                                            <td>{convertDate({ date: item.createdAt })}</td>
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
        </>
    )
}

export default ExamList;