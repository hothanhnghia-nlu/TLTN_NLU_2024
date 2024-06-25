import React, {useEffect, useState} from "react";
import Header from "../components/Header";
import {Link} from "react-router-dom";
import {TabTitle} from "../commons/DynamicTitle";
import {fetchUserById, updateUser} from "../service/UserService";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import moment from "moment";

const EditProfilePage = () => {
    TabTitle('Hồ sơ của tôi | FIT Exam Admin');

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [dob, setDob] = useState('');
    const [gender, setGender] = useState('');
    const [selectedImage, setSelectedImage] = useState({
        file: null,
        name: '',
        preview: ''
    });

    const [loadingAPI, setLoadingAPI] = useState(false);
    const userId = localStorage.getItem("id");
    const [user, setUser] = useState({});

    useEffect(() => {
        getUserInfo(userId);
    }, [userId]);

    const getUserInfo = async (id) => {
        let res = await fetchUserById({id});
        if (res) {
            setUser(res);
        }
    }

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
            setPhone(user.phone);
            setGender(user.gender);

            if (user.dob) {
                const formattedDate = moment(user.dob).format('YYYY-MM-DD');
                setDob(formattedDate);
            }
        }
    }, [user]);

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
    };

    // Thực hiện Cập nhật thông tin
    const handleUpdate = async () => {
        const userId = user.id;
        const avatar = selectedImage?.file || null;
        const role = user.role;
        const status = user.status;

        try {
            setLoadingAPI(true);

            let res = await updateUser(userId, name, email, phone, dob, gender, role, status, avatar);

            if (res) {
                toast.success("Cập nhật tài khoản thành công!", {
                    onClose: () => {
                        window.location.reload();
                    }
                });
            } else {
                toast.error("Cập nhật tài khoản thất bại!");
            }
        } catch (error) {
            console.error("Error updating user:", error);
        } finally {
            setLoadingAPI(false);
        }
    };

    return (
        <>
            <Header/>

            <div className="page-wrapper">
                <div className="content container-fluid">
                    <div className="page-header">
                        <div className="row">
                            <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                <h5 className="text-uppercase mb-0 mt-0 page-title">Chỉnh sửa hồ sơ</h5>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                <ul className="breadcrumb float-right p-0 mb-0">
                                    <li className="breadcrumb-item"><Link to="/"><i
                                        className="fas fa-home"></i> Trang chủ</Link></li>
                                    <li className="breadcrumb-item"><Link to="#">Hồ sơ</Link></li>
                                    <li className="breadcrumb-item"><span>Chỉnh sửa hồ sơ</span></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="page-content">
                        <div className="row">
                            <div className="col-lg-12 col-md-12 col-sm-12 col-12">
                                <div className="card">
                                    <div className="card-header">
                                        <div className="card-title">
                                            <strong>Thông tin cá nhân</strong>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                                <div className="form-group">
                                                    <label>Họ tên</label>
                                                    <input type="text" className="form-control" required="required"
                                                           value={name}
                                                           onChange={(event) => {
                                                               setName(event.target.value);
                                                           }}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label>Số điện thoại</label>
                                                    <input type="text" className="form-control" required="required"
                                                           value={phone}
                                                           onChange={(event) => {
                                                               setPhone(event.target.value);
                                                           }}
                                                    />
                                                </div>
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
                                            <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                                <div className="form-group">
                                                    <label>Email</label>
                                                    <input type="text" className="form-control" required="required"
                                                           value={email} disabled="disabled"/>
                                                </div>
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

                                            <div className="col-lg-12 col-md-12 col-sm-12 col-12">
                                                <div className="form-group">
                                                    <label>Ảnh đại diện</label>
                                                    <input type="file" className="form-control" accept="image/*"
                                                           onChange={handleFileChange}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    {selectedImage && (
                                                        <img src={selectedImage.preview} width="100" height="120" alt={selectedImage.name}/>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="col-lg-12 col-md-12 col-sm-12 col-12">
                                                <div className="form-group text-center custom-mt-form-group">
                                                    <button className="btn btn-primary mr-2" type="submit"
                                                            onClick={handleUpdate}>
                                                        {loadingAPI && <i className="fas fa-sync fa-spin"></i>}
                                                        &nbsp;Lưu
                                                    </button>
                                                    <Link to="/my-profile">
                                                        <button className="btn btn-secondary" type="reset">Hủy</button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer/>
        </>
    );
}

export default EditProfilePage;