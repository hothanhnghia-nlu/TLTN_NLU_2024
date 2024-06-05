import React, {useEffect, useState} from "react";
import {TabTitle} from "../commons/DynamicTitle";
import {Link} from "react-router-dom";
import Header from "../components/Header";
import {fetchAllUser, deleteUser, updateUser} from "../service/UserService";
import moment from "moment/moment";
import ReactPaginate from "react-paginate";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {CSVLink} from "react-csv";

const StudentPage = () => {
    TabTitle('Sinh viên | FIT Exam Admin');

    const [listStudents, setListStudents] = useState([]);
    const [totalStudents, setTotalStudents] = useState(0);
    const [dataStudentEdit, setDataStudentEdit] = useState({});
    const [dataStudentDelete, setDataStudentDelete] = useState({});
    const [dataExport, setDataExport] = useState([]);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [dob, setDob] = useState('');
    const [gender, setGender] = useState('');
    const [role, setRole] = useState('');
    const [status, setStatus] = useState('');

    const [query, setQuery] = useState('');
    const keys = ["name", "email", "phone"];

    useEffect(() => {
        getStudents(0);
    }, [])

    const getStudents = async (role) => {
        let res = await fetchAllUser({role});
        if (res) {
            setListStudents(res);
            setTotalStudents(res.length);
        }
    }

    const convertDate = ({date}) => {
        const dateMoment = moment(date);
        return dateMoment.format('DD/MM/YYYY');
    }

    const getStatus = (item) => {
        if (item.status === 1) {
            return <td className="badge-primary" style={{padding: '5px'}}>Đang hoạt động</td>;
        } else {
            return <td className="badge-danger" style={{padding: '5px'}}>Ngừng hoạt động</td>;
        }
    }

    const [currentItems, setCurrentItems] = useState(null);
    const [pageCount, setPageCount] = useState(0);
    const [itemOffset, setItemOffset] = useState(0);
    const itemsPerPage = 5;

    useEffect(() => {
        const endOffset = itemOffset + itemsPerPage;
        setCurrentItems(listStudents.slice(itemOffset, endOffset));
        setPageCount(Math.ceil(totalStudents / itemsPerPage));
    }, [itemOffset, itemsPerPage, listStudents, totalStudents]);

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % totalStudents;
        setItemOffset(newOffset);
    };

    useEffect(() => {
        if (dataStudentEdit) {
            setName(dataStudentEdit.name);
            setEmail(dataStudentEdit.email);
            setPhone(dataStudentEdit.phone);
            setGender(dataStudentEdit.gender);
            setRole(dataStudentEdit.role);
            setStatus(dataStudentEdit.status);

            if (dataStudentEdit.dob) {
                const formattedDate = moment(dataStudentEdit.dob).format('YYYY-MM-DD');
                setDob(formattedDate);
            }
        }
    }, [dataStudentEdit]);

    const handleEditStudent = (student) => {
        setDataStudentEdit(student);
    }

    const handleDeleteStudent = (student) => {
        setDataStudentDelete(student);
    }

    const handleUpdate = async (id) => {
        let res = await updateUser(id, name, email, phone, dob, gender, role, status);

        if (res) {
            toast.success("Cập nhật sinh viên " + id + " thành công!", {
                onClose: () => {
                    window.location.reload();
                }
            });
        } else {
            toast.error("Cập nhật sinh viên " + id + " thất bại!");
        }
    }

    const confirmDelete = async (id) => {
        let res = await deleteUser({id});

        if (res) {
            toast.success("Xóa sinh viên " + id + " thành công!", {
                onClose: () => {
                    window.location.reload();
                }
            });
        } else {
            toast.error("Xóa sinh viên " + id + " thất bại!");
        }
    }

    const currentDate = () => {
        const currentDate = new Date();
        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();
        return `${day < 10 ? '0' + day : day}-${month < 10 ? '0' + month : month}-${year}`;
    }

    const getUsersExport = (event, done) => {
        let result = [];
        if (listStudents && listStudents.length > 0) {
            result.push(["Id", "Họ tên", "Email", "Số điện thoại", "Ngày sinh", "Giới tính"])
            listStudents.map((item, index) => {
                const realIndex = itemOffset + index + 1;
                let arr = [];
                arr[0] = realIndex;
                arr[1] = item.name;
                arr[2] = item.email;
                arr[3] = item.phone;
                arr[4] = convertDate({date: item.dob});
                arr[5] = item.gender;
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
                                <h5 className="text-uppercase mb-0 mt-0 page-title">Sinh viên</h5>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                <ul className="breadcrumb float-right p-0 mb-0">
                                    <li className="breadcrumb-item"><Link to="/"><i
                                        className="fas fa-home"></i> Trang chủ</Link></li>
                                    <li className="breadcrumb-item"><span> Sinh viên</span></li>
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
                                            <label className="focus-label">Họ tên, email, SĐT</label>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="text-right">
                                            <CSVLink
                                                filename={"SINH_VIEN_" + currentDate() + ".csv"}
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
                                                    <th>Họ tên</th>
                                                    <th>Email</th>
                                                    <th>Số điện thoại</th>
                                                    <th>Ngày sinh</th>
                                                    <th className="text-center">Giới tính</th>
                                                    <th className="text-center">Trạng thái</th>
                                                    <th className="text-right">Tính năng</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {currentItems && currentItems.filter((current) => keys.some(key => current[key].toLowerCase().includes(query)))
                                                    .map((item, index) => {
                                                        const realIndex = itemOffset + index + 1;
                                                        return (
                                                            <tr key={`students-${index}`}>
                                                                <td>{realIndex}</td>
                                                                <td>
                                                                    <h2>
                                                                        {item.image && item.image.url ? (
                                                                            <div className="avatar text-white">
                                                                                <img src={item.image.url} alt={item.name} style={{maxWidth: '50px', maxHeight: '70px'}}/>
                                                                            </div>
                                                                        ) : (
                                                                            <span></span>
                                                                        )}
                                                                        {item.name}
                                                                    </h2>
                                                                </td>
                                                                <td>{item.email}</td>
                                                                <td>{item.phone}</td>
                                                                <td>{convertDate({date: item.dob})}</td>
                                                                <td className="text-center">{item.gender}</td>
                                                                <td className="text-center">{getStatus(item)}</td>
                                                                <td className="text-right">
                                                                    <div className="dropdown dropdown-action">
                                                                        <Link to="#" className="action-icon dropdown-toggle"
                                                                              data-toggle="dropdown" aria-expanded="false"><i
                                                                            className="fas fa-ellipsis-v"></i></Link>
                                                                        <div className="dropdown-menu dropdown-menu-right">
                                                                            <Link className="dropdown-item" to="#" title="Edit"
                                                                                  data-toggle="modal" data-target="#edit_user"
                                                                                  onClick={() => handleEditStudent(item)}>
                                                                                <i className="fas fa-pencil-alt m-r-5"></i> Chỉnh sửa</Link>
                                                                            <Link className="dropdown-item" to="#" title="Delete"
                                                                                  data-toggle="modal" data-target="#delete_user"
                                                                                  onClick={() => handleDeleteStudent(item)}>
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

            <div id="edit_user" className="modal fade" role="dialog">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content modal-lg">
                        <div className="modal-header">
                            <h4 className="modal-title">Chỉnh sửa tài khoản</h4>
                            <button type="button" className="close" data-dismiss="modal">&times;</button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>Họ và tên</label>
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
                                            <label>Email</label>
                                            <input type="email" className="form-control" required="required"
                                                   value={email}
                                                   onChange={(event) => {
                                                       setEmail(event.target.value);
                                                   }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>Số điện thoại</label>
                                            <input type="text" className="form-control" required="required"
                                                   value={phone}
                                                   onChange={(event) => {
                                                       setPhone(event.target.value);
                                                   }}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>Ngày sinh</label>
                                            <input type="date" className="form-control" required="required"
                                                   value={dob}
                                                   onChange={(event) => {
                                                       setDob(event.target.value);
                                                   }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>Giới tính</label>
                                            <select
                                                className="form-control select"
                                                value={gender}
                                                onChange={(event) => setGender(event.target.value)}>
                                                <option value="default">---Chọn giới tính---</option>
                                                <option value="Nam">Nam</option>
                                                <option value="Nữ">Nữ</option>
                                                <option value="Khác">Khác</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>Vai trò</label>
                                            <select
                                                className="form-control select"
                                                value={role}
                                                onChange={(event) => setRole(event.target.value)}>
                                                <option value={2}>Admin</option>
                                                <option value={1}>Giảng viên</option>
                                                <option value={0}>Sinh viên</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>Trạng thái</label>
                                            <select
                                                className="form-control select"
                                                value={status}
                                                onChange={(event) => setStatus(event.target.value)}>
                                                <option value={1}>Đang hoạt động</option>
                                                <option value={0}>Ngừng hoạt động</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="m-t-20 text-center">
                                    <button className="btn btn-primary btn-lg mb-3"
                                            onClick={() => handleUpdate(dataStudentEdit.id)}  data-dismiss="modal">Lưu thay đổi</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <div id="delete_user" className="modal fade" role="dialog">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content modal-md">
                        <div className="modal-header">
                            <h4 className="modal-title">Xóa Tài khoản</h4>
                        </div>
                        <div className="modal-body">
                            <p>Bạn có chắc muốn xóa tài khoản này?</p>
                            <div className="m-t-20 text-left">
                                <Link to="#" className="btn btn-white" data-dismiss="modal">Hủy</Link>
                                <button type="submit" className="btn btn-danger"
                                        data-dismiss="modal"
                                        onClick={() => confirmDelete(dataStudentDelete.id)}
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

export default StudentPage;