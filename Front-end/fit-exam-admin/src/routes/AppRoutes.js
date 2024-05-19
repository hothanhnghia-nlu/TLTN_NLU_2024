import {Routes, Route} from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import PrivateRoute from "./PrivateRoute";
import HomePage from "../pages/HomePage";
import LogPage from "../pages/LogPage";
import QuestionBankPage from "../pages/QuestionBankPage";
import SubjectPage from "../pages/SubjectPage";
import ExamPage from "../pages/ExamPage";
import FacultyPage from "../pages/FacultyPage";
import TeacherPage from "../pages/TeacherPage";
import StudentPage from "../pages/StudentPage";
import EditProfilePage from "../pages/EditProfilePage";
import ProfilePage from "../pages/ProfilePage";
import NewPasswordPage from "../pages/NewPasswordPage";
import ChangePasswordPage from "../pages/ChangePasswordPage";

const AppRoutes = () => {
    return (
        <>
            <Routes>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/signup" element={<RegisterPage/>}/>
                <Route path="/forgot-password" element={<ForgotPasswordPage/>}/>
                <Route path="/new-password" element={<NewPasswordPage/>}/>
                <Route path="/change-password" element={<ChangePasswordPage/>}/>

                <Route path="/" element={<PrivateRoute><HomePage/></PrivateRoute>}/>
                <Route path="/my-profile" element={<PrivateRoute><ProfilePage/></PrivateRoute>}/>
                <Route path="/edit-profile" element={<PrivateRoute><EditProfilePage/></PrivateRoute>}/>
                <Route path="/students" element={<PrivateRoute><StudentPage/></PrivateRoute>}/>
                <Route path="/exams" element={<PrivateRoute><ExamPage/></PrivateRoute>}/>
                <Route path="/question-bank" element={<PrivateRoute><QuestionBankPage/></PrivateRoute>}/>
                <Route path="/teachers" element={<PrivateRoute><TeacherPage/></PrivateRoute>}/>
                <Route path="/faculties" element={<PrivateRoute><FacultyPage/></PrivateRoute>}/>
                <Route path="/subjects" element={<PrivateRoute><SubjectPage/></PrivateRoute>}/>
                <Route path="/logs" element={<PrivateRoute><LogPage/></PrivateRoute>}/>
            </Routes>
        </>
    )
}

export default AppRoutes;