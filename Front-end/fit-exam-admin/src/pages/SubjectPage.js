import React, {useEffect, useState} from "react";
import {TabTitle} from "../commons/DynamicTitle";
import {Link} from "react-router-dom";
import Header from "../components/Header";
import {createSubject, deleteSubject, fetchAllSubject, updateSubject} from "../service/SubjectService";
import ReactPaginate from "react-paginate";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {CSVLink} from "react-csv";

const SubjectPage = () => {
    TabTitle('Môn học | FIT Exam Admin');

    const [listSubjects, setListSubjects] = useState([]);
    const [totalSubjects, setTotalSubjects] = useState(0);
    const [dataSubjectEdit, setDataSubjectEdit] = useState({});
    const [dataSubjectDelete, setDataSubjectDelete] = useState({});
    const [dataExport, setDataExport] = useState([]);

    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [credit, setCredit] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);

    const [query, setQuery] = useState('');
    const keys = ["id", "name"];

    useEffect(() => {
        getSubjects();
    }, []);

    const getSubjects = async () => {
        let res = await fetchAllSubject();
        if (res) {
            setListSubjects(res);
            setTotalSubjects(res.length);
        }
    }

    const [currentItems, setCurrentItems] = useState(null);
    const [pageCount, setPageCount] = useState(0);
    const [itemOffset, setItemOffset] = useState(0);
    const itemsPerPage = 5;

    useEffect(() => {
        const endOffset = itemOffset + itemsPerPage;
        console.log(`Loading items from ${itemOffset} to ${endOffset}`);
        setCurrentItems(listSubjects.slice(itemOffset, endOffset));
        setPageCount(Math.ceil(totalSubjects / itemsPerPage));
    }, [itemOffset, itemsPerPage, listSubjects, totalSubjects]);

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % totalSubjects;
        console.log(`User requested page number ${event.selected}, which is offset ${newOffset}`);
        setItemOffset(newOffset);
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];

        setSelectedImage({
            file: file,
            name: file.name,
            preview: URL.createObjectURL(file)
        });
    };

    const handleSave = async () => {
        const imageFile = selectedImage.file;
        try {
            let res = await createSubject(id, name, credit, imageFile);
            if (res && res.id) {
                setId('');
                setName('');
                setCredit('');
                setSelectedImage(null);

                toast.success("Tạo môn " + id + " thành công!", {
                    onClose: () => {
                        window.location.reload();
                    }
                });
            } else {
                toast.error("Tạo môn " + id + " thất bại!");
            }
        } catch (error) {
            console.error("Error creating subject:", error);
        }
    }

    useEffect(() => {
        if (dataSubjectEdit) {
            setId(dataSubjectEdit.id);
            setName(dataSubjectEdit.name);
            setCredit(dataSubjectEdit.credit);
        }
    }, [dataSubjectEdit]);

    const handleEditSubject = (subject) => {
        setDataSubjectEdit(subject);
    }

    const handleDeleteSubject = (subject) => {
        setDataSubjectDelete(subject);
    }

    const handleUpdate = async () => {
        let subjectId = dataSubjectEdit.id;
        const imageFile = selectedImage.file;
        try {
            let res = await updateSubject(subjectId, name, credit, imageFile);

            if (res && subjectId) {
                toast.success("Cập nhật môn " + subjectId + " thành công!", {
                    onClose: () => {
                        window.location.reload();
                    }
                });
            } else {
                toast.error("Cập nhật môn " + subjectId + " thất bại!");
            }
        } catch (error) {
            console.error("Error creating subject:", error);
        }
    }

    const confirmDelete = async () => {
        let subjectId = dataSubjectDelete.id;
        let res = await deleteSubject(subjectId);

        if (res && subjectId) {
            toast.success("Xóa môn " + subjectId + " thành công!", {
                onClose: () => {
                    window.location.reload();
                }
            });
        } else {
            toast.error("Xóa môn " + subjectId + " thất bại!");
        }
    }

    const currentDate = () => {
        const currentDate = new Date();
        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();
        return `${day < 10 ? '0' + day : day}-${month < 10 ? '0' + month : month}-${year}`;
    }

    const getSubjectsExport = (event, done) => {
        let result = [];
        if (listSubjects && listSubjects.length > 0) {
            result.push(["Mã môn", "Tên môn học", "Số tín chỉ"])
            // eslint-disable-next-line array-callback-return
            listSubjects.map((item, index) => {
                let arr = [];
                arr[0] = item.id;
                arr[1] = item.name;
                arr[2] = item.credit;
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
                                <h5 className="text-uppercase mb-0 mt-0 page-title">Môn học</h5>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                <ul className="breadcrumb float-right p-0 mb-0">
                                    <li className="breadcrumb-item"><Link to="/"><i
                                        className="fas fa-home"></i> Trang chủ</Link></li>
                                    <li className="breadcrumb-item"><span> Môn học</span></li>
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
                                            <label className="focus-label">Mã môn học, Tên môn học</label>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div>
                                            <Link to="#" className="btn btn-primary float-right btn-rounded"
                                                  data-toggle="modal" data-target="#add_subject"
                                                  style={{borderRadius: "50px", textTransform: "none"}}>
                                                <i className="fas fa-plus"></i> Thêm môn học</Link>
                                        </div>
                                        <div>
                                            <CSVLink
                                                filename={"MON_HOC_" + currentDate() + ".csv"}
                                                className="btn btn-info float-right btn-rounded mr-4"
                                                style={{borderRadius: "50px", textTransform: "none"}}
                                                data={dataExport}
                                                asyncOnClick={true}
                                                onClick={getSubjectsExport}>
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
                                                    <th>Mã môn học</th>
                                                    <th>Tên môn học</th>
                                                    <th className="text-center">Hình ảnh</th>
                                                    <th className="text-center">Số tín chỉ</th>
                                                    <th className="text-right">Tính năng</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {currentItems && currentItems.filter((current) => keys.some(key => current[key].toLowerCase().includes(query)))
                                                    .map((item, index) => {
                                                        return (
                                                            <tr key={`subjects-${index}`}>
                                                                <td>{item.id}</td>
                                                                <td>
                                                                    <h2>{item.name}</h2>
                                                                </td>
                                                                <td className="text-center">
                                                                    {item.image.url ? (
                                                                        <img src={item.image.url} alt={item.name} style={{ maxWidth: '50px', maxHeight: '70px' }} />
                                                                    ) : (
                                                                        <span>No Image</span>
                                                                    )}
                                                                </td>
                                                                <td className="text-center">{item.credit}</td>
                                                                <td className="text-right">
                                                                    <button type="submit" data-toggle="modal"
                                                                            data-target="#edit_subject"
                                                                            className="btn btn-primary btn-sm mb-1"
                                                                            onClick={() => handleEditSubject(item)}>
                                                                        <i className="far fa-edit" title="Sửa"></i>
                                                                    </button>
                                                                    <button type="submit" data-toggle="modal"
                                                                            data-target="#delete_subject"
                                                                            className="btn btn-danger btn-sm mb-1"
                                                                            onClick={() => handleDeleteSubject(item)}
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


            <div id="add_subject" className="modal" role="dialog">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content modal-lg">
                        <div className="modal-header">
                            <h4 className="modal-title">Thêm môn học</h4>
                            <button type="button" className="close" data-dismiss="modal">&times;</button>
                        </div>
                        <div className="modal-body">
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>Mã môn học</label>
                                            <input type="number" className="form-control" required="required"
                                                   value={id}
                                                   onChange={(event) => {
                                                       setId(event.target.value);
                                                   }}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>Số tín chỉ</label>
                                            <input type="number" className="form-control" required="required"
                                                   value={credit}
                                                   onChange={(event) => {
                                                       setCredit(event.target.value);
                                                   }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-12">
                                        <div className="form-group">
                                            <label>Tên môn học</label>
                                            <input type="text" className="form-control" required="required"
                                                   value={name}
                                                   onChange={(event) => {
                                                       setName(event.target.value);
                                                   }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-8">
                                        <div className="form-group">
                                            < label>Hình ảnh</label>
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
                                            <img src={selectedImage.preview} width="100" height="120" alt={name}/>
                                        )}
                                    </div>
                                </div>
                                <div className="m-t-20 text-center">
                                    <button className="btn btn-primary btn-lg"
                                    onClick={() => handleSave()}  data-dismiss="modal">Tạo môn học</button>
                                </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="edit_subject" className="modal" role="dialog">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content modal-lg">
                        <div className="modal-header">
                            <h4 className="modal-title">Chỉnh sửa môn học</h4>
                            <button type="button" className="close" data-dismiss="modal">&times;</button>
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <label>Mã môn học</label>
                                        <input type="number" className="form-control" disabled="disabled"
                                               value={id}
                                               onChange={(event) => {
                                                   setId(event.target.value);
                                               }}
                                        />
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <label>Số tín chỉ</label>
                                        <input type="number" className="form-control" required="required"
                                               value={credit}
                                               onChange={(event) => {
                                                   setCredit(event.target.value);
                                               }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-12">
                                    <div className="form-group">
                                        <label>Tên môn học</label>
                                        <input type="text" className="form-control" required="required"
                                               value={name}
                                               onChange={(event) => {
                                                   setName(event.target.value);
                                               }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-8">
                                    <div className="form-group">
                                        <label>Hình ảnh</label>
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
                                        <img src={selectedImage.preview} width="100" height="120" alt={name} />
                                    )}
                                </div>
                            </div>
                            <div className="m-t-20 text-center">
                                <button className="btn btn-primary btn-lg"
                                        onClick={() => handleUpdate()}  data-dismiss="modal">Lưu thay đổi</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="delete_subject" className="modal" role="dialog">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content modal-md">
                        <div className="modal-header">
                            <h4 className="modal-title">Xóa Môn học</h4>
                        </div>
                        <form>
                            <div className="modal-body">
                                <p>Bạn có chắc muốn xóa môn học này?</p>
                                <div className="m-t-20"><Link to="#" className="btn btn-white"
                                                              data-dismiss="modal">Hủy</Link>
                                    <button type="submit" className="btn btn-danger"
                                            onClick={() => confirmDelete()}
                                            style={{marginLeft: '10px'}} data-dismiss="modal">Xóa
                                    </button>
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

export default SubjectPage;