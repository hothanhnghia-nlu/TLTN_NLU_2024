import {Routes, Route} from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import PrivateRoute from "./PrivateRoute";
import HomePage from "../pages/HomePage";
import ProfilePage from "../pages/ProfilePage";
import EditProfilePage from "../pages/EditProfilePage";
import StudentPage from "../pages/StudentPage";
import TeacherPage from "../pages/TeacherPage";
import FacultyPage from "../pages/FacultyPage";
import ExamPage from "../pages/ExamPage";
import SubjectPage from "../pages/SubjectPage";
import QuestionBankPage from "../pages/QuestionBankPage";
import LogPage from "../pages/LogPage";

const AppRoutes = () => {
    return (
        <>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/" element={<HomePage />} />
                <Route path="/my-profile" element={<ProfilePage />} />
                <Route path="/edit-profile" element={<EditProfilePage />} />
                <Route path="/students" element={<StudentPage />} />
                <Route path="/teachers" element={<TeacherPage />} />
                <Route path="/faculties" element={<FacultyPage />} />
                <Route path="/exams" element={<ExamPage />} />
                <Route path="/subjects" element={<SubjectPage />} />
                <Route path="/question-bank" element={<QuestionBankPage />} />
                <Route path="/logs" element={<LogPage />} />
            </Routes>
        </>
    )
}

export default AppRoutes;