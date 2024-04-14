import React from "react";
import Header from "./Header";
import {Link} from "react-router-dom";
import {TabTitle} from "../Utils/DynamicTitle";

const Index = () => {
    TabTitle('Thống kê | FIT Exam Admin');

    return (
        <>
            <Header/>
            <div className="page-wrapper">
                <div className="content container-fluid">

                    <div className="page-header">
                        <div className="row">
                            <div className="col-md-6">
                                <h3 className="page-title mb-0">Thống kê</h3>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
                            <Link to="/students">
                                <div className="dash-widget dash-widget5">

                                    <span className="float-left"><img src="assets/img/dash/dash-1.png" alt=""
                                                                      width="80"/></span>
                                    <div className="dash-widget-info text-right">
                                        <span>Sinh viên</span>
                                        <h3>480</h3>
                                    </div>
                                </div>
                            </Link>
                        </div>
                        <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
                            <Link to="/teachers">
                                <div className="dash-widget dash-widget5">
                                    <div className="dash-widget-info text-left d-inline-block">
                                        <span>Giảng viên</span>
                                        <h3>32</h3>
                                    </div>
                                    <span className="float-right"><img src="assets/img/dash/dash-2.png" width="80"
                                                                       alt=""/></span>
                                </div>
                            </Link>
                        </div>
                        <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
                            <Link to="/subjects">
                                <div className="dash-widget dash-widget5">
                                    <span className="float-left"><img src="assets/img/dash/dash-3.png" alt=""
                                                                      width="80"/></span>
                                    <div className="dash-widget-info text-right">
                                        <span>Môn học</span>
                                        <h3>34</h3>
                                    </div>
                                </div>
                            </Link>
                        </div>
                        <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
                            <Link to="/exams">
                                <div className="dash-widget dash-widget5">

                                    <div className="dash-widget-info d-inline-block text-left">
                                        <span>Bài thi</span>
                                        <h3>175</h3>
                                    </div>
                                    <span className="float-right"><img src="assets/img/dash/dash-4.png" alt=""
                                                                       width="80"/></span>
                                </div>
                            </Link>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card flex-fill">
                                <div className="card-header">
                                    <div className="row align-items-center">
                                        <div className="col-auto">
                                            <div className="page-title">
                                                Bài thi gần đây
                                            </div>
                                        </div>
                                        <div className="col text-right">
                                            <div className=" mt-sm-0 mt-2">
                                                <button className="btn btn-light" type="button" data-toggle="dropdown"
                                                        aria-haspopup="true" aria-expanded="false"><i
                                                    className="fas fa-ellipsis-h"></i></button>
                                                <div className="dropdown-menu dropdown-menu-right">
                                                    <a className="dropdown-item" href="#">Action</a>
                                                    <div role="separator" className="dropdown-divider"></div>
                                                    <a className="dropdown-item" href="#">Another action</a>
                                                    <div role="separator" className="dropdown-divider"></div>
                                                    <a className="dropdown-item" href="#">Something else here</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="table-responsive">
                                                <table className="table custom-table">
                                                    <thead className="thead-light">
                                                    <tr>
                                                        <th>Exam Name</th>
                                                        <th>Subject</th>
                                                        <th>Class</th>
                                                        <th>Section</th>
                                                        <th>Time</th>
                                                        <th>Date</th>
                                                        <th className="text-right">Action</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    <tr>
                                                        <td>
                                                            <a href="#" className="avatar bg-green">C</a>
                                                        </td>
                                                        <td>English</td>
                                                        <td>5</td>
                                                        <td>B</td>
                                                        <td>10.00am</td>
                                                        <td>20/1/2019</td>
                                                        <td className="text-right">
                                                            <a href="#"
                                                               className="btn btn-primary btn-sm mb-1">
                                                                <i className="far fa-edit"></i>
                                                            </a>
                                                            <button type="submit" data-toggle="modal"
                                                                    data-target="#delete_employee"
                                                                    className="btn btn-danger btn-sm mb-1">
                                                                <i className="far fa-trash-alt"></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <a href="#"
                                                               className="avatar bg-purple">C</a>
                                                        </td>
                                                        <td>English</td>
                                                        <td>4</td>
                                                        <td>A</td>
                                                        <td>10.00am</td>
                                                        <td>2/1/2019</td>
                                                        <td className="text-right">
                                                            <a href="#"
                                                               className="btn btn-primary btn-sm mb-1">
                                                                <i className="far fa-edit"></i>
                                                            </a>
                                                            <button type="submit" data-toggle="modal"
                                                                    data-target="#delete_employee"
                                                                    className="btn btn-danger btn-sm mb-1">
                                                                <i className="far fa-trash-alt"></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <a href="#" className="avatar bg-green">C</a>
                                                        </td>
                                                        <td>Maths</td>
                                                        <td>6</td>
                                                        <td>B</td>
                                                        <td>10.00am</td>
                                                        <td>2/1/2019</td>
                                                        <td className="text-right">
                                                            <a href="#"
                                                               className="btn btn-primary btn-sm mb-1">
                                                                <i className="far fa-edit"></i>
                                                            </a>
                                                            <button type="submit" data-toggle="modal"
                                                                    data-target="#delete_employee"
                                                                    className="btn btn-danger btn-sm mb-1">
                                                                <i className="far fa-trash-alt"></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <a href="#" className="avatar bg-dark">C</a>
                                                        </td>
                                                        <td>Science</td>
                                                        <td>3</td>
                                                        <td>B</td>
                                                        <td>10.00am</td>
                                                        <td>20/1/2019</td>
                                                        <td class="text-right">
                                                            <a href="#"
                                                               class="btn btn-primary btn-sm mb-1">
                                                                <i class="far fa-edit"></i>
                                                            </a>
                                                            <button type="submit" data-toggle="modal"
                                                                    data-target="#delete_employee"
                                                                    class="btn btn-danger btn-sm mb-1">
                                                                <i class="far fa-trash-alt"></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <a href="#" class="avatar bg-green">C</a>
                                                        </td>
                                                        <td>Maths</td>
                                                        <td>6</td>
                                                        <td>B</td>
                                                        <td>10.00am</td>
                                                        <td>20/1/2019</td>
                                                        <td class="text-right">
                                                            <a href="#"
                                                               class="btn btn-primary btn-sm mb-1">
                                                                <i class="far fa-edit"></i>
                                                            </a>
                                                            <button type="submit" data-toggle="modal"
                                                                    data-target="#delete_employee"
                                                                    class="btn btn-danger btn-sm mb-1">
                                                                <i class="far fa-trash-alt"></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <a href="#" class="avatar bg-dark">C</a>
                                                        </td>
                                                        <td>English</td>
                                                        <td>7</td>
                                                        <td>B</td>
                                                        <td>10.00am</td>
                                                        <td>20/1/2019</td>
                                                        <td class="text-right">
                                                            <a href="#"
                                                               class="btn btn-primary btn-sm mb-1">
                                                                <i class="far fa-edit"></i>
                                                            </a>
                                                            <button type="submit" data-toggle="modal"
                                                                    data-target="#delete_employee"
                                                                    class="btn btn-danger btn-sm mb-1">
                                                                <i class="far fa-trash-alt"></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <a href="#" class="avatar bg-purple">C</a>
                                                        </td>
                                                        <td>Science</td>
                                                        <td>5</td>
                                                        <td>B</td>
                                                        <td>10.00am</td>
                                                        <td>20/1/2019</td>
                                                        <td class="text-right">
                                                            <a href="#"
                                                               class="btn btn-primary btn-sm mb-1">
                                                                <i class="far fa-edit"></i>
                                                            </a>
                                                            <button type="submit" data-toggle="modal"
                                                                    data-target="#delete_employee"
                                                                    class="btn btn-danger btn-sm mb-1">
                                                                <i class="far fa-trash-alt"></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-lg-12">
                            <div class="card">
                                <div class="card-header">
                                    <div class="row align-items-center">
                                        <div class="col-sm-6">
                                            <div class="page-title">
                                                Sinh viên gần đây
                                            </div>
                                        </div>
                                        <div class="col-sm-6 text-sm-right">
                                            <div class=" mt-sm-0 mt-2">
                                                <button class="btn btn-outline-primary mr-2"><img
                                                    src="assets/img/excel.png" alt=""/><span class="ml-2">Excel</span>
                                                </button>
                                                <button class="btn btn-outline-danger mr-2"><img
                                                    src="assets/img/pdf.png" alt="" height="18"/><span
                                                    class="ml-2">PDF</span></button>
                                                <button class="btn btn-light" type="button" data-toggle="dropdown"
                                                        aria-haspopup="true" aria-expanded="false"><i
                                                    class="fas fa-ellipsis-h"></i></button>
                                                <div class="dropdown-menu dropdown-menu-right">
                                                    <a class="dropdown-item" href="#">Action</a>
                                                    <div role="separator" class="dropdown-divider"></div>
                                                    <a class="dropdown-item" href="#">Another action</a>
                                                    <div role="separator" class="dropdown-divider"></div>
                                                    <a class="dropdown-item" href="#">Something else here</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="card-body">
                                    <div class="table-responsive">
                                        <table class="table custom-table">
                                            <thead class="thead-light">
                                            <tr>
                                                <th>Name</th>
                                                <th>Student ID</th>
                                                <th>Class</th>
                                                <th>Section</th>
                                                <th>Mobile</th>
                                                <th>Date of Birth</th>
                                                <th class="text-right">Action</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr>
                                                <td>
                                                    <h2><a href="#" class="avatar text-white"><img
                                                        src="assets/img/profile/img-1.jpg" alt=""/></a><a
                                                        href="#">Parker <span></span></a></h2>
                                                </td>
                                                <td>ST-0d001</td>
                                                <td>1</td>
                                                <td>A</td>
                                                <td>973-584-58700</td>
                                                <td>20/1/2021</td>
                                                <td class="text-right">
                                                    <a href="#" class="btn btn-primary btn-sm mb-1">
                                                        <i class="far fa-edit"></i>
                                                    </a>
                                                    <button type="submit" data-toggle="modal"
                                                            data-target="#delete_employee"
                                                            class="btn btn-danger btn-sm mb-1">
                                                        <i class="far fa-trash-alt"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <h2><a href="#" class="avatar text-white"><img
                                                        src="assets/img/profile/img-2.jpg" alt=""/></a><a
                                                        href="#">Smith <span></span></a></h2>
                                                </td>
                                                <td>ST-0d002</td>
                                                <td>2</td>
                                                <td>B</td>
                                                <td>973-584-58700</td>
                                                <td>20/1/2021</td>
                                                <td class="text-right">
                                                    <a href="#" class="btn btn-primary btn-sm mb-1">
                                                        <i class="far fa-edit"></i>
                                                    </a>
                                                    <button type="submit" data-toggle="modal"
                                                            data-target="#delete_employee"
                                                            class="btn btn-danger btn-sm mb-1">
                                                        <i class="far fa-trash-alt"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <h2><a href="#" class="avatar text-white"><img
                                                        src="assets/img/profile/img-3.jpg" alt=""/></a><a
                                                        href="#">Hensley<span></span></a></h2>
                                                </td>
                                                <td>ST-0d003</td>
                                                <td>1</td>
                                                <td>A</td>
                                                <td>973-584-58700</td>
                                                <td>20/1/2021</td>
                                                <td class="text-right">
                                                    <a href="#" class="btn btn-primary btn-sm mb-1">
                                                        <i class="far fa-edit"></i>
                                                    </a>
                                                    <button type="submit" data-toggle="modal"
                                                            data-target="#delete_employee"
                                                            class="btn btn-danger btn-sm mb-1">
                                                        <i class="far fa-trash-alt"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <h2><a href="#" class="avatar text-white"><img
                                                        src="assets/img/profile/img-4.jpg" alt=""/></a><a
                                                        href="#">Friesen<span></span></a></h2>
                                                </td>
                                                <td>ST-0d004</td>
                                                <td>1</td>
                                                <td>A</td>
                                                <td>973-584-58700</td>
                                                <td>20/1/2021</td>
                                                <td class="text-right">
                                                    <a href="#" class="btn btn-primary btn-sm mb-1">
                                                        <i class="far fa-edit"></i>
                                                    </a>
                                                    <button type="submit" data-toggle="modal"
                                                            data-target="#delete_employee"
                                                            class="btn btn-danger btn-sm mb-1">
                                                        <i class="far fa-trash-alt"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <h2><a href="#" class="avatar text-white"><img
                                                        src="assets/img/profile/img-5.jpg" alt=""/></a><a
                                                        href="#">Jackson<span></span></a></h2>
                                                </td>
                                                <td>ST-0d005</td>
                                                <td>1</td>
                                                <td>A</td>
                                                <td>973-584-58700</td>
                                                <td>20/1/2021</td>
                                                <td class="text-right">
                                                    <a href="#" class="btn btn-primary btn-sm mb-1">
                                                        <i class="far fa-edit"></i>
                                                    </a>
                                                    <button type="submit" data-toggle="modal"
                                                            data-target="#delete_employee"
                                                            class="btn btn-danger btn-sm mb-1">
                                                        <i class="far fa-trash-alt"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <h2><a href="#" class="avatar text-white"><img
                                                        src="assets/img/profile/img-6.jpg" alt=""/></a><a
                                                        href="#">Mason<span></span></a></h2>
                                                </td>
                                                <td>ST-0d006</td>
                                                <td>1</td>
                                                <td>A</td>
                                                <td>973-584-58700</td>
                                                <td>20/1/2021</td>
                                                <td class="text-right">
                                                    <a href="#" class="btn btn-primary btn-sm mb-1">
                                                        <i class="far fa-edit"></i>
                                                    </a>
                                                    <button type="submit" data-toggle="modal"
                                                            data-target="#delete_employee"
                                                            class="btn btn-danger btn-sm mb-1">
                                                        <i class="far fa-trash-alt"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <h2><a href="#" class="avatar text-white"><img
                                                        src="assets/img/profile/img-7.jpg" alt=""/></a><a
                                                        href="#">Garrett <span></span></a></h2>
                                                </td>
                                                <td>ST-0d007</td>
                                                <td>1</td>
                                                <td>A</td>
                                                <td>973-584-58700</td>
                                                <td>20/1/2021</td>
                                                <td class="text-right">
                                                    <a href="#" class="btn btn-primary btn-sm mb-1">
                                                        <i class="far fa-edit"></i>
                                                    </a>
                                                    <button type="submit" data-toggle="modal"
                                                            data-target="#delete_employee"
                                                            class="btn btn-danger btn-sm mb-1">
                                                        <i class="far fa-trash-alt"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Index;