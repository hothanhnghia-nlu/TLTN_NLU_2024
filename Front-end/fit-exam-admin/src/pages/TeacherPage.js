import React, {useEffect, useState} from "react";
import {TabTitle} from "../commons/DynamicTitle";
import {Link} from "react-router-dom";
import Header from "../components/Header";
import {deleteUser, fetchAllUser, updateUser} from "../service/UserService";
import moment from "moment";
import ReactPaginate from "react-paginate";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const AccountPage = () => {
    TabTitle('Giảng viên | FIT Exam Admin');

    const [listTeachers, setListTeachers] = useState([]);
    const [totalTeachers, setTotalTeachers] = useState(0);
    const [dataTeacherEdit, setDataTeacherEdit] = useState({});
    const [dataTeacherDelete, setDataTeacherDelete] = useState({});

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
        getTeachers(1);
    }, [])

    const getTeachers = async (role) => {
        let res = await fetchAllUser({role});
        if (res) {
            setListTeachers(res);
            setTotalTeachers(res.length);
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
        console.log(`Loading items from ${itemOffset} to ${endOffset}`);
        setCurrentItems(listTeachers.slice(itemOffset, endOffset));
        setPageCount(Math.ceil(totalTeachers / itemsPerPage));
    }, [itemOffset, itemsPerPage, listTeachers, totalTeachers]);

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % totalTeachers;
        console.log(`User requested page number ${event.selected}, which is offset ${newOffset}`);
        setItemOffset(newOffset);
    };

    useEffect(() => {
        if (dataTeacherEdit) {
            setName(dataTeacherEdit.name);
            setEmail(dataTeacherEdit.email);
            setPhone(dataTeacherEdit.phone);
            setGender(dataTeacherEdit.gender);
            setRole(dataTeacherEdit.role);
            setStatus(dataTeacherEdit.status);

            if (dataTeacherEdit.dob) {
                const formattedDate = moment(dataTeacherEdit.dob).format('YYYY-MM-DD');
                setDob(formattedDate);
            }
        }
    }, [dataTeacherEdit]);

    const handleEditTeacher = (teacher) => {
        setDataTeacherEdit(teacher);
    }

    const handleDeleteTeacher = (teacher) => {
        setDataTeacherDelete(teacher);
    }

    const handleUpdate = async (id) => {
        let res = await updateUser({id}, name, email, phone, dob, gender, role, status);

        if (res) {
            toast.success("Cập nhật giáo viên " + id + " thành công!", {
                onClose: () => {
                    window.location.reload();
                }
            });
        } else {
            toast.error("Cập nhật giáo viên " + id + " thất bại!");
        }
    }

    const confirmDelete = async (id) => {
        let res = await deleteUser({id});

        if (res) {
            toast.success("Xóa giáo viên " + id + " thành công!", {
                onClose: () => {
                    window.location.reload();
                }
            });
        } else {
            toast.error("Xóa giáo viên " + id + " thất bại!");
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
                                <h5 className="text-uppercase mb-0 mt-0 page-title">Giảng viên</h5>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                <ul className="breadcrumb float-right p-0 mb-0">
                                    <li className="breadcrumb-item"><Link to="/"><i
                                        className="fas fa-home"></i> Trang chủ</Link></li>
                                    <li className="breadcrumb-item"><span> Giảng viên</span></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="card flex-fill">
                            <div className="card-header">
                                <div className="row align-items-center">
                                    <div className="col-md-6"/>
                                    <div className="col-md-6">
                                        <div className="form-focus">
                                            <input type="text" className="form-control floating" onChange={(e) => setQuery(e.target.value)}/>
                                            <label className="focus-label">Họ tên, email, SĐT</label>
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
                                                    <th>Ảnh đại diện</th>
                                                    <th>Email</th>
                                                    <th>Số điện thoại</th>
                                                    <th>Ngày sinh</th>
                                                    <th>Giới tính</th>
                                                    <th>Trạng thái</th>
                                                    <th className="text-right">Tính năng</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {currentItems && currentItems.filter((current) => keys.some(key => current[key].toLowerCase().includes(query)))
                                                    .map((item, index) => {
                                                        return (
                                                            <tr key={`teachers-${index}`}>
                                                                <td>{item.id}</td>
                                                                <td>{item.name}</td>
                                                                <td>{item.imageId}</td>
                                                                <td>{item.email}</td>
                                                                <td>{item.phone}</td>
                                                                <td>{convertDate({date: item.dob})}</td>
                                                                <td>{item.gender}</td>
                                                                <td className="text-center">{getStatus(item)}</td>
                                                                <td className="text-right">
                                                                    <div className="dropdown dropdown-action">
                                                                        <Link to="#" className="action-icon dropdown-toggle"
                                                                              data-toggle="dropdown" aria-expanded="false"><i
                                                                            className="fas fa-ellipsis-v"></i></Link>
                                                                        <div className="dropdown-menu dropdown-menu-right">
                                                                            <Link className="dropdown-item" to="#" title="Edit"
                                                                                  data-toggle="modal" data-target="#edit_user"
                                                                                  onClick={() => handleEditTeacher(item)}>
                                                                                <i className="fas fa-pencil-alt m-r-5"></i> Chỉnh sửa</Link>
                                                                            <Link className="dropdown-item" to="#" title="Delete"
                                                                                  data-toggle="modal" data-target="#delete_user"
                                                                                  onClick={() => handleDeleteTeacher(item)}>
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


            <div id="edit_user" className="modal" role="dialog">
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
                                            onClick={() => handleUpdate(dataTeacherEdit.id)}  data-dismiss="modal">Lưu thay đổi</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <div id="delete_user" className="modal" role="dialog">
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
                                        onClick={() => confirmDelete(dataTeacherDelete.id)}
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

export default AccountPage;