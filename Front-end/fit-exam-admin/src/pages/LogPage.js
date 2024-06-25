import React, {useEffect, useState} from "react";
import {TabTitle} from "../commons/DynamicTitle";
import {Link} from "react-router-dom";
import Header from "../components/Header";
import moment from "moment/moment";
import {fetchAllLog} from "../service/LogService";
import ReactPaginate from "react-paginate";

const LogPage = () => {
    TabTitle('Nhật ký | FIT Exam Admin');

    const [listLogs, setListLogs] = useState([]);
    const [query, setQuery] = useState('');

    useEffect(() => {
        getLogs();
    }, [])

    const getLogs = async () => {
        let res = await fetchAllLog();
        if (res) {
            setListLogs(res);
        }
    }

    const convertDate = ({date}) => {
        const dateMoment = moment(date);
        return dateMoment.format('DD-MM-YYYY HH:mm:ss');
    }

    const getLogStatus = (item) => {
        if (item.status === 0) {
            return <td className="badge-primary" style={{padding: '5px'}}>SUCCESS</td>;
        } else {
            return <td className="badge-danger" style={{padding: '5px'}}>FAILED</td>;
        }
    }

    const [currentItems, setCurrentItems] = useState(null);
    const [searchedItems, setSearchItems] = useState(null);
    const [pageCount, setPageCount] = useState(0);
    const [itemOffset, setItemOffset] = useState(0);
    const itemsPerPage = 5;

    useEffect(() => {
        handleSearch();
    }, [query]);

    useEffect(() => {
        const endOffset = itemOffset + itemsPerPage;
        const itemsToDisplay = query ? searchedItems : listLogs;
        setCurrentItems(itemsToDisplay.slice(itemOffset, endOffset));
        setPageCount(Math.ceil(itemsToDisplay.length / itemsPerPage));
    }, [itemOffset, itemsPerPage, listLogs, query, searchedItems]);

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % (query ? searchedItems.length : listLogs.length);
        setItemOffset(newOffset);
    }

    // Thực hiện Tìm kiếm thông tin
    const handleSearch = () => {
        if (query) {
            const filtered = listLogs.filter(item => {
                const userName = item.user ? item.user.name.toLowerCase() : '';
                const source = item.source.toLowerCase();
                const ip = item.ip.toLowerCase();
                return userName.includes(query.toLowerCase()) || source.includes(query.toLowerCase()) || ip.includes(query.toLowerCase());
            });
            setSearchItems(filtered);
        } else {
            setSearchItems(listLogs);
        }
        setItemOffset(0);
    }

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
                                    <div className="col-md-6">
                                        <div className="form-focus">
                                            <input type="text" className="form-control floating"
                                                   onChange={(e) => setQuery(e.target.value)}/>
                                            <label className="focus-label">Tìm kiếm</label>
                                        </div>
                                    </div>
                                    <div className="col-md-6"/>
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
                                                    <th>Tên tài khoản</th>
                                                    <th>Cấp độ</th>
                                                    <th>Thông tin</th>
                                                    <th>Địa chỉ IP</th>
                                                    <th>Nội dung</th>
                                                    <th>Trạng thái</th>
                                                    <th>Ngày tạo</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {currentItems && currentItems.map((item, index) => {
                                                    return (
                                                        <tr key={`logs-${index}`}>
                                                            <td>{item.id}</td>
                                                            <td>
                                                                {item.user ? (
                                                                    <h2>{item.user.name}</h2>
                                                                ) : (
                                                                    <span>Invalid user</span>
                                                                )}
                                                            </td>
                                                            <td>{item.level}</td>
                                                            <td>{item.source}</td>
                                                            <td>{item.ip}</td>
                                                            <td>{item.content}</td>
                                                            <td>{getLogStatus(item)}</td>
                                                            <td>{convertDate({date: item.createdAt})}</td>
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

export default LogPage;