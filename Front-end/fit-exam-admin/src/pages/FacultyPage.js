import React, {useEffect, useState} from "react";
import {TabTitle} from "../commons/DynamicTitle";
import {Link} from "react-router-dom";
import Header from "../components/Header";
import {createFaculty, fetchAllFaculty} from "../service/FacultyService";
import ReactPaginate from "react-paginate";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {deleteFaculty, updateFaculty} from "../service/FacultyService";
import {CSVLink} from "react-csv";

const FacultyPage = () => {
    TabTitle('Quản lý khoa | FIT Exam Admin');

    const [listFaculties, setListFaculties] = useState([]);
    const [totalFaculties, setTotalFaculties] = useState(0);
    const [dataFacultyEdit, setDataFacultyEdit] = useState({});
    const [dataFacultyDelete, setDataFacultyDelete] = useState({});
    const [dataExport, setDataExport] = useState([]);
    const [name, setName] = useState('');
    const [query, setQuery] = useState('');

    useEffect(() => {
        getFaculties();
    }, [])

    const getFaculties = async () => {
        let res = await fetchAllFaculty();
        if (res) {
            setListFaculties(res);
            setTotalFaculties(res.length);
        }
    }

    const [currentItems, setCurrentItems] = useState(null);
    const [pageCount, setPageCount] = useState(0);
    const [itemOffset, setItemOffset] = useState(0);
    const itemsPerPage = 5;

    useEffect(() => {
        const endOffset = itemOffset + itemsPerPage;
        console.log(`Loading items from ${itemOffset} to ${endOffset}`);
        setCurrentItems(listFaculties.slice(itemOffset, endOffset));
        setPageCount(Math.ceil(totalFaculties / itemsPerPage));
    }, [itemOffset, itemsPerPage, listFaculties, totalFaculties]);

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % totalFaculties;
        console.log(`User requested page number ${event.selected}, which is offset ${newOffset}`);
        setItemOffset(newOffset);
    };

    const handleSave = async () => {
        let res = await createFaculty(name);
        if (res && res.id) {
            setName('');

            toast.success("Tạo khoa thành công!", {
                onClose: () => {
                    window.location.reload();
                }
            });
        } else {
            toast.error("Tạo khoa thất bại!");
        }
    }

    useEffect(() => {
        if (dataFacultyEdit) {
            setName(dataFacultyEdit.name);
        }
    }, [dataFacultyEdit]);

    const handleEditFaculty = (faculty) => {
        setDataFacultyEdit(faculty);
    }

    const handleDeleteFaculty = (faculty) => {
        setDataFacultyDelete(faculty);
    }

    const handleUpdate = async () => {
        let facultyId = dataFacultyEdit.id;
        let res = await updateFaculty(facultyId, name);

        if (res && facultyId) {
            toast.success("Cập nhật khoa thành công!", {
                onClose: () => {
                    window.location.reload();
                }
            });
        } else {
            toast.error("Cập nhật khoa thất bại!");
        }
    }

    const confirmDelete = async () => {
        let facultyId = dataFacultyDelete.id;
        let res = await deleteFaculty(facultyId);

        if (res && facultyId) {
            toast.success("Xóa khoa thành công!", {
                onClose: () => {
                    window.location.reload();
                }
            });
        } else {
            toast.error("Xóa khoa thất bại!");
        }
    }

    const currentDate = () => {
        const currentDate = new Date();
        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();
        return `${day < 10 ? '0' + day : day}-${month < 10 ? '0' + month : month}-${year}`;
    }

    const getFacultiesExport = (event, done) => {
        let result = [];
        if (listFaculties && listFaculties.length > 0) {
            result.push(["Mã khoa", "Tên khoa"])
            listFaculties.map((item, index) => {
                let arr = [];
                arr[0] = item.id;
                arr[1] = item.name;
                result.push(arr);
            });
            setDataExport(result);
            done();
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
                        <div className="card flex-fill">
                            <div className="card-header">
                                <div className="row filter-row">
                                    <div className="col-md-6">
                                        <div className="form-focus">
                                            <input type="text" className="form-control floating"
                                                   onChange={(e) => setQuery(e.target.value)}/>
                                            <label className="focus-label">Tên khoa</label>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div>
                                            <Link to="#" className="btn btn-primary float-right btn-rounded"
                                                  data-toggle="modal" data-target="#add_Facultie"
                                                  style={{borderRadius: "50px", textTransform: "none"}}>
                                                <i className="fas fa-plus"></i> Thêm khoa</Link>
                                        </div>
                                        <div>
                                            <CSVLink
                                                filename={"KHOA_" + currentDate() + ".csv"}
                                                className="btn btn-success float-right btn-rounded mr-4"
                                                style={{borderRadius: "50px", textTransform: "none"}}
                                                data={dataExport}
                                                asyncOnClick={true}
                                                onClick={getFacultiesExport}>
                                                <i className="fas fa-file-download"></i> Xuất File
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
                                                    <th>Mã khoa</th>
                                                    <th>Tên khoa</th>
                                                    <th className="text-right">Tính năng</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {currentItems && currentItems.filter(current => current.name.toLowerCase().includes(query))
                                                    .map((item, index) => {
                                                        return (
                                                            <tr key={`faculties-${index}`}>
                                                                <td>{item.id}</td>
                                                                <td>{item.name}</td>
                                                                <td className="text-right">
                                                                    <button type="submit" data-toggle="modal"
                                                                            data-target="#edit_Facultie"
                                                                            className="btn btn-primary btn-sm mb-1"
                                                                            onClick={() => handleEditFaculty(item)}>
                                                                        <i className="far fa-edit" title="Sửa"></i>
                                                                    </button>
                                                                    <button type="submit" data-toggle="modal"
                                                                            data-target="#delete_Facultie"
                                                                            className="btn btn-danger btn-sm mb-1"
                                                                            onClick={() => handleDeleteFaculty(item)}
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


            <div id="add_Facultie" className="modal" role="dialog">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content modal-lg">
                        <div className="modal-header">
                            <h4 className="modal-title">Thêm khoa</h4>
                            <button type="button" className="close" data-dismiss="modal">&times;</button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Tên khoa</label>
                                <input type="text" className="form-control" required="required"
                                       value={name}
                                       onChange={(event) => {
                                           setName(event.target.value);
                                       }}
                                />
                            </div>
                            <div className="m-t-20 text-center">
                                <button className="btn btn-primary btn-lg"
                                        onClick={() => handleSave()} data-dismiss="modal">Tạo khoa
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="edit_Facultie" className="modal" role="dialog">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content modal-lg">
                        <div className="modal-header">
                            <h4 className="modal-title">Chỉnh sửa khoa</h4>
                            <button type="button" className="close" data-dismiss="modal">&times;</button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Tên khoa</label>
                                <input type="text" className="form-control" required="required"
                                       value={name}
                                       onChange={(event) => {
                                           setName(event.target.value);
                                       }}
                                />
                            </div>
                            <div className="m-t-20 text-center">
                                <button className="btn btn-primary btn-lg"
                                        onClick={() => handleUpdate()} data-dismiss="modal">Lưu thay đổi
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="delete_Facultie" className="modal" role="dialog">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content modal-md">
                        <div className="modal-header">
                            <h4 className="modal-title">Xóa khoa</h4>
                        </div>
                        <div className="modal-body">
                            <p>Bạn có chắc muốn xóa khoa này?</p>
                            <div className="m-t-20"><Link to="#" className="btn btn-white"
                                                          data-dismiss="modal">Hủy</Link>
                                <button type="submit" className="btn btn-danger"
                                        data-dismiss="modal"
                                        onClick={() => confirmDelete()}
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

export default FacultyPage;