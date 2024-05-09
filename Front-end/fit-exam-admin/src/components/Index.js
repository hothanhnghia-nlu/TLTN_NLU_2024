import React, {useEffect, useState} from "react";
import Header from "./Header";
import {Link} from "react-router-dom";
import {TabTitle} from "../commons/DynamicTitle";
import {fetchAllSubject} from "../service/SubjectService";
import {fetchAllUser} from "../service/UserService";
import moment from "moment";
import {fetchAllExam} from "../service/ExamService";

const Index = () => {
    TabTitle('Thống kê | FIT Exam Admin');

    const [listStudents, setListStudents] = useState([]);
    const [listExams, setListExams] = useState([]);
    const [totalStudents, setTotalStudents] = useState(0);
    const [totalTeachers, setTotalTeachers] = useState(0);
    const [totalSubjects, setTotalSubjects] = useState(0);
    const [totalExams, setTotalExams] = useState(0);

    useEffect(() => {
        getStudents(0);
        getTeachers(1);
        getSubjects();
        getExams();
    }, [])

    const getStudents = async (role) => {
        let res = await fetchAllUser({ role });
        if (res) {
            setListStudents(res);
            setTotalStudents(res.length);
        }
    }

    const getTeachers = async (role) => {
        let res = await fetchAllUser({ role });
        if (res) {
            setTotalTeachers(res.length);
        }
    }

    const getSubjects = async () => {
        let res = await fetchAllSubject();
        if (res) {
            setTotalSubjects(res.length);
        }
    }

    const getExams = async () => {
        let res = await fetchAllExam();
        if (res && Array.isArray(res)) {
            setListExams(res);
            setTotalExams(res.length);
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

    return (
        <>
            <Header/>

            <div className="page-wrapper">
                <div className="content container-fluid">

                    <div className="page-header">
                        <div className="row">
                            <div className="col-md-6">
                                <h5 className="text-uppercase mb-0 mt-0 page-title">Thống kê</h5>
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
                                        <h3>{totalStudents}</h3>
                                    </div>
                                </div>
                            </Link>
                        </div>
                        <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
                            <Link to="/teachers">
                                <div className="dash-widget dash-widget5">
                                    <div className="dash-widget-info text-left d-inline-block">
                                        <span>Giảng viên</span>
                                        <h3>{totalTeachers}</h3>
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
                                        <h3>{totalSubjects}</h3>
                                    </div>
                                </div>
                            </Link>
                        </div>
                        <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
                            <Link to="/exams">
                                <div className="dash-widget dash-widget5">
                                    <div className="dash-widget-info d-inline-block text-left">
                                        <span>Bài thi</span>
                                        <h3>{totalExams}</h3>
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
                                    </div>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="table-responsive">
                                                <table className="table custom-table">
                                                    <thead className="thead-light">
                                                    <tr>
                                                        <th>STT</th>
                                                        <th>Tên bài thi</th>
                                                        <th>Môn thi</th>
                                                        <th>Thời gian (p)</th>
                                                        <th>Tổng số câu hỏi</th>
                                                        <th>Người tạo</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {listExams && listExams.length <= 5 &&
                                                        listExams.map((item, index) => {
                                                            return (
                                                                <tr key={`exams-${index}`}>
                                                                    <td>{item.id}</td>
                                                                    <td>{item.name}</td>
                                                                    <td>{item.subjectId}</td>
                                                                    <td>{item.examTime}</td>
                                                                    <td>{item.numberOfQuestions}</td>
                                                                    <td>{item.creatorId}</td>
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
                                    </div>
                                </div>
                                <div class="card-body">
                                    <div class="table-responsive">
                                        <table class="table custom-table">
                                            <thead className="thead-light">
                                            <tr>
                                                <th>#</th>
                                                <th>Họ tên</th>
                                                <th>Ảnh đại diện</th>
                                                <th>Email</th>
                                                <th>Số điện thoại</th>
                                                <th>Ngày sinh</th>
                                                <th>Giới tính</th>
                                                <th className="text-center">Trạng thái</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {listStudents && listStudents.length <= 5 &&
                                                listStudents.map((item, index) => {
                                                    return (
                                                        <tr key={`students-${index}`}>
                                                            <td>{item.id}</td>
                                                            <td>{item.name}</td>
                                                            <td>{item.imageId}</td>
                                                            <td>{item.email}</td>
                                                            <td>{item.phone}</td>
                                                            <td>{convertDate({ date: item.dob })}</td>
                                                            <td>{item.gender}</td>
                                                            <td className="text-center">{getStatus(item)}</td>
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
                </div>
            </div>
        </>
    );
}

export default Index;